# Embedded Agents on the Edge: UNIHIKER K10, ESP32-S3, and a Local MCP Gateway

*May 2, 2026 · 14 min read*

---

Most of the agent infrastructure being built right now lives in someone else’s data center. A model in one cloud, a vector store in another, a tool server behind a third API key, all stitched together by network calls you don’t control and can’t inspect. That stack is fine for prototypes. It is the wrong shape for anything that has to live in a real place — a vehicle, a facility, a kitchen, a pocket.

For the last several months I’ve been building the opposite: an agent stack that runs on hardware I can hold. A UNIHIKER K10 skill package, ESP32-S3 firmware with explicit module boundaries, and a local WebSocket MCP gateway that brokers between them and the LLM runtime (JCLAW) on my workstation. No cloud hop required. No telemetry I didn’t write. No silent fallback to a hosted endpoint when the network blinks.

This post is the long version of why, and a working tour of how.

## Why Local + Embedded Matters

There are three reasons to push agent infrastructure down to the device, and they compound.

**Sovereignty.** When the model, the tool surface, and the storage all live on hardware you own, the question of *who can read this conversation* has a single, honest answer: you. Not a vendor’s privacy policy, not a region setting, not a checkbox you ticked at signup. The data path is the wire from sensor to inference to actuator, and it doesn’t leave the room unless you explicitly route it out. For research workflows, regulated industries, and anything involving children, patients, or trade secrets, this isn’t a preference. It’s a requirement.

**Latency.** A round trip to a hosted LLM is bounded by the slowest hop between you and the provider — typically 200–800 ms before a token is generated, plus whatever the provider’s queue depth adds today. A round trip to a local model is bounded by RAM bandwidth and compute. The difference matters most where you’d expect: anything with a human in the loop, anything driving an actuator, anything that has to acknowledge a button press in less time than the user’s patience. Embedded sensors firing fifty samples a second do not negotiate with a 503.

**Dependence-cost.** Every dependency on a remote service is a future tax. Pricing changes, rate limits change, models get deprecated, terms of service get rewritten. A system whose useful lifetime depends on a vendor staying on its current trajectory is a system you’re renting, not building. Local-first, embedded-first agents amortize: the up-front engineering is real, but it’s a fixed cost against an asset you keep.

The pitch isn’t that cloud agents are bad. The pitch is that for an entire category of useful work, the right substrate is a piece of hardware on your network, not a tab in your browser.

## The UNIHIKER K10 Skill Package

The UNIHIKER K10 is a single-board computer with a built-in display, microphone, speaker, accelerometer, light sensor, and the radios you’d expect — Wi-Fi, Bluetooth. It runs MicroPython out of the box and exposes a full C/C++ SDK underneath. It is, in other words, the right shape for an embedded skill: enough I/O to do real perception, enough compute to host a useful subagent, and a footprint small enough to actually deploy.

The skill package I’ve been building covers both rungs of that ladder.

**What’s in the package.** A library of reusable skills — voice capture and wake-word handling, on-device sensor fusion, display primitives that match the K10’s screen, BLE peripheral provisioning, and a pre-wired transport layer that speaks the same MCP-shaped frames the local gateway expects. Each skill is a small, opinionated module with a single responsibility and a documented contract. The point is not breadth. The point is that you can compose three of them and have a working device-side agent endpoint in an afternoon.

**MicroPython vs C/C++ SDK trade-offs.** MicroPython is the right default. You get an interactive REPL on the device, a five-second edit-flash-test loop, and bindings to most of the on-board peripherals without writing any glue. The cost is the runtime: heap fragmentation under sustained load, GC pauses you can’t schedule, and a hard ceiling on how much real-time work you can do before the interpreter becomes the bottleneck. The C/C++ SDK is the right answer for anything that touches an interrupt, anything that needs deterministic timing, and anything that has to run for weeks without a watchdog reset. The trade-off the package codifies: prototype skills in MicroPython, port to C/C++ when the profiler tells you to, and keep the wire format identical so the gateway never knows which side of the line a given skill is on.

**Hardware schematic notes.** The package documents the real K10 schematic — pin assignments, shared bus conflicts, the I²C addresses that are already occupied by the on-board sensors, the GPIOs that are safe to repurpose and the ones that will brick the board if you drive them at boot. This is the kind of information that gets lost in vendor documentation and rediscovered painfully by every new builder. Codifying it once is the highest-leverage thing the skill package does.

The K10 is the *near* edge. The *far* edge is the ESP32-S3.

## The ESP32-S3 Firmware Work

The ESP32-S3 is the workhorse: dual-core Xtensa, vector instructions for the kind of small-model inference that fits in a few megabytes, USB-OTG, native Wi-Fi and BLE, and a price point that lets you put one in everything. It’s also a microcontroller, which means everything you take for granted on a Linux box — virtual memory, a process model, a filesystem you can trust — is either absent or implemented by a config option you have to know to turn on.

I’ve been writing C against ESP-IDF, and the firmware is structured as four explicit module boundaries.

**Connectivity.** Wi-Fi station, Wi-Fi softAP for first-time provisioning, BLE GATT for out-of-band setup, and an mTLS-secured WebSocket client that reconnects on its own with exponential backoff. The connectivity module owns the radios and exposes a single interface to everything above it: *send this frame, receive this frame, here is the link state*. No other module is allowed to touch the network stack. This is the boundary that takes the most discipline to hold and pays back the most when something fails at 3 a.m. in the field.

**Peripheral drivers.** Sensors, actuators, displays, anything wired to a GPIO. Each driver is a small state machine with an explicit init, an explicit teardown, and a single in-flight operation at a time. No hidden globals, no shared mutable state across drivers. When a driver fails, it fails loudly with an error code that maps to a documented failure mode — not a silent retry that hides the problem until the device is dead in someone’s hand.

**Provisioning.** The least glamorous module and arguably the most important. First-boot provisioning, factory reset, OTA update with a signed manifest and a known-good rollback partition, and a structured way to inject device-specific identity (serial number, room assignment, owner key) without rebuilding the firmware image. The shipping bar for embedded work is not “it boots on the bench.” It’s “a non-technical person can take it out of a box, get it on their network, and update it eighteen months from now without help.”

**Application logic.** Whatever the device is *for* — the actual subagent it hosts, the local skill it runs, the inference it performs. This module is the only one that knows the device’s purpose. It consumes the other three through their interfaces and produces MCP-shaped frames that go out over the connectivity layer.

**Reproducible flashing.** The firmware build is pinned: ESP-IDF version, toolchain version, sdkconfig hash, all in the repo, all checked at build time. The output is a single signed image plus a manifest. Flashing is one command and produces the same artifact on my workstation, in CI, and on someone else’s machine. This sounds obvious until you’ve tried to debug a field failure on a device whose firmware no one can reproduce.

**Field-deployment notes.** Real deployment is the part of embedded work the tutorials skip. The firmware logs structured events to a circular buffer in flash, surfaces a small introspection endpoint over the same WebSocket the gateway uses, and treats every external dependency (NTP, DNS, the gateway itself) as untrusted and recoverable. Power-loss tolerance is tested, not assumed: every write to flash is journaled, every state machine has a defined recovery path from any partial state. The device assumes nothing about its environment except that the environment is hostile.

The K10 and the ESP32-S3 hand their work off through the same chokepoint: the gateway.

## The Local WebSocket MCP Gateway

The interactive schematic at the top of this post is the gateway in motion. CLIENT to WS GATEWAY to SOUL.md identity layer to ROUTER to one of three subagents (codegen, red-team, resource) to TOOL CALLS to RESPONSE. Click any node for detail; the request packets pause when you hover.

The gateway is the smallest of the three pieces of code, and the most consequential.

**Wire format.** Frames are JSON objects shaped like the Model Context Protocol — a `method`, a `params` payload, an `id` that pairs request and response. Every frame carries a routing envelope (origin, destination, capability scope) on top of the MCP body. Identity stamping happens in the gateway, not in the clients: a request from the K10 and a request from a desktop client are normalized to the same internal shape before the router sees them. This is what lets the same red-team subagent that reviews a JCLAW response also review a sensor reading from an ESP32 — they’re both just MCP frames once they’re past the gateway.

**Why WebSocket vs stdio/SSE.** MCP servers historically default to stdio, which is fine when both sides are processes on the same machine and one is the parent of the other. SSE is fine when the channel is one-way and the consumer is a browser. Neither shape fits a gateway whose job is to broker bidirectional traffic between a workstation, a microcontroller across the room, a touchscreen device on a desk, and a subagent that needs to call back into any of them. WebSocket is the only common transport that:

- Survives NAT in both directions on a normal home/office LAN
- Carries arbitrary binary or text frames without re-encoding
- Has battle-tested implementations on every relevant runtime, including ESP-IDF
- Supports mTLS without smuggling certificates through a sidecar
- Lets the device initiate the connection (so the gateway never needs to be reachable from outside the LAN)

The last point is the security argument. By making clients always dial the gateway — never the other way around — the gateway can sit behind whatever firewall is convenient and still serve hardware in three different rooms.

**How it pairs with JCLAW and MCPStarfleetCommand.** JCLAW is the LLM runtime and the codegen subagent. MCPStarfleetCommand is the dual-transport MCP server that exposes my workstation’s tools (filesystem, shell, code search, evals) to anything that speaks MCP. The gateway is what lets the K10 and the ESP32-S3 use those tools the same way a desktop client does. A skill on the K10 that needs to write a structured note to disk doesn’t need its own filesystem driver and its own credentials store — it sends an MCP frame to the gateway, the gateway routes it to MCPStarfleetCommand, the result comes back over the same socket. Identity, audit logging, and red-team review all happen in one place, on infrastructure I control, instead of being smeared across every device in the network.

The shape, in one sentence: the gateway is a one-process MCP broker that makes a microcontroller and a workstation indistinguishable to the agent runtime.

## Where the Work Is Heading

The natural successor to all of this is the UNIHIKER M10 — a more capable, more personal version of the K10 with enough compute to host a real on-device subagent, not just a thin client. The thread I’m pulling on is a *personalized AI companion* built on the M10: a device with a persistent identity layer (its own SOUL.md), local memory it actually owns, and the ability to negotiate with the workstation’s gateway for capabilities it doesn’t have on board. Voice in, voice out, screen for the things voice can’t do, network only for the things the local model can’t. The product question is not “can it do everything a hosted assistant can do” — it can’t, and shouldn’t pretend to. The product question is whether the things it *can* do, it does on hardware that lives with you and answers to you.

That’s the bet underneath all of this work: that the next generation of useful agents will be defined less by which frontier model they call and more by where they live, what they remember, and who has the keys.

I’m building toward the version where the answer to all three is: you do.

---

*If you’re working on embedded agents, MCP infrastructure, or local-first AI and want to compare notes — or you have a problem in this shape and want help — get in touch.*
