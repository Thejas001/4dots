"use client";

import React, { useState, useEffect } from "react";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps, UploadFile } from "antd";
import { Button, message, Upload } from "antd";

interface FileUploaderProps {
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
  onUploadSuccess,
  quantity,
  uploadedImages,
  setUploadedImages,
  setQuantity,
  currentImageIndex,
  handleNext,
  handlePrevious
}) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"pdf" | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const props: UploadProps = {
    name: "document",
    multiple: true,
    accept: ".jpg,.jpeg,.png,.pdf,.psd",
    showUploadList: false,
    beforeUpload: (file) => {
      const allowedExtensions = [
        ".jpg", ".jpeg", ".png", ".pdf", ".psd"
      ];
      const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!allowedExtensions.includes(fileExt)) {
        message.error("Unsupported file type. Please upload a supported format.");
        return false;
      }
      return true;
    },
    onChange: (info) => {
      // Create preview URLs for uploaded files
      const updatedFileList = info.fileList.map(file => {
        if (file.originFileObj && !file.url) {
          // Create preview URL for local files
          file.url = URL.createObjectURL(file.originFileObj);
        }
        return file;
      });

        const currentFile = updatedFileList[currentImageIndex || 0]?.originFileObj;
      if (currentFile) {
        const ext = currentFile.name.split('.').pop()?.toLowerCase();
        if (ext === "pdf") {
          setFileType("pdf");
        } else {
          setFileType(null); // Treat others as image
        }
      }
      
      // Update the uploadedImages state when files are added/removed
      if (setUploadedImages) {
        setUploadedImages(updatedFileList);
      }
    },
    fileList: uploadedImages || [],
  };

  return (
    <div className="flex flex-col bg-[#F7F7F7] h-[571px] w-full md:w-[486px] px-4 md:px-[67px] items-center shadow">
      {/* Upload Button */}
      <Upload {...props}>
        <Button
          icon={<UploadOutlined />}
          className="flex justify-center mt-5 items-center bg-[#242424] w-[164px] py-2 px-5 h-10 rounded-[30px] cursor-pointer gap-1.5 text-white text-base font-medium"
        >
          Upload Files
        </Button>
      </Upload>

      {/* Display Area with Navigation Arrows */}
      <div className="mt-[11px] relative w-[300px] h-[400px] flex items-center justify-center">
        {uploadedImages && uploadedImages.length > 0 ? (
          fileType === "pdf" ? (
            isMobile ? (
              <div className="flex flex-col items-center justify-center p-4 text-center">
                <p className="text-sm text-gray-700 mb-2">PDF preview is not supported on mobile.</p>
                <a
                  href={uploadedImages[currentImageIndex || 0]?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  Open PDF in new tab
                </a>
              </div>
            ) : (
              <iframe
                src={`${uploadedImages[currentImageIndex || 0]?.url}#toolbar=0`}
                width="100%"
                height="100%"
                className="rounded-md border"
                title="PDF Preview"
              />
            )
          ) : (
            <img 
              src={uploadedImages[currentImageIndex || 0]?.url} 
              alt="Uploaded File" 
              className="w-full h-full object-contain rounded-md" 
            />
          )
        ) : (
          <img src="/images/product/Rectangle970.svg" alt="Placeholder" className="w-full h-full object-cover rounded-md" />
        )}

        {/* Navigation Arrows */}
        {uploadedImages && uploadedImages.length > 1 && handleNext && handlePrevious && (
          <>
            {/* Left Arrow */}
            <div
              className="absolute top-1/2 -left-6 -translate-y-1/2 cursor-pointer bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200"
              onClick={handlePrevious}
            >
              <img src="/images/icon/vector-left.svg" alt="Previous" className="w-4 h-4" />
            </div>
            
            {/* Right Arrow */}
            <div
              className="absolute top-1/2 -right-6 -translate-y-1/2 cursor-pointer bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200"
              onClick={handleNext}
            >
              <img src="/images/icon/vector-right.svg" alt="Next" className="w-4 h-4" />
            </div>
          </>
        )}
      </div>

      {/* File Counter */}
      {uploadedImages && uploadedImages.length > 0 && (
        <div
          className="w-[75px] h-10 bg-[#fff] rounded-[30px] mt-3 px-5 py-2 text-sm font-medium leading-6 text-[#242424] tracking-[-0.2px] flex justify-center items-center text-center"
          style={{ boxShadow: "0px 4px 16px 0px rgba(91, 91, 91, 0.10)" }}
        >
          {(currentImageIndex || 0) + 1} / {uploadedImages.length}
        </div>
      )}

      <div className="mt-4 text-center text-xs text-gray-500 max-w-xs">
        Supported file formats: JPG, JPEG, PNG, PSD, PDF.
      </div>
    </div>
  );
};

export default FileUploader;
