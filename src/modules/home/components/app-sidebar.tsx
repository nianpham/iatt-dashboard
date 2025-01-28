"use client"

import * as React from "react"
import {
    FileText,
    PackageOpen,
    LogOut,
    Newspaper,
    Users,
} from "lucide-react"
import { NavProjects } from "./nav-projects"
import { TeamSwitcher } from "./team-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import Cookies from "js-cookie";
import { ROUTES } from "@/utils/route"

const data = {
    projects: [
        {
            name: "Sản Phẩm",
            url: "?tab=product",
            tab: "product",
            icon: PackageOpen,
        },
        // {
        //     name: "Đơn Hàng",
        //     url: "?tab=order",
        //     tab: "order",
        //     icon: FileText,
        // },
        {
            name: "Bài Viết",
            url: "?tab=blog",
            tab: "blog",
            icon: Newspaper,
        },
        // {
        //     name: "Khách Hàng",
        //     url: "?tab=customer",
        //     tab: "customer",
        //     icon: Users,
        // },
    ],
}

export function AppSidebar({
    ...props
}: React.ComponentProps<typeof Sidebar>) {

    const handleLogOut = () => {
        Cookies.remove("isLogin");
        window.location.href = ROUTES.LOGIN
    }

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher />
            </SidebarHeader>
            <SidebarContent>
                <NavProjects projects={data.projects} />
            </SidebarContent>
            <SidebarFooter
                className="flex flex-row justify-center gap-3 text-[16px] cursor-pointer pb-10 text-orange-700 font-semibold"
                onClick={() => { handleLogOut() }}
            >
                <LogOut /> Đăng xuất
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
