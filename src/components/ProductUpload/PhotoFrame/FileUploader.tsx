"use client";

import React, { useState, useEffect } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload, message } from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload";

const FileUploader = ({
  quantity,
  uploadedImages,
  setUploadedImages,
}: {
  quantity: number | null;
  uploadedImages: UploadFile[];
  setUploadedImages: React.Dispatch<React.SetStateAction<UploadFile[]>>;
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isImageFile = (fileName: string) => {
    const imageExtensions = [
      ".jpg", ".jpeg", ".jfif", ".bmp", ".png", ".gif",
       ".svg", ".webp"
    ];
    return imageExtensions.some((ext) =>
      fileName.toLowerCase().endsWith(ext)
    );
  };

  const isPdfFile = (fileName: string) => fileName.toLowerCase().endsWith(".pdf");

  const getFileTypeLabel = (fileName: string) => {
    const lower = fileName.toLowerCase();
    if (lower.endsWith(".pdf")) return "PDF Document";
    if (lower.endsWith(".psd")) return "Photoshop Document";
    if (lower.endsWith(".ai") || lower.endsWith(".eps") || lower.endsWith(".ait")) return "Illustrator Document";
    if (lower.endsWith(".ppt") || lower.endsWith(".pptx")) return "PowerPoint Presentation";
    return "File Preview Unavailable";
  };

  useEffect(() => {
    if (quantity === null || quantity === 0) {
      setUploadedImages([]);
    } else if (uploadedImages.length > quantity) {
      setUploadedImages((prev) => prev.slice(0, quantity));
    }
  }, [quantity, setUploadedImages]);

  const props: UploadProps = {
    name: "document",
    multiple: true,
    accept:
      ".jpg,.jpeg,.jfif,.bmp,.png,.gif,.svg,.webp,.pdf,.psd,.ai,.eps,.ait,.ppt,.pptx,.tif,.tiff",
    showUploadList: false,
    beforeUpload: (file, newFileList) => {
      if (quantity === null || quantity === 0) {
        message.error("Please select a quantity first.");
        return false;
      }
      if (uploadedImages.length >= quantity) {
        message.error(`You can only upload up to  ${quantity}. To add more images, please increase the quantity.`);
        return false;
      }

      if (uploadedImages.length + newFileList.length > quantity) {
        message.error(`You can only upload up to ${quantity} files.`);
        return false;
      }

      const previewUrl = URL.createObjectURL(file);
      const newFile: UploadFile = {
        uid: file.uid || file.name + Date.now(),
        name: file.name,
        url: previewUrl,
        status: "done" as UploadFile["status"],
        originFileObj: file,
      };

      setUploadedImages((prev) => [...prev, newFile]);

      return false; // Prevent auto upload
    },
    fileList: uploadedImages,
    maxCount: quantity ?? undefined,
  };

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [uploadedImages]);

  const handleNext = () => {
    if (uploadedImages.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % uploadedImages.length);
    }
  };

  const handlePrevious = () => {
    if (uploadedImages.length > 1) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? uploadedImages.length - 1 : prevIndex - 1
      );
    }
  };

  return (
    <div className="flex flex-col bg-[#F7F7F7] w-full max-w-md md:max-w-xs lg:max-w-sm px-4 sm:px-8 items-center shadow h-auto py-6">
      <Upload {...props} disabled={quantity === null || quantity === 0}>
        <Button
          icon={<UploadOutlined />}
          className="flex mt-5 justify-center items-center bg-[#242424] w-full max-w-[180px] py-2 px-5 h-10 rounded-[30px] cursor-pointer gap-1.5 text-white text-base font-medium disabled:bg-gray-300"
          disabled={quantity === null || quantity === 0}
        >
          Upload Files
        </Button>
      </Upload>

      {uploadedImages.length > 0 && (
        <div className="mt-3 relative w-full flex justify-center items-center">
          {isImageFile(uploadedImages[currentImageIndex]?.name) ? (
            <img
              src={uploadedImages[currentImageIndex]?.url}
              alt={uploadedImages[currentImageIndex]?.name}
              className="w-full max-w-[320px] h-auto max-h-[400px] object-contain rounded-md"
              onError={(e) => (e.currentTarget.src = "https://placehold.co/200")}
            />
          ) : isPdfFile(uploadedImages[currentImageIndex]?.name) ? (
            <embed
              src={uploadedImages[currentImageIndex]?.url}
              type="application/pdf"
              className="w-full max-w-[320px] h-[400px] rounded-md"
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full max-w-[320px] h-[200px] bg-gray-100 rounded-md">
              <img
                src="/images/icon/file-icon.svg" // Replace with your icon
                alt="File Icon"
                className="w-12 h-12 mb-2"
              />
              <p className="text-sm text-gray-600">{getFileTypeLabel(uploadedImages[currentImageIndex]?.name)}</p>
            </div>
          )}

          {uploadedImages.length > 1 && (
            <>
              <div
                className="absolute top-1/2 left-2 -translate-y-1/2 cursor-pointer"
                onClick={handlePrevious}
              >
                <img src="/images/icon/vector-left.svg" alt="Previous" />
              </div>
              <div
                className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
                onClick={handleNext}
              >
                <img src="/images/icon/vector-right.svg" alt="Next" />
              </div>
            </>
          )}
        </div>
      )}

      {uploadedImages.length > 0 && (
        <div
          className="w-[75px] h-10 bg-[#fff] rounded-[30px] mt-3 px-5 py-2 text-sm font-medium leading-6 text-[#242424] tracking-[-0.2px] flex justify-center items-center text-center"
          style={{ boxShadow: "0px 4px 16px 0px rgba(91, 91, 91, 0.10)" }}
        >
          {currentImageIndex + 1} / {uploadedImages.length}
        </div>
      )}
    <div className="mt-4 text-center text-xs text-gray-500 max-w-xs">
      Supported file formats: JPG, JPEG, PNG, GIF, HEIC, SVG, WEBP, PDF, PSD, AI, EPS.
    </div>
    </div>
  );
};

export default FileUploader;
