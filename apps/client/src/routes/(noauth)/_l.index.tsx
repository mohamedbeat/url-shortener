import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(noauth)/_l/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="text-red-500">home page</div>
}
