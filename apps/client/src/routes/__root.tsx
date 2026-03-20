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
    if (!isLoading) {
      const publicRoutes = ['/login', '/']
      const isPublicRoute =
        publicRoutes.includes(location.pathname) || location.pathname.startsWith('/login/success')

      if (!isAuthenticated && !isPublicRoute) {
        navigate({ to: '/login' })
      }
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


