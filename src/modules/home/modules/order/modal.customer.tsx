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
import { AccountService } from "@/services/account";
import { BlogService } from "@/services/blog";
import { UploadService } from "@/services/upload";
import { ImageUp, Loader, Plus, Upload } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import CustomerCard from "./components/customer-card";
import { ModalCreateOrder } from "./modal.create";

export function ModalCustomer() {
  const [customerData, setCustomerData] = useState<any[]>([]);
  const [originalData, setOriginalData] = useState([] as any);
  const [searchId, setSearchId] = useState<string>("");
  const [openCustomerDialog, setOpenCustomerDialog] = useState(false);

  const init = async () => {
    try {
      const res = await AccountService.getAll();

      if (Array.isArray((res as any)?.data)) {
        const filterCustomer = res.data.filter(
          (item: any) => item.role === "personal"
        );
        setCustomerData(filterCustomer);
        setOriginalData(filterCustomer);
      } else {
        setCustomerData([]);
      }
    } catch (error) {
      console.error("Error fetching blog data:", error);
      setCustomerData([]);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const searchCustomerById = (id: string) => {
    const trimmedId = id.trim();
    setSearchId(trimmedId);

    const filteredData = trimmedId
      ? originalData.filter((customer: any) =>
          customer.name.toLowerCase().includes(trimmedId.toLowerCase())
        )
      : originalData;

    setCustomerData(filteredData);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    searchCustomerById(value);
  };

  return (
    <Dialog open={openCustomerDialog} onOpenChange={setOpenCustomerDialog}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex items-center justify-center text-white bg-indigo-600 hover:opacity-80 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          <Plus size={16} className="mr-2" /> Tạo đơn hàng
        </button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[1000px] max-h-[90vh]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            <span className="!text-[20px]">Tạo đơn hàng mới</span>
          </DialogTitle>
          <DialogDescription>
            <span className="!text-[16px]">
              Vui lòng chọn khách hàng để tạo đơn hàng mới.
            </span>
          </DialogDescription>
        </DialogHeader>
        <>
          <ModalCreateOrder
            searchId={searchId}
            handleSearchChange={handleSearchChange}
            customerData={customerData}
            onCloseCustomerDialog={() => setOpenCustomerDialog(true)}
          />
        </>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className="!px-10 !text-[16px]"
            >
              Huỷ
            </Button>
          </DialogClose>
          {/* <button
            type="submit"
            onClick={handleSubmit}
            className="flex flex-row justify-center items-center gap-2 text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded-md text-sm !px-10 !text-[16px] py-2.5 text-center"
          >
            Lưu
            {isLoading && <Loader className="animate-spin" size={17} />}
          </button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
