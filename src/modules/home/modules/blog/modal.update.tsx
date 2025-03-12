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
import { BlogService } from "@/services/blog";
import { UploadService } from "@/services/upload";
import { ImageUp, Loader, SquarePen, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import BlogDescriptionEditor from "./quill";

export function ModalUpdateBlog({ data }: { data: any }) {
  const tagOpt = [
    { value: "frame", label: "Khung ảnh" },
    { value: "printing", label: "In ấn" },
    { value: "album", label: "Album" },
    { value: "photo-care", label: "Chia Sẽ" },
    { value: "digital-frame", label: "Khung digital" },
  ];

  const { toast } = useToast();

  const mainImageInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingForDelete, setIsLoadingForDelete] = useState<boolean>(false);

  const [mainPreview, setMainPreview] = useState<string | null>(null);

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [author, setAuthor] = useState<string>("");

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

  const handleUpdateMainImage = () => {
    mainImageInputRef.current?.click();
  };

  const validateForm = () => {
    if (
      !mainPreview ||
      title === "" ||
      content === "" ||
      tag === "" ||
      author === ""
    ) {
      toast({
        variant: "destructive",
        title: "Vui lòng điền đầy đủ thông tin",
      });
      return false;
    } else {
      return true;
    }
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

    const updatedContent = await replaceBase64WithCloudUrls(
      content,
      handleImageUpload
    );

    const uploadMainImage: any = await UploadService.uploadToCloudinary([
      mainPreview,
    ]);
    const body = {
      title: title,
      content: updatedContent,
      tag: tag,
      author: author,
      thumbnail: uploadMainImage[0]?.url || "",
    };
    await BlogService.updateBlog(data?._id, body);
    setIsLoading(false);
    window.location.href = "/?tab=blog";
  };

  const handleDelete = async () => {
    setIsLoadingForDelete(true);
    await BlogService.deleteBlog(data?._id);
    setIsLoadingForDelete(false);
    window.location.href = "/?tab=blog";
  };

  const updateDOM = () => {
    if (data) {
      setTitle(data?.title);
      setAuthor(data?.author);
      setContent(data?.content);
      setTag(data?.tag);
      setMainPreview(data?.thumbnail);
    }
  };

  useEffect(() => {}, [data]);

  return (
    <Dialog>
      <DialogTrigger onClick={updateDOM}>
        <div className="flex">
          <div className="mx-2 p-2 cursor-pointer hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 rounded-full group">
            <SquarePen
              size={23}
              className="text-gray-900 group-hover:text-white"
            />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[1200px]"
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
        <div className="w-full grid grid-cols-3 gap-8">
          <div className="col-span-1">
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
                        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl p-2 rounded-full">
                          <ImageUp
                            onClick={handleUpdateMainImage}
                            color="white"
                            size={30}
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
          </div>
          <div className="flex flex-col justify-start items-start gap-2 col-span-2">
            <Label htmlFor="description" className="text-[14.5px]">
              Tiêu đề bài viết
            </Label>
            <div className="w-full grid items-center gap-4">
              <textarea
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Tiêu đề bài viết"
                className="col-span-3 p-2 border rounded"
              ></textarea>
            </div>
            <Label htmlFor="description" className="text-[14.5px] mt-2">
              Chọn tag
            </Label>
            <div className="w-full grid items-center gap-4">
              <select
                id="tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="col-span-3 p-2 border rounded"
              >
                <option value="">Chọn tag</option>
                {tagOpt.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full mt-2">
              <BlogDescriptionEditor value={content} onChange={setContent} />
            </div>
            <Label htmlFor="description" className="text-[14.5px] mt-2">
              Chọn tác giả
            </Label>
            <div className="w-full grid items-center gap-4">
              <select
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="col-span-3 p-2 border rounded"
              >
                <option value="">Tác giả</option>
                <option value="Phạm Thành">Phạm Thành</option>
              </select>
            </div>
          </div>
        </div>
        <DialogFooter className="w-full !flex !flex-row !justify-between !items-center">
          <Button
            onClick={handleDelete}
            type="submit"
            className="!px-8 !text-[16px] text-red-600 bg-white border-2 border-red-600 hover:bg-red-100"
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
              className="flex flex-row justify-center items-center gap-2 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl font-medium rounded-md text-sm !px-10 !text-[16px] py-2.5 text-center"
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
