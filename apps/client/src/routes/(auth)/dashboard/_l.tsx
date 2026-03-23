import { Header } from '@/components/dashboard/sidebar/header';
import { AppSidebar } from '@/components/dashboard/sidebar/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/dashboard/_l')({
  component: DashboardLayout,

})


function DashboardLayout() {
  return (
    <div className="flex h-screen bg-background relative">
      <SidebarProvider>
        {/* <SidebarTrigger /> */}
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <main className="flex-1 overflow-y-auto w-96 sm:w-auto ">
            <Header />
            <div className='p-5'>
              <Outlet />
            </div>
          </main>
        </div>
      </SidebarProvider>
      {/* <Link to="/dashboard" className='absolute sm:hidden top-[100vh] right-0 z-50 bg-background rounded-full p-0'>
        <Button variant="default" className={"h-16 w-16 rounded-full flex items-center justify-center"}>
          <Link2 className="h-20 w-20" height={20} width={20} />
        </Button>
      </Link> */}
    </div>
  )
}

