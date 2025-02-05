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
import { ProductService } from "@/services/product";
import { UploadService } from "@/services/upload";
import { Loader, Plus, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import ProductDescriptionEditor from "./quill";
import Select from "react-select";
import "@/styles/scroll-hiding.css";
import "@/styles/placeholder.css";

export function ModalCreateProduct() {
  const colorMap: { [key: string]: string } = {
    white: "#FFFFFF",
    black: "#000000",
    gold: "#FFD700",
    silver: "#C0C0C0",
    wood: "#8B5A2B",
  };

  const colorOpt = [
    { value: "white", label: "Trắng" },
    { value: "black", label: "Đen" },
    { value: "gold", label: "Gold" },
    { value: "silver", label: "Bạc" },
    { value: "wood", label: "Gỗ" },
  ];

  const customStyles = {
    option: (provided: any, state: { isFocused: boolean }) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
      gap: "8px",
      backgroundColor: state.isFocused ? "#E5E7EB" : "white", // Gray-200 on hover
      color: "black",
    }),
    control: (provided: any) => ({
      ...provided,
      borderColor: "#CFCFCF",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#CFCFCF",
      },
    }),
  };

  const formatOptionLabel = ({
    value,
    label,
  }: {
    value: string;
    label: string;
  }) => (
    <div className="flex items-center gap-2">
      <span
        className="w-4 h-4 rounded-full border border-gray-300"
        style={{ backgroundColor: colorMap[value] }}
      ></span>
      {label}
    </div>
  );

  const { toast } = useToast();

  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const secondaryImageInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [mainPreview, setMainPreview] = useState<string | null>(null);
  const [secondaryPreviews, setSecondaryPreviews] = useState<string[]>([]);

  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [introduction, setIntroduction] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [color, setColor] = useState<string[]>([]);

  const handleMainImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("File quá lớn. Vui lòng chọn file nhỏ hơn 5MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file hình ảnh");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setMainPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSecondaryImagesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const newPreviews: string[] = [];
    Array.from(files).forEach((file) => {
      // if (file.size > 5 * 1024 * 1024) {
      //     alert(`File ${file.name} quá lớn. Vui lòng chọn file nhỏ hơn 5MB.`);
      //     return;
      // }
      if (!file.type.startsWith("image/")) {
        alert(`File ${file.name} không phải là hình ảnh.`);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === files.length) {
          setSecondaryPreviews((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleColorChange = (selectedOptions: any) => {
    setColor(selectedOptions.map((option: any) => option.value));
  };

  const handleUpdateMainImage = () => {
    mainImageInputRef.current?.click();
  };

  const handleUpdateSecondaryImages = () => {
    secondaryImageInputRef.current?.click();
  };

  const handleRemoveSecondaryImage = (index: number) => {
    setSecondaryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!mainPreview) {
      toast({
        variant: "destructive",
        title: "Vui lòng chọn ảnh chính.",
      });
      return false;
    }

    if (secondaryPreviews.length === 0) {
      toast({
        variant: "destructive",
        title: "Vui lòng thêm ít nhất một ảnh phụ.",
      });
      return false;
    }

    if (!name.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập tên.",
      });
      return false;
    }

    if (!description.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập mô tả.",
      });
      return false;
    }

    if (!introduction.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập phần giới thiệu.",
      });
      return false;
    }

    if (!category.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng chọn danh mục.",
      });
      return false;
    }

    if (!color) {
      toast({
        variant: "destructive",
        title: "Vui lòng chọn màu sắc.",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    const uploadMainImage: any = await UploadService.uploadToCloudinary([
      mainPreview,
    ]);
    const uploadSecondaryImages: any = await UploadService.uploadToCloudinary(
      secondaryPreviews
    );
    const body = {
      name: name,
      description: description,
      introduction: introduction,
      price: price,
      category: category,
      color: color,
      sold: 0,
      thumbnail: uploadMainImage[0]?.url || "",
      images: uploadSecondaryImages?.map((image: any) => image.url),
    };
    await ProductService.createProduct(body);
    setIsLoading(false);
    window.location.href = "/?tab=product";
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-orange-700"
        >
          <Plus size={16} className="mr-2" /> Thêm sản phẩm
        </button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[1200px] h-screen"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            <span className="!text-[20px]">Thêm sản phẩm mới</span>
          </DialogTitle>
          <DialogDescription>
            <span className="!text-[16px]">
              Điền thông tin sản phẩm và nhấn{" "}
              <strong className="text-orange-700">Lưu</strong> để tạo sản phẩm
              mới.
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="w-full grid grid-cols-3 gap-8">
          <div className="col-span-1">
            <div className="overflow-y-auto max-h-[80vh] scroll-bar-style">
              <div className="mb-6">
                <Label htmlFor="thumbnail" className="text-right !text-[16px]">
                  Hình chính
                </Label>
                {mainPreview ? (
                  <Image
                    src={mainPreview}
                    alt="main-preview"
                    className="w-full rounded-md mt-2"
                    width={200}
                    height={0}
                  />
                ) : (
                  <div className="col-span-3 mt-2">
                    <div
                      onClick={handleUpdateMainImage}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-white px-5 py-16 text-sm font-medium text-gray-900 hover:bg-gray-50 hover:text-primary-700 cursor-pointer"
                    >
                      <div className="flex flex-col items-center">
                        <span>+ Tải hình lên</span>
                        <span className="text-xs text-gray-500">
                          hoặc kéo thả file vào đây
                        </span>
                      </div>
                    </div>
                    <input
                      type="file"
                      ref={mainImageInputRef}
                      onChange={handleMainImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                )}
              </div>
              <Label htmlFor="images" className="text-right !text-[16px]">
                Hình phụ
              </Label>
              <div className="col-span-3 mt-2">
                <div
                  onClick={handleUpdateSecondaryImages}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-white py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 hover:text-primary-700 cursor-pointer"
                >
                  <div className="flex flex-col items-center">
                    <span>+ Tải lên</span>
                  </div>
                </div>
                <input
                  type="file"
                  ref={secondaryImageInputRef}
                  onChange={handleSecondaryImagesChange}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                {secondaryPreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={preview}
                      alt={`secondary-preview-${index}`}
                      className="rounded-sm"
                      width={100}
                      height={100}
                    />
                    <button
                      onClick={() => handleRemoveSecondaryImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full text-xs"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <div className="flex flex-col justify-start items-start gap-4 overflow-y-auto max-h-[80vh] pr-4 scroll-bar-style">
              <div className="w-full grid items-center gap-4">
                <textarea
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tên sản phẩm"
                  className="col-span-3 p-2 border border-[#CFCFCF] placeholder-custom rounded"
                ></textarea>
              </div>
              <div className="w-full grid items-center gap-4">
                <select
                  id="category"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                  }}
                  className="col-span-3 p-2 border border-[#CFCFCF] rounded"
                >
                  <option value="">Chọn danh mục</option>
                  <option value="Plastic">Plastic</option>
                  <option value="Frame">Khung Ảnh</option>
                  <option value="Album">Album</option>
                </select>
              </div>
              <div className="w-full grid items-center gap-4">
                <input
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Giá"
                  className="col-span-3 p-2 border border-[#CFCFCF] rounded placeholder-custom focus:border-gray-500"
                ></input>
              </div>
              <div className="w-full grid items-center gap-4">
                <Select
                  className="cursor-pointer pl-[0.5px]"
                  options={colorOpt}
                  isMulti={true}
                  placeholder="Chọn màu"
                  onChange={handleColorChange}
                  value={colorOpt.filter((option) =>
                    color.includes(option.value)
                  )}
                  styles={customStyles}
                  formatOptionLabel={formatOptionLabel}
                />
              </div>
              <ProductDescriptionEditor
                value={description}
                onChange={setDescription}
                title="Mô tả sản phẩm"
              />
              <ProductDescriptionEditor
                value={introduction}
                onChange={setIntroduction}
                title="Giới thiệu sản phẩm"
              />
            </div>
          </div>
        </div>
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
          <Button
            type="submit"
            onClick={handleSubmit}
            className="!px-10 !text-[16px]"
          >
            Lưu
            {isLoading && <Loader className="animate-spin" size={48} />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
