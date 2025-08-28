
"use client";

import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps, UploadFile } from "antd";
import { Button, message, Upload } from "antd";
import axios from "axios";

interface FileUploaderProps {
  pageCountSelected: boolean;
  uploadedImages?: UploadFile[];
  setUploadedImages?: React.Dispatch<React.SetStateAction<UploadFile[]>>;
  onUploadSuccess?: (documentId: string, file: File) => void; // 🔹 add callback
}

const NewFileUploader: React.FC<FileUploaderProps> = ({
  pageCountSelected,
  uploadedImages,
  setUploadedImages,
  onUploadSuccess,
}) => {
  const props: UploadProps = {
    name: "document",
    multiple: true,
    accept: ".jpg,.jpeg,.png,.pdf,.psd",
    showUploadList: false,
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        const formData = new FormData();
        formData.append("document", file as File);

        // 🔹 call your API here
        const response = await axios.post(
          "https://fourdotsapi.azurewebsites.net/api/document/upload",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        const documentId = response.data?.documentId;
        if (documentId) {
          // notify parent
          onUploadSuccess?.(documentId, file as File);

          message.success(`${(file as File).name} uploaded successfully`);
        }

        onSuccess?.(response.data, file as any);
      } catch (err) {
        message.error(`${(file as File).name} upload failed`);
        onError?.(err as Error);
      }
    },
    beforeUpload: (file) => {
      const allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf", ".psd"];
      const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
      if (!allowedExtensions.includes(fileExt)) {
        message.error("Unsupported file type. Please upload a supported format.");
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    onChange: (info) => {
      if (setUploadedImages) {
        setUploadedImages(info.fileList);
      }
    },
    fileList: uploadedImages || [],
  };

  if (!pageCountSelected) return null;

  return (
    <div className="bg-white">
      <Upload {...props}>
        <Button
          icon={<UploadOutlined />}
          className="flex justify-center mt-5 items-center bg-white w-[164px] py-2 px-5 h-10 rounded-[30px] cursor-pointer gap-1.5 text-gray-900 text-base font-medium"
        >
          Upload Files
        </Button>
      </Upload>
    </div>
  );
};

export default NewFileUploader;
