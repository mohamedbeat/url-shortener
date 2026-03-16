import { SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { HelpCircle } from "lucide-react";


export function SideBarFooter() {
  return (
    <SidebarFooter className="w-full h-max">
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link to="/dashboard">
                <SidebarMenuButton tooltip="Documentation and support">
                  <HelpCircle />
                  <span>Help & Support</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarFooter >

  );
}
