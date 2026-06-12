"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  DollarSign,
  FolderKanban,
  Megaphone,
  Bot,
  Settings,
  LogOut,
  Zap,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    accent: "bg-brand-yellow",
  },
  {
    title: "Clients",
    href: "/clients",
    icon: Users,
    accent: "bg-brand-teal",
  },
  {
    title: "Sales",
    href: "/sales",
    icon: TrendingUp,
    accent: "bg-brand-mint",
  },
  {
    title: "Finance",
    href: "/finance",
    icon: DollarSign,
    accent: "bg-brand-teal",
  },
  {
    title: "Projects",
    href: "/projects",
    icon: FolderKanban,
    accent: "bg-brand-orange",
  },
  {
    title: "Marketing",
    href: "/marketing",
    icon: Megaphone,
    accent: "bg-brand-coral",
  },
  {
    title: "Telegram Bot",
    href: "/telegram-bot",
    icon: Bot,
    accent: "bg-brand-mint",
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      collapsible="icon"
      className="border-r-0 [&>div]:border-r-[3px] [&>div]:border-black"
    >
      {/* Logo / Brand */}
      <SidebarHeader className="px-4 py-5">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <span className="flex items-center justify-center w-8 h-8 bg-brand-yellow border-[3px] border-black rounded-sm shadow-[2px_2px_0_#000] group-hover:shadow-none group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all duration-100">
            <Zap className="w-4 h-4 text-black fill-black" />
          </span>
          <span className="font-extrabold text-lg text-sidebar-foreground tracking-tight group-data-[collapsible=icon]:hidden">
            FreelanceOS
          </span>
        </Link>
      </SidebarHeader>

      <SidebarSeparator className="bg-sidebar-border" />

      {/* Main navigation */}
      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        "relative h-10 rounded-sm border-[2px] border-transparent cursor-pointer",
                        "transition-all duration-100",
                        "hover:border-black hover:shadow-[2px_2px_0_#000] hover:bg-sidebar-accent",
                        isActive && [
                          "border-black shadow-[2px_2px_0_#000]",
                          "bg-sidebar-accent font-semibold",
                        ]
                      )}
                    >
                      {isActive && (
                        <span
                          className={cn(
                            "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full",
                            item.accent
                          )}
                        />
                      )}
                      <item.icon
                        className={cn(
                          "w-4 h-4 shrink-0",
                          isActive
                            ? "text-sidebar-foreground"
                            : "text-sidebar-foreground/60"
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm",
                          isActive
                            ? "text-sidebar-foreground"
                            : "text-sidebar-foreground/60"
                        )}
                      >
                        {item.title}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="px-2 pb-4">
        <SidebarSeparator className="bg-sidebar-border mb-2" />
        <SidebarMenu className="gap-1">
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/settings" />}
              tooltip="Settings"
              className="h-10 rounded-sm border-[2px] border-transparent cursor-pointer hover:border-black hover:shadow-[2px_2px_0_#000] hover:bg-sidebar-accent transition-all duration-100"
            >
              <Settings className="w-4 h-4 text-sidebar-foreground/60" />
              <span className="text-sm text-sidebar-foreground/60">Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign out"
              onClick={async () => {
                const { createClient } = await import("@/lib/supabase/client");
                await createClient().auth.signOut();
                window.location.href = "/login";
              }}
              className="h-10 rounded-sm border-[2px] border-transparent cursor-pointer hover:border-black hover:shadow-[2px_2px_0_#000] hover:bg-sidebar-accent transition-all duration-100"
            >
              <LogOut className="w-4 h-4 text-sidebar-foreground/60" />
              <span className="text-sm text-sidebar-foreground/60">Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
