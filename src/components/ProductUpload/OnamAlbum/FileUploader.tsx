"use client";

import React, { useState, useEffect } from "react";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps, UploadFile } from "antd";
import { Button, message, Upload } from "antd";

const defaultImages = [
"/images/product/onam-car5.gif",
"/images/product/onam-car2.jpg",
"/images/product/onam-car3.jpg",
"/images/product/onam-car4.jpg"
];

interface FileUploaderProps {
    pageCountSelected: boolean;

  onUploadSuccess: (documentId: number, file?: File, name?: string) => void;
  quantity?: number;
  uploadedImages?: UploadFile[];
  setUploadedImages?: React.Dispatch<React.SetStateAction<UploadFile[]>>;
  setQuantity?: (q: number) => void;
  currentImageIndex?: number;
  handleNext?: () => void;
  handlePrevious?: () => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  pageCountSelected,
  onUploadSuccess,
  quantity,
  uploadedImages,
  setUploadedImages,
  setQuantity,
  currentImageIndex,
  handleNext,
  handlePrevious,
}) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"pdf" | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [defaultIndex, setDefaultIndex] = useState(0); // 👈 added

  
  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-slide default carousel
  useEffect(() => {
    if (!uploadedImages || uploadedImages.length === 0) {
      const interval = setInterval(() => {
        setDefaultIndex((prev) => (prev + 1) % defaultImages.length);
      }, 3000); // every 3 sec
      return () => clearInterval(interval);
    }
  }, [uploadedImages]);

  // Update file type when current image changes
  useEffect(() => {
    if (uploadedImages && uploadedImages.length > 0 && currentImageIndex !== undefined) {
      const currentFile = uploadedImages[currentImageIndex];
      if (currentFile?.originFileObj) {
        if (currentFile.originFileObj.type === "application/pdf") {
          setFileType("pdf");
        } else {
          setFileType(null);
        }
      }
    }
  }, [uploadedImages, currentImageIndex]);

  const props: UploadProps = {
    name: "document",
    multiple: true,
    accept: ".jpg,.jpeg,.png,.pdf,.psd",
    showUploadList: false,
    beforeUpload: (file) => {
      const allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf", ".psd"];
      const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
      if (!allowedExtensions.includes(fileExt)) {
        message.error("Unsupported file type. Please upload a supported format.");
        return false;
      }
      if (file.type === "application/pdf") setFileType("pdf");
      else setFileType(null);
      return true;
    },
    onChange: (info) => {
      const updatedFileList = info.fileList.map((file) => {
        if (file.originFileObj && !file.url) {
          file.url = URL.createObjectURL(file.originFileObj);
          if (file.originFileObj.type === "application/pdf") setFileType("pdf");
          else setFileType(null);
        }
        return file;
      });

      const currentFile = updatedFileList[currentImageIndex || 0]?.originFileObj;
      if (currentFile) {
        const ext = currentFile.name.split(".").pop()?.toLowerCase();
        setFileType(ext === "pdf" ? "pdf" : null);
      }

      if (setUploadedImages) setUploadedImages(updatedFileList);
    },
    fileList: uploadedImages || [],
  };

  return (
    <div className="flex flex-col bg-[#F7F7F7] h-[571px] w-full md:w-[486px] px-4 md:px-[67px] items-center shadow">
      {/* Upload Button */}
{pageCountSelected && (
  <Upload {...props}>
    <Button
      icon={<UploadOutlined />}
      className="flex justify-center mt-5 items-center bg-[#242424] w-[164px] py-2 px-5 h-10 rounded-[30px] cursor-pointer gap-1.5 text-white text-base font-medium"
    >
      Upload Files
    </Button>
  </Upload>
)}

    </div>
  );
};

export default FileUploader;
