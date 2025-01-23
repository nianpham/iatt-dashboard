"use client"

import React from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { Label } from '@/components/ui/label';

const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
    loading: () => <p>Loading Editor...</p>,
});

const BlogDescriptionEditor = ({
    value,
    onChange
}: {
    value: string;
    onChange: (value: string) => void;
}) => {
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }]
        ],
    };
    return (
        <div className="w-full space-y-2">
            <Label htmlFor="description">Mô tả bài viết</Label>
            <div className="min-h-[280px]">
                <ReactQuill
                    id="description"
                    theme="snow"
                    value={value}
                    onChange={onChange}
                    modules={modules}
                    className="h-[240px]"
                    placeholder="Nhập mô tả bài viết..."
                />
            </div>
        </div>
    );
};

export default BlogDescriptionEditor;