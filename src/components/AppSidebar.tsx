import { LayoutDashboard, SlidersHorizontal, HardDrive, Moon, Sun, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Droplets } from "lucide-react";

const ROLE_LABEL: Record<string, string> = {
  admin: "Admin",
  operador: "Operador",
  usuario: "Usuário",
};

const ROLE_COLOR: Record<string, string> = {
  admin: "bg-red-500/15 text-red-700 dark:text-red-400",
  operador: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  usuario: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
};

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { user, logout, hasPermission } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const items = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard, minRole: "usuario" as const },
    { title: "Parâmetros", url: "/variaveis", icon: SlidersHorizontal, minRole: "operador" as const },
    { title: "Dispositivos", url: "/dispositivos", icon: HardDrive, minRole: "admin" as const },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <Droplets className="h-6 w-6 text-primary shrink-0" />
          {!collapsed && <span className="font-bold text-lg tracking-tight">SALNUTRA</span>}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items
                .filter((item) => hasPermission(item.minRole))
                .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.url}
                    >
                      <NavLink to={item.url} end className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3 space-y-2">
        {!collapsed && user && (
          <div className="flex items-center gap-2 px-1">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <Badge variant="secondary" className={`text-[10px] mt-0.5 ${ROLE_COLOR[user.role]}`}>
                {ROLE_LABEL[user.role]}
              </Badge>
            </div>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleTheme} title="Alternar tema">
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={logout} title="Sair">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
