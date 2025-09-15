import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings/notifications')({
  component: Notifications,
})

function Notifications() {
  return (
    <div>
      <h3>Notification Settings</h3>
      <p>This route also uses flat routing: settings.notifications.tsx</p>
      <p>It renders at /settings/notifications</p>
    </div>
  )
}