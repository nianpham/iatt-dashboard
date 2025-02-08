"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { Label } from "@/components/ui/label";
import { UploadService } from "@/services/upload";
import { Quill } from "react-quill";

type QuillInstance = typeof Quill;

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading Editor...</p>,
}) as unknown as React.ComponentType<any> | null;

const ProductDescriptionEditor = ({
  value,
  onChange,
  title,
}: {
  value: string;
  onChange: (value: string) => void;
  title: string;
}) => {
  const quillRef = useRef<any>(null);

  // const handleImageUpload = useCallback(async (file: File) => {
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   try {
  //     const uploadResponse = await UploadService.uploadToCloudinary([file]);
  //     if (
  //       uploadResponse &&
  //       Array.isArray(uploadResponse) &&
  //       uploadResponse[0]
  //     ) {
  //       return uploadResponse[0]?.secure_url;
  //     } else {
  //       console.error("Upload failed or response is not as expected");
  //       return "";
  //     }
  //   } catch (error) {
  //     console.error("Image upload failed:", error);
  //     return "";
  //   }
  // }, []);

  // const extractBase64Images = (htmlContent: string) => {
  //   const imgTagRegex = /<img[^>]+src=["'](data:image\/[^;]+;base64[^"']+)["'][^>]*>/g;
  //   const matches = [...htmlContent.matchAll(imgTagRegex)];
  //   return matches.map(match => match[1]);
  // };

  // const replaceBase64WithCloudUrls = async (htmlContent: string, uploadFunc: (file: File) => Promise<string>) => {
  //   const imgTagRegex = /<img[^>]+src=["'](data:image\/[^;]+;base64[^"']+)["'][^>]*>/g;
  //   let updatedContent = htmlContent;

  //   const matches = [...htmlContent.matchAll(imgTagRegex)];
  //   for (const match of matches) {
  //     const base64String = match[1];
  //     const file = base64ToFile(base64String);
  //     const uploadedUrl = await uploadFunc(file);
  //     updatedContent = updatedContent.replace(base64String, uploadedUrl);
  //   }

  //   return updatedContent;
  // };

  // const base64ToFile = (base64String: string): File => {
  //   const arr = base64String.split(",");
  //   const mime = arr[0].match(/:(.*?);/)[1];
  //   const bstr = atob(arr[1]);
  //   let n = bstr.length;
  //   const u8arr = new Uint8Array(n);
  //   while (n--) {
  //     u8arr[n] = bstr.charCodeAt(n);
  //   }
  //   return new File([u8arr], "image.png", { type: mime });
  // };

  // const handleImageInsert = useCallback(
  //   async (imageBase64: string) => {
  //     try {
  //       const blob = await fetch(imageBase64).then((res) => res.blob());
  //       const file = new File([blob], "image.png", { type: blob.type });
  //       const imageUrl = await handleImageUpload(file);

  //       if (imageUrl && quillRef.current) {
  //         const quill = quillRef.current.getEditor();
  //         const range = quill.getSelection();
  //         if (range) {
  //           quill.insertEmbed(range.index, "image", imageUrl);
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error processing image upload:", error);
  //     }
  //   },
  //   [handleImageUpload]
  // );

  // useEffect(() => {
  //   console.log("check ref: " + quillRef.current);

  //   if (quillRef.current) {
  //     const quill = quillRef.current.getEditor();
  //     console.log("check ractquill:", quill);

  //     quill.getModule("toolbar").addHandler("image", () => {
  //       const input = document.createElement("input");
  //       input.setAttribute("type", "file");
  //       input.setAttribute("accept", "image/*");
  //       input.click();

  //       input.onchange = async () => {
  //         if (input.files && input.files[0]) {
  //           const file = input.files[0];
  //           const reader = new FileReader();
  //           reader.readAsDataURL(file);
  //           reader.onload = async () => {
  //             if (typeof reader.result === "string") {
  //               await handleImageInsert(reader.result);
  //             }
  //           };
  //         }
  //       };
  //     });
  //   }
  // }, [handleImageInsert]);

  return (
    <div className="w-full space-y-2">
      <Label htmlFor="description">{title}</Label>
      <div className="h-[500px]">
        {ReactQuill && (
          <ReactQuill
            ref={quillRef}
            id="description"
            theme="snow"
            value={value}
            onChange={onChange}
            modules={{
              toolbar: {
                container: [
                  [{ size: [] }],
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image"],
                  ["clean"],
                ],
              },
              clipboard: {
                matchVisual: false,
              },
            }}
            formats={[
              "header",
              "font",
              "size",
              "bold",
              "italic",
              "underline",
              "strike",
              "blockquote",
              "list",
              "bullet",
              "indent",
              "link",
              "image",
            ]}
            className="h-[455px]"
            placeholder="Nhập nội dung ..."
          />
        )}
      </div>
    </div>
  );
};

export default ProductDescriptionEditor;
