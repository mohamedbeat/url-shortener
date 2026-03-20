import { SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { useLocation } from "@tanstack/react-router";
import { HelpCircle } from "lucide-react";


export function SideBarFooter() {
  const location = useLocation()

  const normalizePathname = (path: string) => {
    if (path !== '/' && path.endsWith('/')) return path.slice(0, -1)
    return path
  }

  const pathname = normalizePathname(location.pathname)
  const isActive = pathname === '/dashboard'

  return (
    <SidebarFooter  >
      <SidebarMenu>
        <SidebarMenuItem>
          <Link to="/dashboard">
            <SidebarMenuButton tooltip="Documentation and support" isActive={isActive}>
              <HelpCircle />
              <span>Help & Support</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter >

  );
}
