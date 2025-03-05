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
import { useToast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";

export function ModalUpdateBlog({
  data,
  accounts,
  products,
}: {
  data: any;
  accounts: any;
  products: any;
}) {
  const { toast } = useToast();

  const [downloadLoading, setDownloadLoading] = useState(false);

  const [currentData, setCurrentData] = useState<any>(null as any);

  const statusOrder = {
    waiting: 1,
    "paid pending": 2,
    paid: 3,
    pending: 4,
    delivering: 5,
    completed: 6,
    cancelled: 7,
  };

  const handleUpdateStatus = async (status: string) => {
    if (currentData?.status === "completed") {
      toast({
        variant: "destructive",
        title: "Không thể đổi trạng thái vì đơn hàng đã hoàn thành.",
      });
      return false;
    }

    if (currentData?.status === status) {
      toast({
        variant: "destructive",
        title: "Đây là trạng thái hiện tại. Vui lòng chọn trạng thái tiếp theo",
      });
      return false;
    }

    const currentStatusValue =
      statusOrder[currentData?.status as keyof typeof statusOrder];
    const newStatusValue = statusOrder[status as keyof typeof statusOrder];

    if (status !== "cancelled" && newStatusValue !== currentStatusValue + 1) {
      toast({
        variant: "destructive",
        title: "Chỉ có thể chuyển sang trạng thái tiếp theo trong quy trình.",
      });
      return false;
    }

    if (currentStatusValue > newStatusValue) {
      toast({
        variant: "destructive",
        title: "Không thể chuyển về trạng thái trước đó.",
      });
      return false;
    }

    const body = {
      status: status,
    };

    await OrderService.updateOrder(currentData?._id, body);
    window.location.href = "/?tab=order";
  };

  const isCashPayment = currentData?.payment_method === "cash";

  const downloadImage = async (imageUrl: string, filename: string) => {
    if (!imageUrl) {
      console.error("Invalid image URL");
      return;
    }

    try {
      setDownloadLoading(true);
      const img = document.createElement("img");
      img.crossOrigin = "Anonymous";
      img.src = imageUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const validSizes = [
        { width: 20, height: 30 },
        { width: 15, height: 21 },
        { width: 40, height: 20 },
      ];

      const originalWidth = img.naturalWidth;
      const originalHeight = img.naturalHeight;

      // const isValidSize = validSizes.some(
      //   (size) =>
      //     (originalWidth === size.width && originalHeight === size.height) ||
      //     (originalWidth === size.height && originalHeight === size.width)
      // );

      // if (!isValidSize) {
      //   console.error("Image does not match required dimensions");
      //   return;
      // }

      let scaleFactor = 1;
      let blob: Blob | null = null;
      let minFileSize =
        // (originalWidth === 40 && originalHeight === 20) ||
        // (originalWidth === 20 && originalHeight === 40)
        currentData.size === "40x20" ? 3 * 1024 * 1024 : 1 * 1024 * 1024;

      do {
        const canvas = document.createElement("canvas");
        canvas.width = originalWidth * scaleFactor;
        canvas.height = originalHeight * scaleFactor;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error("Unable to get canvas context");
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, "image/jpeg", 1.0);
        });

        if (!blob) {
          throw new Error("Failed to generate image blob");
        }

        if (blob.size < minFileSize) {
          scaleFactor *= 1.1;
        }
      } while (blob && blob.size < minFileSize);

      if (blob) {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename || "downloaded_image.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      setDownloadLoading(false);
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
        className="sm:max-w-[850px]"
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
                  {/* {currentData?.product_id} */}
                  {
                    products?.find(
                      (pro: any) =>
                        pro._id.toString() === currentData?.product_id
                    )?.name
                  }
                </span>
                <button
                  onClick={() =>
                    downloadImage(
                      currentData?.image,
                      `${currentData?.product_id}_${currentData?.size}.jpg`
                    )
                  }
                  className="text-[14px] line-clamp-2 bg-orange-600 text-white px-6 font-medium py-0.5 rounded dark:bg-primary-900 dark:text-primary-300"
                >
                  {!downloadLoading ? (
                    <div>Tải file về</div>
                  ) : (
                    <div className="flex flex-row justify-center items-center gap-3">
                      Đang tải ảnh...
                      <Loader className="animate-spin" size={15} />
                    </div>
                  )}
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
                <strong>Ngày hoàn tất đơn hàng:</strong>
                {!currentData?.date_completed
                  ? " Đơn hàng đang được xử lí."
                  : HELPER.formatDate(currentData?.date_completed)}
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
                  <strong>
                    {
                      accounts?.find(
                        (pro: any) =>
                          pro._id.toString() === currentData?.account_id
                      )?.name
                    }
                  </strong>
                </span>
                <span className="text-[14px] line-clamp-2 bg-primary-100 text-gray-600 font-medium py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
                  {
                    accounts?.find(
                      (pro: any) =>
                        pro._id.toString() === currentData?.account_id
                    )?.email
                  }
                </span>
              </div>
            </div>
            <div>
              <strong>Địa chỉ giao hàng:</strong> {currentData?.address}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className={`w-56
                        ${
                          data.status === "completed"
                            ? "bg-green-700 text-white"
                            : ""
                        }
                        ${
                          data.status === "delivering"
                            ? "bg-yellow-800 text-white"
                            : ""
                        }
                        ${
                          data.status === "waiting"
                            ? "bg-blue-700 text-white"
                            : ""
                        }
                        ${
                          data.status === "pending"
                            ? "bg-orange-600 text-white"
                            : ""
                        }
                        ${
                          data.status === "paid pending"
                            ? "bg-yellow-400 text-white"
                            : ""
                        }
                        ${
                          data.status === "paid" ? "bg-pink-200 text-white" : ""
                        }
                        ${
                          data.status === "cancelled"
                            ? "bg-red-500 text-white"
                            : ""
                        }`}
                >
                  {HELPER.renderStatus(data?.status)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Trạng thái</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  className="cursor-pointer"
                  onClick={() => handleUpdateStatus("waiting")}
                  disabled={
                    statusOrder[
                      currentData?.status as keyof typeof statusOrder
                    ] > 1
                  }
                >
                  1. Đợi phản hồi
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  className="cursor-pointer"
                  onClick={() => handleUpdateStatus("paid pending")}
                  disabled={
                    isCashPayment ||
                    statusOrder[
                      currentData?.status as keyof typeof statusOrder
                    ] > 2
                  }
                >
                  2. Đang chờ thanh toán
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  className="cursor-pointer"
                  onClick={() => handleUpdateStatus("paid")}
                  disabled={
                    isCashPayment ||
                    statusOrder[
                      currentData?.status as keyof typeof statusOrder
                    ] > 3
                  }
                >
                  3. Đã thanh toán
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  className="cursor-pointer"
                  onClick={() => handleUpdateStatus("pending")}
                  disabled={
                    statusOrder[
                      currentData?.status as keyof typeof statusOrder
                    ] > 4
                  }
                >
                  4. Đang chuẩn bị đơn hàng
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  className="cursor-pointer"
                  onClick={() => handleUpdateStatus("delivering")}
                  disabled={
                    statusOrder[
                      currentData?.status as keyof typeof statusOrder
                    ] > 5
                  }
                >
                  5. Đang giao hàng
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  className="cursor-pointer"
                  onClick={() => handleUpdateStatus("completed")}
                  disabled={
                    statusOrder[
                      currentData?.status as keyof typeof statusOrder
                    ] > 6
                  }
                >
                  6. Đã hoàn tất
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  className="cursor-pointer"
                  onClick={() => handleUpdateStatus("cancelled")}
                >
                  7. Đã hủy đơn hàng
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
