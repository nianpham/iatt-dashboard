"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { Label } from "@/components/ui/label";

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
