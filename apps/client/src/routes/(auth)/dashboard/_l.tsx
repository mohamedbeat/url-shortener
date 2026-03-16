import { AppSidebar } from '@/components/dashboard/sidebar/sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/dashboard/_l')({
  component: DashboardLayout,

})


function DashboardLayout() {
  return (
    <div className="flex h-screen bg-background">
      <SidebarProvider>
        <SidebarTrigger />
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          {/* <Header /> */}
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </div>
  )
}

