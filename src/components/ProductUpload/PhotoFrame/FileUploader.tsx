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

  useEffect(() => {
    if (quantity === null || quantity === 0) {
      setUploadedImages([]);
    } else if (uploadedImages.length > quantity) {
      setUploadedImages((prev) => prev.slice(0, quantity));
    }
  }, [quantity, setUploadedImages]);

  const props: UploadProps = {
    name: "file",
    multiple: true,
    accept: "image/png, image/jpeg, image/jpg",
    showUploadList: false,
    beforeUpload: (file, newFileList) => {
      if (quantity === null || quantity === 0) {
        message.error("Please select a quantity first.");
        return false;
      }

      if (uploadedImages.length + newFileList.length > quantity) {
        message.error(`You can only upload up to ${quantity} images.`);
        return false;
      }

      const previewUrl = URL.createObjectURL(file);
      const newFile: UploadFile = {
        uid: file.uid || file.name + Date.now(),
        name: file.name,
        url: previewUrl,
        status: "done" as UploadFile["status"],
      };

      setUploadedImages((prev) => [...prev, newFile]);

      return false;
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
    <div className="flex flex-col bg-[#F7F7F7] h-[571px] w-full md:w-[486px] px-4 md:px-[67px] items-center shadow">
      <Upload {...props} disabled={quantity === null || quantity === 0}>
        <Button
          icon={<UploadOutlined />}
          className="flex mt-5 justify-center items-center bg-[#242424] w-[164px] py-2 px-5 h-10 rounded-[30px] cursor-pointer gap-1.5 text-white text-base font-medium disabled:bg-gray-300"
          disabled={quantity === null || quantity === 0}
        >
          Upload Images
        </Button>
      </Upload>

      {uploadedImages.length > 0 && (
        <div className="mt-[11px] relative">
          <img
            src={uploadedImages[currentImageIndex]?.url}
            alt={uploadedImages[currentImageIndex]?.name}
            className="w-[350px] h-[445px] object-contain rounded-md"
            onError={(e) => (e.currentTarget.src = "https://placehold.co/200")}
          />
          <div className="absolute top-1/2 -left-7 cursor-pointer" onClick={handlePrevious}>
            <img src="/images/icon/vector-left.svg" alt="Previous" />
          </div>
          <div className="absolute top-1/2 -right-7 cursor-pointer" onClick={handleNext}>
            <img src="/images/icon/vector-right.svg" alt="Next" />
          </div>
        </div>
      )}

      {uploadedImages.length > 0 && (
        <div
          className="w-[75px] h-10 bg-[#fff] rounded-[30px] mt-[11px] px-5 py-2 text-sm font-medium leading-6 text-[#242424] tracking-[-0.2px] 
          flex justify-center items-center text-center"
          style={{ boxShadow: "0px 4px 16px 0px rgba(91, 91, 91, 0.10)" }}
        >
          {currentImageIndex + 1} / {uploadedImages.length}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
