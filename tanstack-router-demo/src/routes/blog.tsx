import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/blog')({
  component: BlogLayout,
})

function BlogLayout() {
  return (
    <div className="p-2">
      <div className="flex gap-2 border-b mb-2">
        <Link to="/blog" className="[&.active]:font-bold">
          All Posts
        </Link>
        <Link to="/blog/1" className="[&.active]:font-bold">
          Post 1
        </Link>
        <Link to="/blog/2" className="[&.active]:font-bold">
          Post 2
        </Link>
      </div>
      <Outlet />
    </div>
  )
}