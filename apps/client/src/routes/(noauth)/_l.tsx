import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(noauth)/_l')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
    <Outlet />
  </>

}
