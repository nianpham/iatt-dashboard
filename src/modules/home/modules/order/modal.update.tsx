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
import axios from "axios";
import { Loader } from "lucide-react";

export function ModalUpdateBlog({
  data,
  accounts,
}: {
  data: any;
  accounts: any;
}) {
  const { toast } = useToast();

  const [downloadLoading, setDownloadLoading] = useState(false);

  const [currentData, setCurrentData] = useState<any>(null as any);

  const handleUpdateStatus = async (status: any) => {
    const body = {
      status: status,
    };

    await OrderService.updateOrder(currentData?._id, body);
    window.location.href = "/?tab=order";
  };

  // const downloadImage = async (imageUrl: string, filename: string) => {
  //   if (!imageUrl) {
  //     console.error("Invalid image URL");
  //     return;
  //   }

  //   try {
  //     console.log("Starting download...");

  //     const response = await fetch(imageUrl, { mode: "cors" });
  //     if (!response.ok) throw new Error("Failed to fetch image");

  //     const blob = await response.blob();

  //     const blobUrl = URL.createObjectURL(blob);

  //     const link = document.createElement("a");
  //     link.href = blobUrl;
  //     link.download = filename || "downloaded_image.jpg";
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);

  //     URL.revokeObjectURL(blobUrl);

  //     console.log("Download complete.");
  //   } catch (error) {
  //     console.error("Error downloading image:", error);
  //   }
  // };

  const downloadImage = async (imageUrl: string, filename: string) => {
    if (!imageUrl) {
      console.error("Invalid image URL");
      return;
    }

    try {
      console.log("Fetching image...");
      setDownloadLoading(true);

      // Fetch the image as a blob
      const response = await fetch(imageUrl, { mode: "cors" });
      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }

      const blob = await response.blob();
      const file = new File([blob], "uploaded-image.jpg", { type: blob.type });

      console.log("Image converted to file");

      // Prepare API request
      const myHeaders = new Headers();
      myHeaders.append("Apikey", "651cb124-2137-42c6-825d-3e1ada596fbe");

      const formdata = new FormData();
      formdata.append("inputFile", file, "wallpaper-2.jpg");

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow" as RequestRedirect,
      };

      console.log("Starting API request...");
      // const result = await fetch(
      //   "https://api.cloudmersive.com/convert/image/set-dpi/300",
      //   requestOptions
      // )
      //   .then((response) => response.text())
      //   .then((result) => console.log("API Response:", result))
      //   .catch((error) => console.error("API Error:", error));

      const result = await fetch(
        "https://api.cloudmersive.com/convert/image/set-dpi/300",
        requestOptions
      );
      const resultBlob = await result.blob();

      console.log("Process complete.");

      // // Convert result to base64
      // const reader = new FileReader();
      // reader.readAsDataURL(resultBlob);
      // reader.onloadend = () => {
      //   const base64data = reader.result;
      //   console.log("Base64 Encoded Response:", base64data);

      //   // Convert base64 to a file and trigger download
      //   const link = document.createElement("a");
      //   link.href = base64data;
      //   link.download = "processed-image.jpg";
      //   document.body.appendChild(link);
      //   link.click();
      //   document.body.removeChild(link);
      // };

      if (result.ok === true) {
        // Convert result to base64
        const reader = new FileReader();
        reader.readAsDataURL(resultBlob);
        reader.onloadend = () => {
          const base64data = reader.result;
          if (typeof base64data === "string") {
            // console.log("Base64 Encoded Response:", base64data);

            // Convert base64 to a file and trigger download
            const link = document.createElement("a");
            link.href = base64data;
            link.download = "processed-image.jpg";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setDownloadLoading(false);
          } else {
            console.error("Failed to convert image to base64 format.");
          }
        };
      } else {
        setDownloadLoading(true);

        toast({
          variant: "destructive",
          title: "Chuyển đổi hình ảnh thất bại.",
        });
        console.log("Lấy ảnh gốc.");

        const response = await fetch(imageUrl, { mode: "cors" });
        if (!response.ok) throw new Error("Failed to fetch image");

        const blob = await response.blob();

        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename || "downloaded_image.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(blobUrl);

        console.log("Tải ảnh gốc hoàn tất.");
      }
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
                      `${currentData?.product_id}.jpg`
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
