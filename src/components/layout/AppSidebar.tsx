
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { CheckIcon, FileTextIcon, UsersIcon } from "lucide-react";
import { NavLink } from "react-router-dom";
import kpcLogo from "@/assets/kpc-logo.png";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const menuItems = [
    {
      title: "New Request",
      path: "/",
      icon: FileTextIcon,
    },
    {
      title: "HR Approvals",
      path: "/approvals",
      icon: CheckIcon,
    },
    {
      title: "Employee Submissions",
      path: "/submissions",
      icon: UsersIcon,
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex justify-center p-6">
        <div className="flex items-center space-x-2">
          {!collapsed && <span className="font-bold text-lg text-kpc-purple">Thank You Card System</span>}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Navigation</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    asChild
                    tooltip={collapsed ? item.title : undefined}
                  >
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center space-x-2 ${
                          isActive
                            ? "text-kpc-purple font-semibold"
                            : "text-muted-foreground"
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
