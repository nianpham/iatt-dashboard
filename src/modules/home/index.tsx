"use client";

import { AppSidebar } from "./components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useSearchParams } from "next/navigation";
import Product from "./modules/product";
import Order from "./modules/order";
import Blog from "./modules/blog";
import Customer from "./modules/customer";

export default function HomeClient() {
  const param = useSearchParams();

  const renderTab = (tab: string) => {
    switch (tab) {
      case "product":
        return <Product />;
      case "order":
        return <Order />;
      case "blog":
        return <Blog />;
      case "customer":
        return <Customer />;
      default:
        return <Product />;
    }
  };

  const renderBreadcrumb = (tab: string) => {
    switch (tab) {
      case "product":
        return "Sản Phẩm";
      case "order":
        return "Đơn Hàng";
      case "blog":
        return "Bài Viết";
      case "customer":
        return "Khách Hàng";
      default:
        return "Sản Phẩm";
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">
                    <span className="text-[16px]">Dashboard</span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    <span className="text-[16px]">
                      {renderBreadcrumb(param.get("tab") || "product")}
                    </span>
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="w-full h-[1.5px] bg-black opacity-10"></div>
        <div className="flex flex-1 flex-col">
          {renderTab(param.get("tab") || "product")}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
