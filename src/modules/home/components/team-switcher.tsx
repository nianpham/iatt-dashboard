"use client"

import * as React from "react"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { IMAGES } from "@/utils/image"

export function TeamSwitcher() {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                        <Image
                            src={IMAGES.LOGO}
                            alt="img"
                            className=""
                            width={100}
                            height={0}
                        />
                    </div>
                    <div className="grid flex-1 text-left text-[16px] leading-tight">
                        <span className="truncate font-semibold">
                            IN ẢNH TRỰC TUYẾN
                        </span>
                        <span className="truncate text-[13px]">Admin</span>
                    </div>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
