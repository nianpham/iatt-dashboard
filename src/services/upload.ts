import { CONSTANT } from "@/utils/constant";

const uploadToCloudinary = async (files: any) => {
    const results = [];
    try {
        for (const file of files) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CONSTANT.CLOUDINARY_UPLOAD_PRESET);
            formData.append('folder', CONSTANT.CLOUDINARY_FOLDER);
            const response = await fetch(
                CONSTANT.CLOUDINARY_API,
                {
                    method: 'POST',
                    body: formData,
                    redirect: 'follow',
                },
            );
            if (!response.ok) {
                throw new Error(`Failed to upload ${file.name}. Status: ${response.status}`);
            }
            const data = await response.json();
            results.push(data);
        }
        return results;
    } catch (error: any) {
        console.error('========= Error Uploading Files:', error);
        return false;
    }
};

export const UploadService = {
    uploadToCloudinary,
};
