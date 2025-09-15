import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/blog/$postId')({
  component: BlogPost,
})

function BlogPost() {
  const { postId } = Route.useParams()
  
  return (
    <div>
      <h3>Blog Post: {postId}</h3>
      <p>This is a dynamic route that captures the postId parameter.</p>
      <p>The current postId is: <strong>{postId}</strong></p>
    </div>
  )
}