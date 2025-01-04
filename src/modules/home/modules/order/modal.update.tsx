/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useEffect, useState } from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Checked = DropdownMenuCheckboxItemProps["checked"]

export function ModalUpdateBlog({ data }: { data: any }) {

    const [currentData, setCurrentData] = useState<any>(null as any)

    const [showStatusBar, setShowStatusBar] = useState<Checked>(true)
    const [showActivityBar, setShowActivityBar] = useState<Checked>(false)
    const [showPanel, setShowPanel] = useState<Checked>(false)

    const handleSubmit = async () => {

    }

    const updateDOM = () => {
        if (data) {
            setCurrentData(data)
        }
    }

    useEffect(() => { }, [data])

    return (
        <Dialog>
            <DialogTrigger asChild onClick={updateDOM}>
                <Button variant="outline">Xem chi tiết</Button>
            </DialogTrigger>
            <DialogContent
                className="sm:max-w-[825px]"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>
                        <span className="!text-[20px]">Chi tiết đơn hàng</span>
                    </DialogTitle>
                    <DialogDescription>
                        <span className="!text-[16px]">Mã đơn hàng: #IATT001</span>
                    </DialogDescription>
                </DialogHeader>
                <div className="w-full grid grid-cols-2 gap-8">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center">
                            <Image
                                src="https://i.ebayimg.com/images/g/mb8AAOSw23Vm3p-a/s-l400.jpg"
                                alt="img"
                                className="w-auto h-12 mr-3 rounded-md"
                                width={100}
                                height={0}
                            />
                            <span className="text-[16px] line-clamp-2 bg-primary-100 text-gray-900 font-medium py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
                                Khung ảnh HD 4k
                            </span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span><strong>Màu khung:</strong> Vàng</span>
                            <span><strong>Kích thước:</strong> 20 x 30</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span><strong>Ngày tạo đơn hàng:</strong> 04/01/2025</span>
                            <span><strong>Ngày hoàn tất đơn hàng:</strong> 06/01/2025</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span><strong>Phương thức thanh toán:</strong> Momo</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span>Tổng số tiền:</span>
                            <span className="text-[20px] font-bold">137.000 đồng</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center">
                            <Image
                                src="https://cdn-icons-png.flaticon.com/128/4333/4333609.png"
                                alt="img"
                                className="w-auto h-12 mr-3 rounded-md"
                                width={100}
                                height={0}
                            />
                            <div className="flex flex-col">
                                <span className="text-[16px] line-clamp-2 bg-primary-100 text-gray-900 font-medium py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
                                    <strong>Phạm Thanh Nghiêm</strong>
                                </span>
                                <span className="text-[14px] line-clamp-2 bg-primary-100 text-gray-600 font-medium py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
                                    0911558539
                                </span>
                            </div>
                        </div>
                        <div>
                            <strong>Địa chỉ giao hàng:</strong> 332/8 Phan Văn Trị, P11, Bình Thạnh, HCM
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="w-56 bg-yellow-100 hover:bg-yellow-200 text-gray-800">Đang chờ duyệt</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>Trạng thái</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem
                                    checked={showStatusBar}
                                    onCheckedChange={setShowStatusBar}
                                >
                                    Đang chờ duyệt
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={showActivityBar}
                                    onCheckedChange={setShowActivityBar}
                                >
                                    Đang giao hàng
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={showPanel}
                                    onCheckedChange={setShowPanel}
                                >
                                    Đã hoàn tất
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
