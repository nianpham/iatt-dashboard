"use client";

import { type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSearchParams } from "next/navigation";

export function NavProjects({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    tab: string;
    icon: LucideIcon;
  }[];
}) {
  const param = useSearchParams();
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>
        <span className="text-[16px]">Dashboard</span>
      </SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a
                href={item.url}
                className={`space-x-2 relative inline-flex items-center justify-start !py-5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group group-hover:from-cyan-500 group-hover:to-blue-500 ${
                  (param.get("tab") || "product") === item.tab
                    ? "bg-gradient-to-br from-cyan-500 to-blue-500 text-white hover:text-white"
                    : ""
                }`}
              >
                <item.icon />
                <span className="text-[15px] relative px-5 transition-all ease-in duration-75 dark:bg-gray-900 rounded-md">
                  {item.name}
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
