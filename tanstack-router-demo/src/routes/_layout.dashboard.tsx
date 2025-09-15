import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  return (
    <div>
      <h3>Dashboard</h3>
      <p>This route is wrapped by the pathless layout but renders at /dashboard</p>
      <p>The _layout prefix doesn't appear in the URL!</p>
    </div>
  )
}