"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { DiscountService } from "@/services/discount";
import { Loader, SquarePen, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export function ModalUpdateDiscount({ data }: { data: any }) {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingForDelete, setIsLoadingForDelete] = useState<boolean>(false);

  const [name, setName] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [percent, setPercent] = useState<string>("");

  const validateForm = () => {
    if (!name.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập tên mã giảm giá",
      });
      return false;
    }
    if (!code.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập code giảm giá",
      });
      return false;
    }
    if (!percent.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập giá giảm",
      });
      return false;
    }

    const discountNum = Number(percent);
    if (!isFinite(discountNum) || isNaN(discountNum)) {
      toast({
        variant: "destructive",
        title: "Giảm giá phải là số.",
      });
      return false;
    }

    if (discountNum < 0 || discountNum > 100) {
      toast({
        variant: "destructive",
        title: "Giảm giá phải trong khoảng 0 đến 100.",
      });
      return false;
    }

    const hasTooManyDecimals =
      `${percent}`.includes(".") && `${percent}`.split(".")[1].length > 1;
    if (hasTooManyDecimals) {
      toast({
        variant: "destructive",
        title: "Giảm giá chỉ được phép tối đa 1 chữ số thập phân.",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    const body = {
      name: name,
      code: code,
      percent: percent,
    };

    await DiscountService.updateDiscount(data?._id, body);
    setIsLoading(false);
    window.location.href = "/?tab=discount";
  };

  const handleDelete = async () => {
    setIsLoadingForDelete(true);
    await DiscountService.deleteDiscount(data?._id);
    setIsLoadingForDelete(false);
    window.location.href = "/?tab=discount";
  };

  const updateDOM = () => {
    if (data) {
      setName(data?.name);
      setCode(data?.code);
      setPercent(data?.percent);
    }
  };

  useEffect(() => {}, [data]);

  return (
    <Dialog>
      <DialogTrigger onClick={updateDOM}>
        <div className="flex">
          <div className="mx-2 p-2 cursor-pointer hover:bg-indigo-600 rounded-full group">
            <SquarePen
              size={23}
              className="text-gray-900 group-hover:text-white"
            />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[500px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            <span className="!text-[20px]">Chỉnh sửa bài viết</span>
          </DialogTitle>
          <DialogDescription>
            <span className="!text-[16px]">
              Chỉnh sửa thông tin bài viết và nhấn{" "}
              <strong className="text-orange-700">Cập nhật</strong> để lưu thông
              tin.
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="w-full grid grid-cols-1 gap-8">
          <div className="flex flex-col justify-start items-start gap-2">
            <Label htmlFor="description" className="text-[14.5px]">
              Tên mã giảm giá
            </Label>
            <div className="w-full grid items-center gap-4">
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tên mã giảm giá"
                className="col-span-3 p-2 border rounded"
              ></input>
            </div>

            <Label htmlFor="description" className="text-[14.5px]">
              Code giảm giá
            </Label>
            <div className="w-full grid items-center gap-4">
              <input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Code giảm giá"
                className="col-span-3 p-2 border rounded"
              ></input>
            </div>

            <Label htmlFor="description" className="text-[14.5px]">
              Phần trăm giảm giá
            </Label>
            <div className="w-full grid items-center gap-4">
              <input
                id="percent"
                value={percent}
                type="number"
                onChange={(e) => setPercent(e.target.value)}
                placeholder="Phần trăm giảm"
                className="col-span-3 p-2 border rounded"
              ></input>
            </div>
          </div>
        </div>
        <DialogFooter className="w-full !flex !flex-row !justify-between !items-center">
          <Button
            onClick={handleDelete}
            type="submit"
            className="!px-8 !text-[16px] text-red-600 bg-white border-2 border-red-600 hover:bg-red-600 hover:text-white"
          >
            <Trash2 />
            Xoá
            {isLoadingForDelete && (
              <Loader className="animate-spin" size={48} />
            )}
          </Button>
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                className="!px-10 !text-[16px]"
              >
                Huỷ
              </Button>
            </DialogClose>
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex flex-row justify-center items-center gap-2 text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded-md text-sm !px-10 !text-[16px] py-2.5 text-center"
            >
              Cập nhật
              {isLoading && <Loader className="animate-spin" size={17} />}
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
