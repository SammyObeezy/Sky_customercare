import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings/profile')({
  component: Profile,
})

function Profile() {
  return (
    <div>
      <h3>Profile Settings</h3>
      <p>This route uses flat routing with dots: settings.profile.tsx</p>
      <p>It renders at /settings/profile</p>
    </div>
  )
}