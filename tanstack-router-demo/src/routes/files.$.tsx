import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/files/$')({
  component: FilesRoute,
})

function FilesRoute() {
  const { _splat } = Route.useParams()
  
  return (
    <div>
      <h3>Files Explorer</h3>
      <p>This is a catch-all route that captures everything after /files/</p>
      <p>Current path: <strong>{_splat}</strong></p>
      <p>Try visiting /files/documents/my-file.pdf</p>
    </div>
  )
}