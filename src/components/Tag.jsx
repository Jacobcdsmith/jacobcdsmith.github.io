export default function Tag({ children, tone = 'neutral', as: Tag = 'span', ...rest }) {
  return (
    <Tag className={`tag tag-${tone}`} {...rest}>
      {children}
    </Tag>
  )
}
