import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { createRootRouteWithContext, Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import appCss from "../index.css?url"
import { Toaster } from '@/components/ui/sonner';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

const RootDocument = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (isLoading) return

    const normalizePathname = (path: string) => {
      if (path !== '/' && path.endsWith('/')) return path.slice(0, -1)
      return path
    }

    const pathname = normalizePathname(location.pathname)

    const isLoginRoute =
      pathname === '/login' ||
      pathname.startsWith('/login/success') ||
      // Backwards-compatible alias if you ever use this path name.
      pathname.startsWith('/logic/success')

    const isPublicRouteForUnauthenticated =
      pathname === '/' ||
      pathname === '/login' ||
      pathname.startsWith('/login/success') ||
      pathname.startsWith('/logic/success')

    // Unauthenticated users can only access public routes; everything else goes to /login.
    if (!isAuthenticated && !isPublicRouteForUnauthenticated) {
      navigate({ to: '/login', replace: true })
      return
    }

    // Authenticated users shouldn't see /login or /login/success; send them to the dashboard.
    if (isAuthenticated && isLoginRoute) {
      navigate({ to: '/dashboard', replace: true })
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  return (
    <>

      <ThemeProvider>
        <TooltipProvider>
          <Outlet />
          <Toaster toastOptions={{
            style: {
              borderRadius: 0
            }
          }}
          />
        </TooltipProvider>
      </ThemeProvider>

      {/* <TanStackRouterDevtools /> */}
    </>
  )
}






// export const Route = createRootRouteWithContext<MyRouterContext>()({
export const Route = createRootRouteWithContext()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "URL Shortener",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
});


