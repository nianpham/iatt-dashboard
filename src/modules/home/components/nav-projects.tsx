"use client"

import {
    type LucideIcon,
} from "lucide-react"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSearchParams } from "next/navigation"

export function NavProjects({
    projects
}: {
    projects: {
        name: string
        url: string
        tab: string
        icon: LucideIcon
    }[]
}) {

    const param = useSearchParams()
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
                                className={`flex items-center space-x-2 py-5 ${(param.get("tab") || 'product') === item.tab ? "bg-orange-50 border border-orange-300 text-sidebar-accent-foreground" : ""}`}
                            >
                                <item.icon />
                                <span className="text-[16px]">{item.name}</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
