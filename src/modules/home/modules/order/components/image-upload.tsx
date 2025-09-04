"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast"; // Import the toast hook

interface ImageUploadProps {
  onImageChange: (file: File | null) => void;
  selectedColor: string;
  selectedSize: string;
  selectedProduct: string; // Add selectedProduct prop
  className?: string;
}

const ImageUpload = ({
  onImageChange,
  selectedColor,
  selectedSize,
  selectedProduct,
  className,
}: ImageUploadProps) => {
  const [preview, setPreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const sizeMap = {
    "15x21": { width: 150, height: 210 },
    "20x30": { width: 200, height: 300 },
    "40x20": { width: 400, height: 200 },
  };

  const getContainerStyle = () => {
    const size = sizeMap[selectedSize as keyof typeof sizeMap];
    if (!size) return {};

    const aspectRatio = size.width / size.height;
    return {
      aspectRatio: `${aspectRatio}`,
      width: "100%",
      margin: "0 auto",
    };
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedProduct === "Chon san pham") {
      toast({
        title: "",
        description: "Vui lòng chọn một sản phẩm trước khi tải lên hình ảnh!",
        variant: "destructive",
      });
      return;
    }

    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "",
        description: "File quá lớn. Vui lòng chọn file nhỏ hơn 10MB",
        variant: "destructive",
      });
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast({
        title: "",
        description: "Vui lòng chọn file hình ảnh",
        variant: "destructive",
      });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    onImageChange(file);
  };

  const handleClick = () => {
    if (selectedProduct === "Chon san pham") {
      toast({
        title: "",
        description: "Vui lòng chọn một sản phẩm trước khi tải lên hình ảnh!",
        variant: "destructive",
      });
      return;
    }
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (selectedProduct === "Chon san pham") {
      toast({
        title: "",
        description: "Vui lòng chọn một sản phẩm trước khi tải lên hình ảnh!",
        variant: "destructive",
      });
      return;
    }

    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({
        title: "",
        description: "Vui lòng chọn file hình ảnh",
        variant: "destructive",
      });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    onImageChange(file);
  };

  return (
    <div
      className={cn(
        "flex justify-center lg:!justify-start lg:items-start",
        className
      )}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      {!preview ? (
        <div className="flex justify-center !w-full">
          <div
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="cursor-pointer border-2 border-dashed border-gray-300 p-4 flex flex-col items-center justify-center !w-full !h-64 mb-0 rounded-lg"
            style={getContainerStyle()}
          >
            <div className="text-gray-500 flex flex-col items-center">
              <div className="flex flex-row justify-center items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Tải hình ảnh lên</span>
              </div>
              <span className="text-xs mt-1">hoặc kéo thả ảnh vào đây</span>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="relative group h-[340px] lg:!h-64"
          style={getContainerStyle()}
        >
          <div
            className={cn(
              "relative w-full overflow-hidden rounded-md",
              `border-8 ${
                selectedColor === "white"
                  ? "border-gray-200"
                  : selectedColor === "black"
                  ? "border-black"
                  : selectedColor === "gold"
                  ? "border-yellow-400"
                  : selectedColor === "silver"
                  ? "border-gray-200"
                  : selectedColor === "wood"
                  ? "border-yellow-950"
                  : "border-gray-200"
              }`
            )}
          >
            <div className="relative !w-64 !h-64" />
            <Image
              src={preview}
              alt="Preview"
              width={1000}
              height={1000}
              priority
              className="absolute top-0 left-0 !w-full !h-64 object-contain"
            />
          </div>
          {/* <div
            onClick={handleClick}
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-white px-5 py-3 mt-5 text-sm font-medium text-gray-900 hover:bg-gray-50 hover:text-primary-700 cursor-pointer"
          >
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-500">Thay đổi hình ảnh</span>
            </div>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
