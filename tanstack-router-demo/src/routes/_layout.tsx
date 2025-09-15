import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout')({
  component: PathlessLayout,
})

function PathlessLayout() {
  return (
    <div className="p-2 border-2 border-blue-200 rounded">
      <div className="text-sm text-blue-600 mb-2">
        🔄 This is a pathless layout (doesn't affect the URL)
      </div>
      <Outlet />
    </div>
  )
}