import { SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { HelpCircle } from "lucide-react";


export function SideBarFooter() {
  return (
    <SidebarFooter  >
      <SidebarMenu>
        <SidebarMenuItem>
          <Link to="/dashboard">
            <SidebarMenuButton tooltip="Documentation and support" className="p-0 m-0">
              <HelpCircle />
              <span>Help & Support</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter >

  );
}
