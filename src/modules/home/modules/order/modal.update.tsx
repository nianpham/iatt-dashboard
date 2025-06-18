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
import { Info, Loader } from "lucide-react";
import { IMAGES } from "@/utils/image";
import JSZip from "jszip";

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
  const [downloadLoadingAlbum, setDownloadLoadingAlbum] = useState(false);

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

    if (currentData?.status === "waiting" && status === "pending") {
      const body = {
        status: status,
      };
      await OrderService.updateOrder(currentData?._id, body);
      window.location.href = "/?tab=order";
      return true;
    }

    if (
      status !== "cancelled" &&
      newStatusValue !== currentStatusValue + 1 &&
      !(currentData?.status === "paid" && status === "pending")
    ) {
      toast({
        variant: "destructive",
        title: "Chỉ có thể chuyển sang trạng thái tiếp theo trong quy trình.",
      });
      return false;
    }

    if (
      currentStatusValue > newStatusValue &&
      !(currentData?.status === "paid" && status === "pending")
    ) {
      toast({
        variant: "destructive",
        title: "Không thể chuyển về trạng thái trước đó.",
      });
      return false;
    }

    const body = {
      status: status,
      isPayed:
        status === "completed" || status === "paid" || data.isPayed === true
          ? true
          : false,
    };

    await OrderService.updateOrder(currentData?._id, body);
    window.location.href = "/?tab=order";
  };

  const isCashPayment = currentData?.payment_method === "cash";

  const downloadImage = async (imageUrl: string): Promise<Blob | null> => {
    if (!imageUrl) {
      console.error("Invalid image URL");
      return null;
    }

    try {
      const response = await fetch(imageUrl, { mode: "cors" });
      if (!response.ok) throw new Error("Failed to fetch image");
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error("Error downloading image:", error);
      return null;
    }
  };

  const downloadSingleImage = async (imageUrl: string, filename: string) => {
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

      let scaleFactor = 1;
      let blob: Blob | null = null;
      let minFileSize =
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
    } catch (error) {
      console.error("Error processing image:", error);
      toast({
        variant: "destructive",
        title: "Lỗi khi tải ảnh.",
      });
    } finally {
      setDownloadLoading(false);
    }
  };

  const downloadAlbumFolder = async () => {
    if (!currentData?.album_data || !Array.isArray(currentData.album_data)) {
      toast({
        variant: "destructive",
        title: "Không có dữ liệu album để tải.",
      });
      return;
    }

    setDownloadLoadingAlbum(true);
    const zip = new JSZip();

    try {
      const imagePromises = currentData.album_data.map(
        async (imageUrl: string, index: number) => {
          const blob = await downloadImage(imageUrl);
          if (blob) {
            const filename = `${currentData?._id?.slice(-4)}_page_${
              index + 1
            }.jpg`;
            zip.file(filename, blob);
          }
        }
      );

      await Promise.all(imagePromises);
      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = `${currentData?._id?.slice(-4)}_album.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error creating ZIP file:", error);
      toast({
        variant: "destructive",
        title: "Lỗi khi tạo file nén.",
      });
    } finally {
      setDownloadLoadingAlbum(false);
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
        <div className="flex">
          <div className="mx-2 p-2 cursor-pointer hover:bg-indigo-600 rounded-full group">
            <Info size={23} className="text-gray-900 group-hover:text-white" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[850px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            <span className="!text-[20px]">
              Chi tiết đơn hàng{" "}
              {currentData?.order_type === "album" ? "Album" : "Khung ảnh"}
            </span>
          </DialogTitle>
          <DialogDescription>
            <span className="!text-[16px]">
              Mã đơn hàng: #{currentData?._id}
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="w-full grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-6">
            <div
              className={`flex flex-col ${
                currentData?.order_type === "frame" ||
                (currentData?.order_type === "album" &&
                  currentData?.album_cover === "bia-da")
                  ? "gap-4"
                  : "gap-0"
              }`}
            >
              <div className="flex items-start">
                {currentData?.order_type === "frame" && (
                  <>
                    <Image
                      src={currentData?.image || "/fallback-image.jpg"}
                      alt="img"
                      className="w-20 h-20 mr-3 object-cover rounded-md border border-gray-300"
                      width={100}
                      height={100}
                      priority
                    />
                    <div className="flex flex-col items-start">
                      <span className="text-[16px] line-clamp-2 bg-primary-100 text-gray-900 font-medium pb-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
                        {
                          products?.find(
                            (pro: any) =>
                              pro._id.toString() === currentData?.product_id
                          )?.name
                        }
                      </span>
                      <button
                        onClick={() =>
                          downloadSingleImage(
                            currentData?.image,
                            `${currentData?._id?.slice(-4)}_${
                              currentData?.size
                            }.jpg`
                          )
                        }
                        className="text-[14px] line-clamp-2 text-indigo-600 hover:underline font-medium py-0.5 rounded dark:bg-primary-900 dark:text-primary-300"
                      >
                        {!downloadLoading ? (
                          <div>Tải file ảnh</div>
                        ) : (
                          <div className="flex flex-row justify-center items-center gap-3">
                            Đang tải ảnh...
                            <Loader className="animate-spin" size={15} />
                          </div>
                        )}
                      </button>
                    </div>
                  </>
                )}
                {currentData?.order_type === "album" &&
                  currentData?.album_cover === "bia-da" && (
                    <>
                      <Image
                        src={currentData?.cover_image || "/fallback-image.jpg"}
                        alt="img"
                        className="w-20 h-20 mr-3 object-cover rounded-md border border-gray-300"
                        width={100}
                        height={100}
                        priority
                      />
                      <div className="flex flex-col items-start">
                        <span className="text-[16px] line-clamp-2 bg-primary-100 text-gray-900 font-medium pb-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
                          ẢNH BÌA ALBUM BÌA DA
                        </span>
                        <button
                          onClick={() =>
                            downloadSingleImage(
                              currentData?.cover_image,
                              `${currentData?._id?.slice(-4)}_${
                                currentData?.size
                              }.jpg`
                            )
                          }
                          className="mb-1 text-[14px] line-clamp-2 bg-indigo-600 text-white px-6 font-medium py-0.5 rounded dark:bg-primary-900 dark:text-primary-300"
                        >
                          {!downloadLoading ? (
                            <div>Tải file ảnh</div>
                          ) : (
                            <div className="flex flex-row justify-center items-center gap-3">
                              Đang tải ảnh...
                              <Loader className="animate-spin" size={15} />
                            </div>
                          )}
                        </button>
                        {currentData?.order_type === "album" && (
                          <div className="">
                            <button
                              onClick={downloadAlbumFolder}
                              className="text-[14px] line-clamp-2 bg-indigo-600 text-white px-6 font-medium py-0.5 rounded dark:bg-primary-900 dark:text-primary-300"
                            >
                              {!downloadLoadingAlbum ? (
                                <div>Tải folder album ảnh</div>
                              ) : (
                                <div className="flex flex-row justify-center items-center gap-3">
                                  Đang tải folder...
                                  <Loader className="animate-spin" size={15} />
                                </div>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
              </div>
              {currentData?.order_type === "album" &&
                currentData?.album_cover !== "bia-da" && (
                  <div className="">
                    <button
                      onClick={downloadAlbumFolder}
                      className="text-[14px] line-clamp-2 bg-indigo-600 text-white px-6 font-medium py-0.5 rounded dark:bg-primary-900 dark:text-primary-300"
                    >
                      {!downloadLoadingAlbum ? (
                        <div>Tải folder album ảnh</div>
                      ) : (
                        <div className="flex flex-row justify-center items-center gap-3">
                          Đang tải folder...
                          <Loader className="animate-spin" size={15} />
                        </div>
                      )}
                    </button>
                  </div>
                )}
            </div>

            <div className="flex flex-col gap-2">
              {currentData?.order_type === "frame" && (
                <span>
                  <strong>Màu khung:</strong>{" "}
                  {HELPER.renderColorText(currentData?.color)}
                </span>
              )}
              <span>
                <strong>Kích thước:</strong> {currentData?.size}
              </span>
              {currentData?.order_type === "album" && (
                <>
                  <span>
                    <strong>Số trang:</strong> {currentData?.pages}
                  </span>
                  <span>
                    <strong>Loại bìa:</strong>{" "}
                    {HELPER.renderAlbumCover(currentData?.album_cover)}
                  </span>
                  {/* <span>
                    <strong>Loại ruột:</strong>{" "}
                    {HELPER.renderAlbumCore(currentData?.album_core)}
                  </span> */}
                </>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <span>
                <strong>Ngày tạo đơn hàng:</strong>{" "}
                {HELPER.formatDate(currentData?.created_at)}
              </span>
              <span>
                {currentData?.status === "cancelled" ? (
                  <strong>Đơn hàng đã bị hủy</strong>
                ) : (
                  <>
                    <strong>Ngày hoàn tất đơn hàng:</strong>
                    {!currentData?.date_completed
                      ? " Đơn hàng đang được xử lí."
                      : HELPER.formatDate(currentData?.date_completed)}
                  </>
                )}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="flex flex-col items-start gap-2">
                <strong>Phương thức thanh toán:</strong>{" "}
                <div
                  className={`
                      ${
                        currentData?.payment_method === "cash"
                          ? "text-black text-sm lg:text-base"
                          : ""
                      }
                      ${
                        currentData?.payment_method === "bank"
                          ? "text-black text-sm lg:text-base"
                          : ""
                      }
                      ${
                        currentData?.payment_method === "momo"
                          ? "text-pink-500 text-sm lg:text-base"
                          : ""
                      }
                      ${
                        currentData?.payment_method === "vnpay"
                          ? "text-blue-600 text-sm lg:text-base"
                          : ""
                      }
                      lg:py-2 rounded-md py-0 text-center w-1/2 lg:w-[50%]`}
                >
                  {currentData?.payment_method === "cash" && (
                    <div className="flex flex-row items-center justify-start gap-3">
                      <Image
                        src={IMAGES.COD}
                        alt="momo"
                        width={1000}
                        height={1000}
                        className="w-6 h-6 object-cover rounded-lg"
                      />
                      <div>Tiền mặt</div>
                    </div>
                  )}
                  {currentData?.payment_method === "bank" && (
                    <div className="flex flex-row items-center justify-start gap-3">
                      <Image
                        src={IMAGES.BANK}
                        alt="momo"
                        width={1000}
                        height={1000}
                        className="w-6 h-6 object-cover rounded-lg"
                      />
                      <div>Chuyển khoản</div>
                    </div>
                  )}
                  {/*  {order?.payment_method === "momo" && (
                  <div className="flex flex-row items-center justify-center gap-3">
                    <Image
                      src={IMAGES.MOMO}
                      alt="momo"
                      width={1000}
                      height={1000}
                      className="w-6 h-6 object-cover rounded-lg"
                    />
                    <div>MOMO</div>
                  </div>
                )}
                {order?.payment_method === "vnpay" && (
                  <div className="flex flex-row items-center justify-center gap-3">
                    <Image
                      src={IMAGES.VNPAY}
                      alt="momo"
                      width={1000}
                      height={1000}
                      className="w-6 h-6 object-cover rounded-lg"
                    />
                    <div>VNPay</div>
                  </div>
                )} */}
                </div>
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
                src={
                  accounts?.find(
                    (pro: any) => pro._id.toString() === currentData?.account_id
                  )?.avatar ||
                  "https://cdn-icons-png.flaticon.com/128/4333/4333609.png"
                }
                alt="img"
                className="w-auto h-12 mr-3 rounded-full"
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
            {currentData?.status === "cancelled" ? (
              <Button
                className={`w-56 cursor-default hover:bg-[rgb(var(--primary-rgb))]
                   ${
                     data.status === "completed"
                       ? "bg-green-600 text-white"
                       : ""
                   }
                        ${
                          data.status === "delivering"
                            ? "bg-blue-600 text-white"
                            : ""
                        }
                        ${
                          data.status === "waiting"
                            ? "bg-yellow-600 text-white"
                            : ""
                        }
                        ${
                          data.status === "pending"
                            ? "bg-yellow-600 text-white"
                            : ""
                        }
                        ${
                          data.status === "paid pending"
                            ? "bg-gray-600 text-white"
                            : ""
                        }
                        ${
                          data.status === "paid"
                            ? "bg-purple-600 text-white"
                            : ""
                        }
                        ${
                          data.status === "cancelled"
                            ? "bg-red-600 text-white"
                            : ""
                        }`}
              >
                {HELPER.renderStatus(data?.status)}
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className={`w-56 
                        ${
                          data.status === "completed"
                            ? "bg-green-600 hover:bg-green-600 hover:opacity-85 text-white"
                            : ""
                        }
                        ${
                          data.status === "delivering"
                            ? "bg-blue-600 hover:bg-blue-600 hover:opacity-85 text-white"
                            : ""
                        }
                        ${
                          data.status === "waiting"
                            ? "bg-yellow-600 hover:bg-yellow-600 hover:opacity-85 text-white"
                            : ""
                        }
                        ${
                          data.status === "pending"
                            ? "bg-yellow-600 hover:bg-yellow-600 hover:opacity-85 text-white"
                            : ""
                        }
                        ${
                          data.status === "paid pending"
                            ? "bg-gray-600 hover:bg-gray-600 hover:opacity-85 text-white"
                            : ""
                        }
                        ${
                          data.status === "paid"
                            ? "bg-purple-600 hover:bg-purple-600 hover:opacity-85 text-white"
                            : ""
                        }
                        ${
                          data.status === "cancelled"
                            ? "bg-red-600 hover:bg-red-600 hover:opacity-85 text-white"
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
                    2. Chờ thanh toán
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
                    // disabled={
                    //   statusOrder[
                    //     currentData?.status as keyof typeof statusOrder
                    //   ] > 4 ||
                    //   (statusOrder[
                    //     currentData?.status as keyof typeof statusOrder
                    //   ] < 4 &&
                    //     currentData?.status !== "waiting")
                    // }
                    disabled={
                      statusOrder[
                        currentData?.status as keyof typeof statusOrder
                      ] > 4
                    }
                  >
                    4. Chuẩn bị đơn
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
                    5. Vận chuyển
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
                    6. Hoàn thành
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    className="cursor-pointer"
                    onClick={() => handleUpdateStatus("cancelled")}
                  >
                    7. Đã hủy đơn
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
