/* eslint-disable react-hooks/exhaustive-deps */
"use client";

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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HELPER } from "@/utils/helper";
import { OrderService } from "@/services/order";
import axios from "axios";

export function ModalUpdateBlog({ data }: { data: any }) {
  const [currentData, setCurrentData] = useState<any>(null as any);

  const handleUpdateStatus = async (status: any) => {
    const body = {
      status: status,
    };
    await OrderService.updateOrder(currentData?._id, body);
    window.location.href = "/?tab=order";
  };

  const downloadImage = async (imageUrl: string, filename: string) => {
    // const link = document.createElement("a");
    // link.href = imageUrl;
    // link.download = filename;
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);

    // const body = {
    //   Image_URL: "https://www.inanhtructuyen.com/_next/image?url=" + imageUrl,
    // };

    // const response = await OrderService.downloadImage(body);

    // console.log("download result: " + response);

    if (!imageUrl) {
      console.error("Invalid image URL");
      return;
    }

    // try {
    //   console.log("start download");

    //   const urlObj = new URL(imageUrl);
    //   const queryParams = new URLSearchParams(urlObj.search);
    //   const realImageUrl = queryParams.get("url") || imageUrl;

    //   const response = await fetch(realImageUrl);
    //   if (!response.ok) {
    //     throw new Error(`Failed to fetch image: ${response.statusText}`);
    //   }

    //   const blob = await response.blob();
    //   const contentType = blob.type || "application/octet-stream";
    //   const realUrlObj = new URL(realImageUrl);
    //   let fileName =
    //     filename || realUrlObj.pathname.split("/").pop() || "downloaded-image";

    //   if (!fileName.includes(".")) {
    //     const ext = contentType.split("/")[1] || "jpg";
    //     fileName += `.${ext}`;
    //   }

    //   const link = document.createElement("a");
    //   link.href = URL.createObjectURL(blob);
    //   link.download = fileName;
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
    // } catch (error) {
    //   console.error("Error downloading image:", error);
    //   throw error;
    // }

    try {
      const img = document.createElement("img");
      img.crossOrigin = "Anonymous";
      img.src = imageUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const PPI = 300;
      const originalWidth = img.naturalWidth;
      const originalHeight = img.naturalHeight;
      const scaleFactor = PPI / 300;

      const newWidth = originalWidth * scaleFactor;
      const newHeight = originalHeight * scaleFactor;

      const canvas = document.createElement("canvas");
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Unable to get canvas context");
      }

      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            throw new Error("Failed to generate image blob");
          }

          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = filename || "downloaded_image.png";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        },
        "image/jpeg",
        1.0
      );
    } catch (error) {
      console.error("Error processing image:", error);
    }
  };

  const updateDOM = () => {
    if (data) {
      setCurrentData(data);
    }
  };

  useEffect(() => {
    if (data) {
      setCurrentData(data);
    }
  }, [data]);

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
            <span className="!text-[16px]">
              Mã đơn hàng: #{currentData?._id}
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="w-full grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center">
              <Image
                src={currentData?.image || "/fallback-image.jpg"}
                alt="img"
                className="w-auto h-16 mr-3 rounded-md"
                width={100}
                height={100}
                priority
              />
              <div className="flex flex-col items-start">
                <span className="text-[16px] line-clamp-2 bg-primary-100 text-gray-900 font-medium py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
                  {currentData?.product_id}
                </span>
                <button
                  onClick={() =>
                    downloadImage(
                      currentData?.image,
                      `${currentData?.product_id}.png`
                    )
                  }
                  className="text-[14px] line-clamp-2 bg-orange-600 text-white px-6 font-medium py-0.5 rounded dark:bg-primary-900 dark:text-primary-300"
                >
                  Tải file về
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span>
                <strong>Màu khung:</strong>{" "}
                {HELPER.renderColorText(currentData?.color)}
              </span>
              <span>
                <strong>Kích thước:</strong> {currentData?.size}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span>
                <strong>Ngày tạo đơn hàng:</strong>{" "}
                {HELPER.formatDate(currentData?.created_at)}
              </span>
              <span>
                <strong>Ngày hoàn tất đơn hàng:</strong>{" "}
                {currentData?.date_complete}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span>
                <strong>Phương thức thanh toán:</strong>{" "}
                {HELPER.renderPayment(currentData?.payment_method)}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span>Tổng số tiền:</span>
              <span className="text-[20px] font-bold">
                {HELPER.formatVND(currentData?.total)}
              </span>
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
                  <strong>{currentData?.account_email}</strong>
                </span>
                <span className="text-[14px] line-clamp-2 bg-primary-100 text-gray-600 font-medium py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
                  {currentData?.account_email}
                </span>
              </div>
            </div>
            <div>
              <strong>Địa chỉ giao hàng:</strong> {currentData?.address}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-56 bg-yellow-100 hover:bg-yellow-200 text-gray-800">
                  {HELPER.renderStatus(data?.status)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Trạng thái</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  className="cursor-pointer"
                  onClick={() => handleUpdateStatus("waiting")}
                >
                  Đợi phản hồi
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  className="cursor-pointer"
                  onClick={() => handleUpdateStatus("pending")}
                >
                  Đang chuẩn bị đơn hàng
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  className="cursor-pointer"
                  onClick={() => handleUpdateStatus("delivering")}
                >
                  Đang giao hàng
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  className="cursor-pointer"
                  onClick={() => handleUpdateStatus("completed")}
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
