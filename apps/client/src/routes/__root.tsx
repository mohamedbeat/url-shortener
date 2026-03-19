import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import appCss from "../index.css?url"
import { Toaster } from '@/components/ui/sonner';

const RootDocument = () => (
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


