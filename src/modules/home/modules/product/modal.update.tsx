/* eslint-disable react-hooks/exhaustive-deps */
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
import ProductDescriptionEditor from "./quill";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ProductService } from "@/services/product";
import {
  ImageUp,
  Loader,
  Plus,
  SquarePen,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import Select from "react-select";
import { UploadService } from "@/services/upload";

export function ModalUpdateProduct({ data }: { data: any }) {
  const colorMap: { [key: string]: string } = {
    white: "#FFFFFF",
    black: "#000000",
    gold: "#EBB305",
    silver: "#C0C0C0",
    wood: "#713F11",
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
      backgroundColor: state.isFocused ? "#EEEEEE" : "white",
      color: "black",
      cursor: "pointer",
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
        className={`w-4 h-4 rounded-sm border ${
          value === "white"
            ? "border-gray-500"
            : value === "black"
            ? "border-black"
            : value === "gold"
            ? "border-yellow-500"
            : value === "silver"
            ? "border-neutral-300"
            : "border-amber-900"
        } }`}
        style={{ backgroundColor: colorMap[value] }}
      ></span>
      {label}
    </div>
  );

  const selectedColors = colorOpt.filter((color) =>
    data?.color?.includes(color.value)
  );

  const { toast } = useToast();

  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const secondaryImageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingForDelete, setIsLoadingForDelete] = useState<boolean>(false);

  const [mainPreview, setMainPreview] = useState<string | null>(null);
  const [secondaryPreviews, setSecondaryPreviews] = useState<string[]>([]);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [introduction, setIntroduction] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [color, setColor] = useState<string[]>(data?.color ?? []);
  const [sizesAndPrices, setSizesAndPrices] = useState<
    { size: string; price: string }[]
  >([{ size: "", price: "" }]);
  const [rating, setRating] = useState<string>("");
  const [discount, setDiscount] = useState<string>("");
  const [active, setActive] = useState<boolean>(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isVideoRemoved, setIsVideoRemoved] = useState<boolean>(false);

  const handleVideoFile = useCallback(
    (file: File) => {
      if (file.size > 50 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File quá lớn",
          description: "Vui lòng chọn file nhỏ hơn 50MB.",
        });
        return;
      }

      if (!file.type.includes("mp4")) {
        toast({
          variant: "destructive",
          title: "Định dạng không hợp lệ",
          description: "Vui lòng chọn file video MP4.",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setVideoPreview(reader.result as string);
          setVideoFile(file);
          setIsVideoRemoved(false);
        } else {
          toast({
            variant: "destructive",
            title: "Lỗi",
            description: "Không thể đọc file video.",
          });
        }
      };
      reader.onerror = () => {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Đã xảy ra lỗi khi đọc file.",
        });
      };
      reader.readAsDataURL(file);
    },
    [toast]
  );

  const handleRemoveVideo = () => {
    setVideoPreview(null);
    setVideoFile(null);
    setIsVideoRemoved(true);
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const handleVideoDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleVideoFile(file);
    }
  };

  const handleVideoDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleVideoDragLeave = () => {
    setIsDragging(false);
  };

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    handleVideoFile(file);
  };

  const handleUpdateVideo = () => {
    videoInputRef.current?.click();
  };

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
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} quá lớn. Vui lòng chọn file nhỏ hơn 5MB.`);
        return;
      }
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

  const handleUpdateMainImage = () => {
    mainImageInputRef.current?.click();
  };

  const handleUpdateSecondaryImages = () => {
    secondaryImageInputRef.current?.click();
  };

  const handleRemoveSecondaryImage = (index: number) => {
    setSecondaryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleColorChange = (selectedOptions: any) => {
    const selectedValues = selectedOptions.map((option: any) => option.value);
    setColor(selectedValues);
  };

  const handleSizePriceChange = (
    index: number,
    field: "size" | "price",
    value: string
  ) => {
    const updatedSizesAndPrices = [...sizesAndPrices];
    if (field === "price") {
      if (value === "" || /^\d*$/.test(value)) {
        updatedSizesAndPrices[index][field] = value;
      }
    } else {
      updatedSizesAndPrices[index][field] = value;
    }
    setSizesAndPrices(updatedSizesAndPrices);
  };

  const handleAddSizePrice = () => {
    setSizesAndPrices([...sizesAndPrices, { size: "", price: "" }]);
  };

  const handleRemoveSizePrice = (index: number) => {
    if (sizesAndPrices.length > 1) {
      setSizesAndPrices(sizesAndPrices.filter((_, i) => i !== index));
    }
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

    if (sizesAndPrices.some((sp) => !sp.size.trim() || !sp.price.trim())) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập đầy đủ kích cỡ và giá.",
      });
      return false;
    }

    const sizeRegex = /^\d+x\d+$/;
    if (
      sizesAndPrices.some(
        (sp) => !sp.size.trim() || !sp.price.trim() || !sizeRegex.test(sp.size)
      )
    ) {
      toast({
        variant: "destructive",
        title: "Kích cỡ phải theo định dạng sốxsố (ví dụ: 15x21).",
      });
      return false;
    }

    // Validate price: integer only and > 1000
    const integerRegex = /^\d+$/;
    if (
      sizesAndPrices.some((sp) => {
        const priceStr = `${sp.price}`.trim();
        if (!integerRegex.test(priceStr)) return true;
        const priceNum = Number(priceStr);
        return priceNum <= 1000;
      })
    ) {
      toast({
        variant: "destructive",
        title: "Giá phải là số nguyên và lớn hơn 1000.",
      });
      return false;
    }

    // Validate rating selected
    if (!rating || !`${rating}`.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng chọn đánh giá.",
      });
      return false;
    }

    // Validate discount: required, 0-100 inclusive, max 1 decimal place
    if (!`${discount}`.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập giảm giá sản phẩm.",
      });
      return false;
    }

    const discountNum = Number(discount);
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
      `${discount}`.includes(".") && `${discount}`.split(".")[1].length > 1;
    if (hasTooManyDecimals) {
      toast({
        variant: "destructive",
        title: "Giảm giá chỉ được phép tối đa 1 chữ số thập phân.",
      });
      return false;
    }

    // if (!videoFile && !data?.video) {
    //   toast({
    //     variant: "destructive",
    //     title: "Vui lòng chọn video.",
    //   });
    //   return false;
    // }

    return true;
  };

  const handleImageUpload = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const uploadResponse = await UploadService.uploadToCloudinary([file]);
      if (
        uploadResponse &&
        Array.isArray(uploadResponse) &&
        uploadResponse[0]
      ) {
        return uploadResponse[0]?.secure_url;
      } else {
        console.error("Upload failed or response is not as expected");
        return "";
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      return "";
    }
  }, []);

  const extractBase64Images = (htmlContent: string) => {
    const imgTagRegex =
      /<img[^>]+src=["'](data:image\/[^;]+;base64[^"']+)["'][^>]*>/g;
    const matches = [...htmlContent.matchAll(imgTagRegex)];
    return matches.map((match) => match[1]);
  };

  const replaceBase64WithCloudUrls = async (
    htmlContent: string,
    uploadFunc: (file: File) => Promise<string>
  ) => {
    const imgTagRegex =
      /<img[^>]+src=["'](data:image\/[^;]+;base64[^"']+)["'][^>]*>/g;
    let updatedContent = htmlContent;

    const matches = [...htmlContent.matchAll(imgTagRegex)];
    for (const match of matches) {
      const base64String = match[1];
      const file = base64ToFile(base64String);
      const uploadedUrl = await uploadFunc(file);
      updatedContent = updatedContent.replace(base64String, uploadedUrl);
    }

    return updatedContent;
  };

  const base64ToFile = (base64String: string): File => {
    const arr = base64String.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], "image.png", { type: mime });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    const updatedDescription = await replaceBase64WithCloudUrls(
      description,
      handleImageUpload
    );
    const updatedIntroduction = await replaceBase64WithCloudUrls(
      introduction,
      handleImageUpload
    );

    let videoUrl = data?.video;

    if (isVideoRemoved) {
      videoUrl = "";
    } else if (videoFile) {
      const uploadVideo: any = await UploadService.uploadToCloudinaryVideo([
        videoFile,
      ]);
      videoUrl = uploadVideo[0]?.url || "";
    }

    // Upload mainPreview if it's a base64 data URL
    let thumbnailUrl = mainPreview || "";
    if (thumbnailUrl && thumbnailUrl.startsWith("data:")) {
      try {
        const mainFile = base64ToFile(thumbnailUrl);
        const uploaded = await UploadService.uploadToCloudinary([mainFile]);
        thumbnailUrl =
          (uploaded &&
            Array.isArray(uploaded) &&
            (uploaded[0]?.secure_url || uploaded[0]?.url)) ||
          "";
      } catch (err) {
        console.error("Upload thumbnail failed:", err);
      }
    }

    // Upload any secondaryPreviews that are base64 data URLs
    const resolvedSecondaryPreviews = await Promise.all(
      (secondaryPreviews || []).map(async (preview) => {
        try {
          if (preview && preview.startsWith("data:")) {
            const file = base64ToFile(preview);
            const uploaded = await UploadService.uploadToCloudinary([file]);
            return (
              (uploaded &&
                Array.isArray(uploaded) &&
                (uploaded[0]?.secure_url || uploaded[0]?.url)) ||
              ""
            );
          }
          return preview;
        } catch (err) {
          console.error("Upload secondary image failed:", err);
          return "";
        }
      })
    );

    const body = {
      name: name,
      description: updatedDescription,
      introduction: updatedIntroduction,
      product_option: sizesAndPrices.map((sp) => ({
        size: sp.size,
        price: sp.price,
      })),
      category: category,
      color: color,
      discount: discount,
      rating: rating,
      thumbnail: thumbnailUrl,
      images: resolvedSecondaryPreviews,
      active: active,
      video: videoUrl,
    };

    console.log("CHECK BODY: ", body);

    const response = await ProductService.updateProduct(data?._id, body);

    setIsLoading(false);
    window.location.href = "/?tab=product";
  };

  const handleDelete = async () => {
    setIsLoadingForDelete(true);
    await ProductService.deleteProduct(data?._id);
    setIsLoadingForDelete(false);
    window.location.href = "/?tab=product";
  };

  const updateDOM = () => {
    if (data) {
      setName(data?.name);
      setSizesAndPrices(
        Array.isArray(data?.product_option) && data.product_option.length > 0
          ? data.product_option.map((sp: any) => ({
              size: sp.size || "",
              price: sp.price || "",
            }))
          : [{ size: "", price: "" }]
      );
      setCategory(data?.category);
      setColor(data?.color);
      setRating(data?.rating);
      setDiscount(data?.discount);
      setDescription(data?.description);
      setIntroduction(data?.introduction);
      setMainPreview(data?.thumbnail);
      setSecondaryPreviews(data?.images);
      setActive(data?.active);
      setVideoPreview(data?.video);
      setIsVideoRemoved(false);
    }
  };

  useEffect(() => {
    updateDOM();
  }, [data]);

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
        className="sm:max-w-[1200px] max-h-[90vh]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            <span className="!text-[20px]">Chỉnh sửa sản phẩm</span>
          </DialogTitle>
          <DialogDescription>
            <span className="!text-[16px]">
              Chỉnh sửa thông tin sản phẩm và nhấn{" "}
              <strong className="text-indigo-600">Cập nhật</strong> để lưu thông
              tin.
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="w-full grid grid-cols-3 gap-8">
          <div className="col-span-1">
            <div className="overflow-y-auto hide-scrollbar max-h-[70vh] scroll-bar-style">
              <div className="mb-6">
                <Label htmlFor="thumbnail" className="text-right !text-[16px]">
                  Hình chính
                </Label>
                <div className="mt-2">
                  {!mainPreview && (
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
                  )}
                  <input
                    type="file"
                    ref={mainImageInputRef}
                    onChange={handleMainImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  {mainPreview && (
                    <div className="mt-2">
                      <div className="relative group w-full h-80">
                        <div className="absolute top-0 left-0 right-0 bottom-0 group-hover:bg-black rounded-md opacity-25 z-0 transform duration-200"></div>
                        <div className="cursor-pointer absolute top-[43%] left-[43%] hidden group-hover:flex z-10 transform duration-200">
                          <div className="bg-indigo-600 hover:bg-indigo-700 p-2 rounded-full">
                            <Upload
                              onClick={handleUpdateMainImage}
                              color="white"
                              size={26}
                            />
                          </div>
                        </div>
                        <Image
                          src={mainPreview}
                          alt="main-preview"
                          className="w-full h-full object-cover rounded-md mt-2 border border-gray-200"
                          width={1000}
                          height={1000}
                        />
                      </div>
                    </div>
                  )}
                </div>
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
              <div className="grid grid-cols-3 gap-3 mt-4 pr-2">
                {secondaryPreviews?.map((preview: any, index: any) => (
                  <div key={index} className="relative">
                    <Image
                      src={preview}
                      alt={`secondary-preview-${index}`}
                      className="rounded-sm border border-gray-200 w-full h-28 object-cover"
                      width={1000}
                      height={1000}
                    />
                    <button
                      onClick={() => handleRemoveSecondaryImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full text-xs"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="my-6">
                <Label htmlFor="video" className="text-right !text-[16px]">
                  Video
                </Label>
                <div className="mt-2">
                  {!videoPreview && (
                    <div
                      onClick={handleUpdateVideo}
                      onDrop={handleVideoDrop}
                      onDragOver={handleVideoDragOver}
                      onDragLeave={handleVideoDragLeave}
                      className={`flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed ${
                        isDragging
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-300"
                      } bg-white px-5 py-16 text-sm font-medium text-gray-900 hover:bg-gray-50 hover:text-primary-700 cursor-pointer`}
                    >
                      <div className="flex flex-col items-center">
                        <span>+ Tải video lên</span>
                        <span className="text-xs text-gray-500">
                          hoặc kéo thả file MP4 vào đây
                        </span>
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={videoInputRef}
                    onChange={handleVideoChange}
                    accept="video/mp4"
                    className="hidden"
                  />
                  {videoPreview && (
                    <div className="mt-2 relative">
                      <video
                        className="h-full w-full rounded-lg object-contain object-center"
                        controls
                        autoPlay={false}
                        muted
                        onError={() => {
                          toast({
                            variant: "destructive",
                            title: "Lỗi",
                            description: "Không thể tải video để xem trước.",
                          });
                        }}
                      >
                        <source src={videoPreview} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <button
                        onClick={handleRemoveVideo}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                        title="Xóa video"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <div className="flex flex-col justify-start items-start gap-2 overflow-y-auto hide-scrollbar max-h-[70vh] pr-0 scroll-bar-style">
              <div className="mb-3 flex flex-col gap-3 items-center">
                <Label htmlFor="active" className="text-[16px] mt-2">
                  Trạng thái
                </Label>
                <input
                  type="checkbox"
                  id="active"
                  className="switch ml-0"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                />
              </div>
              <Label htmlFor="description" className="text-[14.5px]">
                Tên sản phẩm
              </Label>
              <div className="w-full grid items-center gap-4">
                <textarea
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tên sản phẩm"
                  className="col-span-3 p-2 border border-[#CFCFCF] rounded placeholder-custom focus:border-gray-500"
                ></textarea>
              </div>
              <Label htmlFor="description" className="text-[14.5px] mt-2">
                Chọn danh mục
              </Label>
              <div className="w-full grid items-center gap-4">
                <select
                  id="category"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                  }}
                  className="col-span-3 p-2 border border-[#CFCFCF] rounded placeholder-custom focus:border-gray-500"
                >
                  <option value="">Chọn danh mục</option>
                  <option value="Plastic">In ảnh rời</option>
                  <option value="Plastic-Frame">In ảnh có khung viền</option>
                  <option value="Frame">Khung lẻ</option>
                  <option value="Album">Album/Photobook</option>
                </select>
              </div>
              <div className="flex flex-col gap-4 w-full">
                {sizesAndPrices.map((sp, index) => (
                  <div
                    key={index}
                    className="flex flex-row justify-between items-center gap-4 w-full"
                  >
                    <div className="flex flex-col w-full">
                      <Label
                        htmlFor={`size-${index}`}
                        className="text-[14.5px]"
                      >
                        Kích cỡ
                      </Label>
                      <div className="w-full grid items-center gap-4 mt-1">
                        <input
                          id={`size-${index}`}
                          value={sp.size}
                          onChange={(e) =>
                            handleSizePriceChange(index, "size", e.target.value)
                          }
                          placeholder="Kích cỡ"
                          className="col-span-3 p-2 border border-[#CFCFCF] rounded placeholder-custom focus:border-gray-500"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col w-full">
                      <Label
                        htmlFor={`price-${index}`}
                        className="text-[14.5px]"
                      >
                        Giá sản phẩm
                      </Label>
                      <div className="w-full grid items-center gap-4 mt-1">
                        <input
                          id={`price-${index}`}
                          value={sp.price}
                          onChange={(e) =>
                            handleSizePriceChange(
                              index,
                              "price",
                              e.target.value
                            )
                          }
                          placeholder="Giá"
                          className="col-span-3 p-2 border border-[#CFCFCF] rounded placeholder-custom focus:border-gray-500"
                        />
                      </div>
                    </div>
                    {sizesAndPrices.length > 1 && (
                      <button
                        onClick={() => handleRemoveSizePrice(index)}
                        className="mt-6 bg-red-500 text-white p-2 rounded-full"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <div>
                  <button
                    type="button"
                    onClick={handleAddSizePrice}
                    className="p-1.5 flex flex-row justify-center items-center gap-2 text-white bg-indigo-600 hover:opacity-80 font-medium rounded-full text-sm !text-[16px] text-center"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
              <Label htmlFor="description" className="text-[14.5px] mt-2">
                Chọn màu sắc
              </Label>
              <div className="w-full grid items-center gap-4">
                <Select
                  className="pl-[0.5px]"
                  options={colorOpt}
                  value={colorOpt.filter((colorOptItem) =>
                    color.includes(colorOptItem.value)
                  )}
                  isMulti={true}
                  placeholder="Chọn màu"
                  onChange={handleColorChange}
                  styles={customStyles}
                  formatOptionLabel={formatOptionLabel}
                />
              </div>

              <Label htmlFor="description" className="text-[14.5px]">
                Discount (%)
              </Label>
              <div className="w-full grid items-center gap-4">
                <input
                  id="discount"
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="Giảm giá sản phẩm"
                  className="col-span-3 p-2 border border-[#CFCFCF] placeholder-custom rounded"
                ></input>
              </div>

              <Label htmlFor="description" className="text-[14.5px] mt-2">
                Đánh giá sản phẩm
              </Label>
              <div className="w-full grid items-center gap-4">
                <select
                  id="rating"
                  value={rating}
                  onChange={(e) => {
                    setRating(e.target.value);
                  }}
                  className="col-span-3 p-2 border border-[#CFCFCF] rounded"
                >
                  <option value="">Chọn đánh giá</option>
                  <option value="0">0 ⭐️</option>
                  <option value="1">1 ⭐️</option>
                  <option value="2">2 ⭐️</option>
                  <option value="3">3 ⭐️</option>
                  <option value="4">4 ⭐️</option>
                  <option value="5">5 ⭐️</option>
                </select>
              </div>
              <div className="w-full mt-2">
                <ProductDescriptionEditor
                  value={description}
                  onChange={setDescription}
                  title="Mô tả sản phẩm"
                />
              </div>
              <div className="w-full mt-2">
                <ProductDescriptionEditor
                  value={introduction}
                  onChange={setIntroduction}
                  title="Giới thiệu sản phẩm"
                />
              </div>
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
              className="flex flex-row justify-center items-center gap-2 text-white bg-indigo-600 hover:opacity-80 font-medium rounded-md text-sm !px-10 !text-[16px] py-2.5 text-center"
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
