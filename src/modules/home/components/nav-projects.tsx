"use client";

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
    icon: any;
  }[];
}) {
  const param = useSearchParams();
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>
        <span className="text-[16px] mb-4">Dashboard</span>
      </SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a
                href={item.url}
                className={`space-x-2 relative inline-flex items-center justify-start !py-5 mb-2 overflow-hidden text-sm font-medium text-gray-500 rounded-lg ${
                  (param.get("tab") || "product") === item.tab
                    ? "bg-indigo-100 hover:bg-indigo-100 text-indigo-900 hover:text-indigo-900 font-semibold"
                    : ""
                }`}
              >
                {item.icon}
                <span className="text-[15px] relative transition-all ease-in duration-75 dark:bg-gray-900 rounded-md">
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
