"use client";

import React, { useState, useEffect } from "react";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Button, message, Upload } from "antd";

interface FileUploaderProps {
  onUploadSuccess: (documentId: number, file?: File, name?: string) => void;
  quantity?: number | null;
  uploadedImages?: any[];
  setUploadedImages?: React.Dispatch<React.SetStateAction<any[]>>;
  currentImageIndex?: number;
  handleNext?: () => void;
  handlePrevious?: () => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  onUploadSuccess,
  quantity,
  uploadedImages,
  setUploadedImages,
  currentImageIndex,
  handleNext,
  handlePrevious
}) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"pdf" | "image" | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
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
    action: "https://fourdotsapp.azurewebsites.net/api/document/upload?returnPageCount=true",
    method: "POST",
    accept: ".pdf,.jpg,.jpeg,.png,.gif,.svg,.webp,.psd",
    headers: {
      authorization: "authorization-text",
    },
    beforeUpload: (file) => {
      const fileURL = URL.createObjectURL(file);
      setSelectedFile(fileURL);
      setUploadedFile(file);
      setFileName(file.name);

      // Check file type
      if (file.type === "application/pdf") {
        setFileType("pdf");
      } else if (file.type.startsWith("image/")) {
        setFileType("image");
      } else {
        message.error("Unsupported file type. Please upload a PDF or image file.");
        return false;
      }

      return true;
    },
    onChange(info) {
      if (info.file.status === "done") {
        const response = info.file.response;

        if (response?.Success) {
          const documentId = response.Data?.Id;

          sessionStorage.setItem("uploadedDocumentId", documentId);
          onUploadSuccess(documentId, uploadedFile || undefined, fileName);

          // Update file list for navigation
          if (setUploadedImages && uploadedFile) {
            const newFile = {
              uid: info.file.uid,
              name: fileName,
              url: selectedFile,
              type: fileType,
              documentId: documentId
            };
            setUploadedImages(prev => [...prev, newFile]);
          }

          message.success(`${info.file.name} uploaded successfully`);
          console.log("📄 Document ID:", documentId);
        } else {
          message.error("Upload failed. Server did not return success.");
        }
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} upload failed.`);
      }
    },
  };

  useEffect(() => {
    const handleBeforeUnload = async () => {
      const docId = sessionStorage.getItem("uploadedDocumentId");

      if (docId) {
        try {
          await fetch(`https://fourdotsapp.azurewebsites.net/api/document/delete/${docId}`, {
            method: "DELETE",
          });

          sessionStorage.removeItem("uploadedDocumentId");
          console.log("🧹 Document removed on unload.");
        } catch (err) {
          console.error("❌ Failed to delete document on unload:", err);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div className="flex flex-col bg-[#F7F7F7] h-[571px] w-full md:w-[486px] px-4 md:px-[67px] items-center shadow">
      {/* Upload Button */}
      <Upload {...props} showUploadList={false} disabled={quantity === null || quantity === 0}>
        <Button
          icon={<UploadOutlined />}
          className="flex justify-center mt-5 items-center bg-[#242424] w-[164px] py-2 px-5 h-10 rounded-[30px] cursor-pointer gap-1.5 text-white text-base font-medium disabled:bg-gray-300"
          disabled={quantity === null || quantity === 0}
        >
          Upload File
        </Button>
      </Upload>

      {/* Display Area with Navigation Arrows */}
      <div className="mt-[11px] relative w-[300px] h-[400px] flex items-center justify-center border rounded-md bg-white">
        {uploadedImages && uploadedImages.length > 0 ? (
          uploadedImages[currentImageIndex || 0]?.type === "pdf" ? (
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
        ) : selectedFile ? (
          fileType === "pdf" ? (
            <iframe
              src={`${selectedFile}#toolbar=0`}
              width="100%"
              height="100%"
              className="rounded-md border"
              title="PDF Preview"
            />
          ) : (
            <img src={selectedFile} alt="Uploaded File" className="w-full h-full object-cover rounded-md" />
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
        Supported file formats: PDF, JPG, JPEG, PNG, GIF, SVG, WEBP, PSD.
      </div>
    </div>
  );
};

export default FileUploader;
