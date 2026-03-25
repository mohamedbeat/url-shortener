import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(noauth)/_l')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
    {/* <div className="p-2 flex gap-2">
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>{' '}
      <Link to="/dashboard" className="[&.active]:font-bold">
        dashboard
      </Link>
      <Link to="/login" className="[&.active]:font-bold">
        login
      </Link>
    </div>
    <hr />

    <div>no auth layout</div> */}
    <Outlet />
  </>

}
