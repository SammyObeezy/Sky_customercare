import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/blog/')({
  component: BlogIndex,
})

function BlogIndex() {
  return (
    <div>
      <h3>Blog Posts</h3>
      <p>Select a post from above to view it!</p>
      <p>This index route is rendered when visiting "/blog" exactly.</p>
    </div>
  )
}