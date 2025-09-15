import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/settings')({
  component: SettingsLayout,
})

function SettingsLayout() {
  return (
    <div className="p-2">
      <div className="flex gap-2 border-b mb-2">
        <Link to="/settings/profile" className="[&.active]:font-bold">
          Profile
        </Link>
        <Link to="/settings/notifications" className="[&.active]:font-bold">
          Notifications
        </Link>
      </div>
      <Outlet />
    </div>
  )
}