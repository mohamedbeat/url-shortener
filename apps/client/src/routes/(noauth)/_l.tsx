import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(noauth)/_l')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
    <div className="p-2 flex gap-2">
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>{' '}
      <Link to="/dashboard" className="[&.active]:font-bold">
        dashboard
      </Link>
    </div>
    <hr />

    <div>no auth layout</div>
    <Outlet />
  </>

}
