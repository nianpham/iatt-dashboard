"use client"

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
import { Loader, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function ModalUpdateBlog({ data }: { data: any }) {

    const { toast } = useToast()

    const mainImageInputRef = useRef<HTMLInputElement>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isLoadingForDelete, setIsLoadingForDelete] = useState<boolean>(false)

    const [mainPreview, setMainPreview] = useState<string | null>(null);

    const [title, setTitle] = useState<string>('')
    const [content, setContent] = useState<string>('')
    const [tag, setTag] = useState<string>('')
    const [author, setAuthor] = useState<string>('')

    const handleMainImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            alert('File quá lớn. Vui lòng chọn file nhỏ hơn 5MB');
            return;
        }
        if (!file.type.startsWith('image/')) {
            alert('Vui lòng chọn file hình ảnh');
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
            title === '' ||
            content === '' ||
            tag === '' ||
            author === ''
        ) {
            toast({
                variant: "destructive",
                title: "Vui lòng điền đầy đủ thông tin",
            })
            return false;
        } else {
            return true
        }
    }

    const handleSubmit = async () => {
        if (!validateForm()) return;
        setIsLoading(true)
        const uploadMainImage: any = await UploadService.uploadToCloudinary([mainPreview])
        const body = {
            "title": title,
            "content": content,
            "tag": tag,
            "author": author,
            "date": "04/01/2025",
            "thumbnail": uploadMainImage[0]?.url || '',
        }
        await BlogService.updateBlog(data?._id, body)
        setIsLoading(false)
        window.location.href = '/?tab=blog'
    }

    const handleDelete = async () => {
        setIsLoadingForDelete(true)
        await BlogService.deleteBlog(data?._id)
        setIsLoadingForDelete(false)
        window.location.href = '/?tab=blog'
    }

    const updateDOM = () => {
        if (data) {
            setTitle(data?.title)
            setAuthor(data?.author)
            setContent(data?.content)
            setTag(data?.tag)
            setMainPreview(data?.thumbnail)
        }
    }

    useEffect(() => { }, [data])

    return (
        <Dialog>
            <DialogTrigger asChild onClick={updateDOM}>
                <Button variant="outline">Chỉnh sửa</Button>
            </DialogTrigger>
            <DialogContent
                className="sm:max-w-[825px]"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>
                        <span className="!text-[20px]">Chỉnh sửa bài viết</span>
                    </DialogTitle>
                    <DialogDescription>
                        <span className="!text-[16px]">Chỉnh sửa thông tin bài viết và nhấn <strong className="text-orange-700">Cập nhật</strong> để lưu thông tin.</span>
                    </DialogDescription>
                </DialogHeader>
                <div className="w-full grid grid-cols-3 gap-8">
                    <div className="col-span-1">
                        <div className="mb-6">
                            <Label htmlFor="thumbnail" className="text-right !text-[16px]">
                                Hình chính
                            </Label>
                            {
                                mainPreview
                                    ?
                                    <Image
                                        src={mainPreview}
                                        alt="main-preview"
                                        className="w-full rounded-md mt-2"
                                        width={200}
                                        height={0}
                                    />
                                    :
                                    <div className="col-span-3 mt-2">
                                        <div
                                            onClick={handleUpdateMainImage}
                                            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-white px-5 py-16 text-sm font-medium text-gray-900 hover:bg-gray-50 hover:text-primary-700 cursor-pointer"
                                        >
                                            <div className="flex flex-col items-center">
                                                <span>+ Tải hình lên</span>
                                                <span className="text-xs text-gray-500">hoặc kéo thả file vào đây</span>
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
                            }
                        </div>
                    </div>
                    <div className="flex flex-col justify-start items-start gap-4 col-span-2">
                        <div className="w-full grid items-center gap-4">
                            <textarea
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Tiêu đề bài viết"
                                className="col-span-3 p-2 border rounded"
                            >
                            </textarea>
                        </div>
                        <div className="w-full grid items-center gap-4">
                            <select
                                id="tag"
                                value={tag}
                                onChange={(e) => setTag(e.target.value)}
                                className="col-span-3 p-2 border rounded"
                            >
                                <option value="">Chọn tag</option>
                                <option value="guide">Hướng Dẫn</option>
                                <option value="share">Chia Sẽ</option>
                            </select>
                        </div>
                        <div className="w-full grid items-center gap-4">
                            <textarea
                                id="content"
                                rows={10}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Nội dung bài viết"
                                className="col-span-3 p-2 border rounded"
                            >
                            </textarea>
                        </div>
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
                    <Button onClick={handleDelete} type="submit" className="!px-8 !text-[16px] bg-orange-700 hover:bg-orange-800">
                        <Trash2 />
                        Xoá
                        {
                            isLoadingForDelete && (
                                <Loader className="animate-spin" size={48} />
                            )
                        }
                    </Button>
                    <div className="flex gap-2">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" className="!px-10 !text-[16px]">
                                Huỷ
                            </Button>
                        </DialogClose>
                        <Button type="submit" onClick={handleSubmit} className="!px-10 !text-[16px]">
                            Cập nhật
                            {
                                isLoading && (
                                    <Loader className="animate-spin" size={48} />
                                )
                            }
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
