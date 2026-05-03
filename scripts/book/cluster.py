"""TF-IDF + KMeans clustering of conversations into themed chapters.

Each cluster is auto-named from its top discriminative TF-IDF terms. Within a
cluster, conversations are scored by length × engagement so the best ~K are
selected for inclusion in the chapter.
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Iterable

import numpy as np
from sklearn.cluster import KMeans
from sklearn.feature_extraction.text import TfidfVectorizer

from parse import Conversation


STOPWORDS = {
    # Standard English
    "a","an","and","are","as","at","be","but","by","for","from","has","have",
    "he","her","his","i","if","in","into","is","it","its","not","of","on","or",
    "she","that","the","their","them","they","this","to","was","were","will",
    "with","you","your","we","our","us","do","does","did","so","just","like",
    "can","could","would","should","also","what","which","who","when","where",
    "how","why","there","here","then","than","very","more","most","some","any",
    "all","one","two","three","about","up","out","over","into","because","been",
    "being","had","having","get","got","make","made","want","need","know","think",
    "yes","no","ok","okay","sure","good","great","fine","let","go","going",
    # Conversational filler
    "im","ive","youre","theyre","were","weve","weve","wont","cant","didnt",
    "doesnt","dont","isnt","wasnt","arent","ill","youll","theyll","its","thats",
    "whats","whos","wheres","whens","hows","heres","theres",
    # ChatGPT-y filler
    "user","assistant","gpt","chatgpt","openai","sorry","thanks","thank","please",
    "okay","alright","awesome","cool","right","sure","yeah","yep","nope","oh",
    "well","actually","basically","really","maybe","probably","kind","sort","bit",
    "lot","lots","much","many","things","thing","stuff","way","ways","time",
    "times","look","looks","looking","see","seeing","seen","use","using","used",
    "work","working","works","help","helps","helping","try","trying","tried",
    "say","said","says","saying","tell","tells","telling","told","said",
    # Markdown / code junk that survives blending
    "ll","ve","re","s","t","d","m","http","https","www","com","org","io","md",
    "py","js","ts","jsx","tsx","html","css","json","yaml","yml","sh","bash",
    "true","false","null","none","return","def","class","import","from","print",
    "self","this","new","const","let","var","if","else","for","while","function",
}


@dataclass
class Chapter:
    cluster_id: int
    title: str
    keywords: list[str]
    conversations: list[Conversation] = field(default_factory=list)
    date_range: tuple[str, str] = ("", "")


def _engagement_score(c: Conversation) -> float:
    # Reward length, balance, and substantial user contribution.
    msgs = c.message_count
    chars = c.char_count
    user_ratio = c.user_count / max(msgs, 1)
    balance = 1.0 / (1.0 + abs(user_ratio - 0.5) * 4)
    return (np.log1p(chars) * 4) + (np.log1p(msgs) * 6) + (balance * 5)


def _name_cluster(top_terms: list[str]) -> str:
    # Curated naming for the most common themes seen in this dataset; fall back
    # to a clean "Term & Term" pairing of the top distinct TF-IDF terms.
    joined = " ".join(top_terms[:8]).lower()
    THEMES = [
        (("conscious", "philosoph", "mind", "experience", "reality", "meaning"),
         "Consciousness, Mind & Meaning"),
        (("code", "python", "function", "error", "script", "debug", "git"),
         "Code & Debugging"),
        (("react", "component", "vite", "css", "html", "blog", "site"),
         "Web Craft"),
        (("data", "model", "training", "dataset", "neural", "tensor", "embed"),
         "Data, Models & Math"),
        (("agent", "tool", "prompt", "llm", "orchestr", "memory"),
         "Agents & Orchestration"),
        (("write", "essay", "draft", "story", "voice", "narrative", "poem"),
         "Writing & Voice"),
        (("design", "art", "color", "image", "visual", "shader"),
         "Design & Image"),
        (("business", "client", "market", "pricing", "revenue", "startup", "product"),
         "Business & Strategy"),
        (("research", "paper", "study", "method", "experiment", "thesis"),
         "Research Notes"),
        (("plan", "schedule", "goal", "todo", "roadmap", "weekly"),
         "Planning & Logistics"),
        (("game", "play", "character", "world", "campaign", "rules"),
         "Games & Worlds"),
        (("recipe", "food", "cook", "diet", "meal", "ingredient"),
         "Kitchen & Body"),
        (("music", "song", "chord", "guitar", "lyric", "track"),
         "Music"),
        (("history", "ancient", "war", "century", "empire"),
         "History"),
        (("life", "feeling", "want", "hope", "advice", "personal"),
         "Personal"),
    ]
    for keys, name in THEMES:
        if any(k in joined for k in keys):
            return name
    pretty = [t.title() for t in top_terms[:2] if t]
    return " & ".join(pretty) if pretty else "Misc"


def cluster_conversations(
    convs: list[Conversation],
    n_clusters: int = 12,
    per_chapter: int = 6,
    min_chars: int = 600,
) -> list[Chapter]:
    pool = [c for c in convs if c.char_count >= min_chars]
    if len(pool) < n_clusters:
        n_clusters = max(2, len(pool) // 4)

    # Build TF-IDF on a fast lower-cased projection of blended text.
    def doc(c: Conversation) -> str:
        return re.sub(r"```.*?```", " ", c.blended_text, flags=re.S).lower()

    docs = [doc(c) for c in pool]
    vec = TfidfVectorizer(
        max_features=4000,
        max_df=0.55,
        min_df=4,
        ngram_range=(1, 1),
        token_pattern=r"(?u)\b[a-zA-Z][a-zA-Z]{3,}\b",
        stop_words=sorted(STOPWORDS),
    )
    X = vec.fit_transform(docs)
    terms = np.array(vec.get_feature_names_out())

    km = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    labels = km.fit_predict(X)
    centers = km.cluster_centers_

    chapters: list[Chapter] = []
    used_titles: set[str] = set()
    for cid in range(n_clusters):
        order = np.argsort(centers[cid])[::-1]
        top_terms = [str(terms[i]) for i in order[:14]]
        title = _name_cluster(top_terms)
        # Disambiguate duplicate titles by appending the strongest term.
        original = title
        i = 0
        while title in used_titles:
            i += 1
            title = f"{original} · {top_terms[i].title()}" if i < len(top_terms) else f"{original} · {cid}"
        used_titles.add(title)

        members = [pool[idx] for idx, lab in enumerate(labels) if lab == cid]
        members.sort(key=_engagement_score, reverse=True)
        chosen = members[:per_chapter]
        chosen.sort(key=lambda c: c.create_time)

        if not chosen:
            continue
        date_range = (
            chosen[0].created.strftime("%b %Y"),
            chosen[-1].created.strftime("%b %Y"),
        )
        chapters.append(Chapter(
            cluster_id=cid,
            title=title,
            keywords=top_terms[:8],
            conversations=chosen,
            date_range=date_range,
        ))

    chapters.sort(key=lambda ch: ch.conversations[0].create_time)
    return chapters


if __name__ == "__main__":
    from pathlib import Path
    from parse import parse
    convs = parse(Path("attached_assets/conversations_1777770283870.json"))
    chs = cluster_conversations(convs, n_clusters=12, per_chapter=5)
    for ch in chs:
        print(f"[{ch.cluster_id:2d}] {ch.title}  ({ch.date_range[0]}–{ch.date_range[1]})  "
              f"n={len(ch.conversations)}  kw={ch.keywords[:5]}")
