
"use client";

import React, { useState, useEffect } from "react";
import type { UploadFile } from "antd/es/upload";
import { CloseCircleOutlined, LeftOutlined, RightOutlined, PlusOutlined } from "@ant-design/icons";
import { Upload, message } from "antd";

interface ImageSectionProps {
  uploadedImages: UploadFile[];
  setUploadedImages: React.Dispatch<React.SetStateAction<UploadFile[]>>;
  selectedSize: string; // e.g., "8-16"
  setSelectedSize: (size: string) => void;
  maxAllowed: number; // Enforce the max limit from parent
  showUploadButton: boolean; // Control button visibility (though currently not used)
}

const ImageSection: React.FC<ImageSectionProps> = ({
  uploadedImages,
  setUploadedImages,
  selectedSize,
  setSelectedSize,
  maxAllowed,
  showUploadButton,
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1280; // xl breakpoint
  const maxVisible = isMobile ? 3 : 5; // 3 images in mobile, 5 in desktop

  // Parse selectedSize range
  const [minSize, maxSize] = selectedSize.split("-").map((v) => Number(v));

  // Handle removing an image
  const handleRemove = (indexToRemove: number) => {
    setUploadedImages((prev) => {
      const updatedImages = prev.filter((_, i) => i !== indexToRemove);
      return updatedImages;
    });
  };

  // Ensure startIndex is within bounds
  useEffect(() => {
    setStartIndex((prevIndex) =>
      Math.max(0, Math.min(prevIndex, uploadedImages.length - maxVisible))
    );
  }, [uploadedImages.length, maxVisible]);

  const handleNext = () => {
    if (startIndex + maxVisible < uploadedImages.length) {
      setStartIndex((prev) => prev + maxVisible);
    }
  };

  const handlePrevious = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - maxVisible);
    }
  };

  // Upload configuration
  const uploadProps = {
    accept: ".jpg,.jpeg,.png,.pdf,.psd",
    multiple: true,
    showUploadList: false,
    beforeUpload: (file: File) => {
      const allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf", ".psd"];
      const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

      if (!allowedExtensions.includes(fileExt)) {
        message.error("Unsupported file type.");
        return Upload.LIST_IGNORE;
      }

      if (uploadedImages.length >= maxAllowed) {
        message.warning(`You can upload a maximum of ${maxAllowed} files.`);
        return Upload.LIST_IGNORE;
      }

      return true;
    },
    onChange: (info: any) => {
      let updated = info.fileList.map((file: UploadFile) => {
        if (!file.url && file.originFileObj) {
          file.url = URL.createObjectURL(file.originFileObj);
        }
        return file;
      });

      if (updated.length > maxAllowed) {
        updated = updated.slice(0, maxAllowed);
        message.warning(`Only ${maxAllowed} files are allowed.`);
      }

      setUploadedImages(updated);
    },
    fileList: uploadedImages,
    disabled: uploadedImages.length >= maxAllowed,
  };

  // Debug log to check rendering
  console.log("Rendering ImageSection, uploadedImages length:", uploadedImages.length, "selectedSize:", selectedSize, "maxAllowed:", maxAllowed);

  return (
    <div className="relative w-full">
      {/* Mobile View - Images with Navigation Arrows and Upload Button Below */}
      <div className="xl:hidden">
        <div className="flex flex-col items-center gap-3 p-2">
          {/* Image Container with Navigation Arrows */}
          <div className="flex items-center justify-center w-full">
            {/* Left Arrow */}
            {uploadedImages.length > maxVisible && (
              <button
                className={`p-1 bg-white shadow-sm rounded-full mr-1.5 ${
                  startIndex === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
                onClick={handlePrevious}
                disabled={startIndex === 0}
              >
                <LeftOutlined className="text-xs" />
              </button>
            )}

            {/* Images */}
            <div className="flex justify-center gap-2">
              {uploadedImages
                .slice(startIndex, startIndex + maxVisible)
                .map((file, index) => (
                  <div key={file.uid || file.name || index} className="relative">
                    {file.url && file.name && file.name.toLowerCase().endsWith(".pdf") ? (
                      <img
                        src="/images/product/pdf.png"
                        alt="PDF"
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    ) : file.url ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded-md text-xs text-gray-500">
                        No Image
                      </div>
                    )}
                    <CloseCircleOutlined
                      className="absolute top-0 right-0 text-red-500 cursor-pointer text-base"
                      onClick={() => handleRemove(startIndex + index)}
                    />
                  </div>
                ))}
            </div>

            {/* Right Arrow */}
            {uploadedImages.length > maxVisible && (
              <button
                className={`p-1 bg-white shadow-sm rounded-full ml-1.5 ${
                  startIndex + maxVisible >= uploadedImages.length
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onClick={handleNext}
                disabled={startIndex + maxVisible >= uploadedImages.length}
              >
                <RightOutlined className="text-xs" />
              </button>
            )}
          </div>

          {/* Upload Button */}
          <Upload {...uploadProps}>
            <div
              className={`w-20 h-20 border border-dashed rounded-md flex flex-col items-center justify-center transition
                ${uploadedImages.length >= maxAllowed
                  ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                  : "border-gray-400 bg-white text-gray-500 cursor-pointer hover:border-blue-500 hover:bg-blue-50"
                }`}
              onClick={(e) => {
                if (uploadedImages.length >= maxAllowed) {
                  e.preventDefault();
                  e.stopPropagation();
                  message.warning(`Maximum of ${maxAllowed} files reached.`);
                }
              }}
            >
              <PlusOutlined className="text-xl" />
              <span className="text-xs">
                {uploadedImages.length >= maxAllowed ? "Limit Reached" : "Upload"}
              </span>
            </div>
          </Upload>
        </div>
      </div>

      {/* Desktop View - Flex with Navigation Arrows */}
      <div className="hidden xl:flex xl:items-center xl:w-full">
        {/* Left Arrow */}
        {uploadedImages.length > maxVisible && (
          <button
            className={`p-2 bg-white shadow-md rounded-full mr-2 ${
              startIndex === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={handlePrevious}
            disabled={startIndex === 0}
          >
            <LeftOutlined />
          </button>
        )}

        {/* Image Container */}
        <div className="flex gap-3 p-2 items-start flex-1">
          {uploadedImages
            .slice(startIndex, startIndex + maxVisible)
            .map((file, index) => (
              <div key={file.uid || file.name || index} className="relative">
                {file.url && file.name && file.name.toLowerCase().endsWith(".pdf") ? (
                  <img
                    src="/images/product/pdf.png"
                    alt="PDF"
                    className="w-24 h-24 object-cover rounded-md"
                  />
                ) : file.url ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded-md text-sm text-gray-500">
                    No Image
                  </div>
                )}
                <CloseCircleOutlined
                  className="absolute top-0 right-0 text-red-500 cursor-pointer text-lg"
                  onClick={() => handleRemove(startIndex + index)}
                />
              </div>
            ))}
          {/* Upload Button */}
          <Upload {...uploadProps}>
            <div
              className={`w-24 h-24 border border-dashed rounded-md flex flex-col items-center justify-center transition
                ${uploadedImages.length >= maxAllowed
                  ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                  : "border-gray-400 bg-white text-gray-500 cursor-pointer hover:border-blue-500 hover:bg-blue-50"
                }`}
              onClick={(e) => {
                if (uploadedImages.length >= maxAllowed) {
                  e.preventDefault();
                  e.stopPropagation();
                  message.warning(`Maximum of ${maxAllowed} files reached.`);
                }
              }}
            >
              <PlusOutlined className="text-2xl" />
              <span className="text-sm">
                {uploadedImages.length >= maxAllowed ? "Limit Reached" : "Upload"}
              </span>
            </div>
          </Upload>
        </div>

        {/* Right Arrow */}
        {uploadedImages.length > maxVisible && (
          <button
            className={`p-2 bg-white shadow-md rounded-full ml-2 ${
              startIndex + maxVisible >= uploadedImages.length
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            onClick={handleNext}
            disabled={startIndex + maxVisible >= uploadedImages.length}
          >
            <RightOutlined />
          </button>
        )}
      </div>

      {/* No Images Message */}
      {uploadedImages.length === 0 && (
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            No images uploaded yet. Upload {selectedSize} images.
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageSection;
