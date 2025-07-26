"use client";

import React, { useState, useEffect } from "react";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Button, message, Upload } from "antd";

interface FileUploaderProps {
  onUploadSuccess: (documentId: number) => void;
}


const FileUploader: React.FC<FileUploaderProps> = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"pdf" | null>(null);
  const props: UploadProps = {
    name: "document",  // Important: match backend's expected form field name
    action: "https://fourdotsapp.azurewebsites.net/api/document/upload",
    method: "POST",
    accept: ".jpg,.jpeg,.jfif,.bmp,.png,.gif,.heic,.svg,.webp,.pdf,.psd",
    headers: {
      authorization: "authorization-text",
    },
    beforeUpload: (file) => {
      const allowedExtensions = [
        ".jpg", ".jpeg", ".jfif", ".bmp", ".png", ".gif", ".heic", ".svg", ".webp", ".pdf", ".psd"
      ];
      const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!allowedExtensions.includes(fileExt)) {
        message.error("Unsupported file type. Please upload a supported format.");
        return false;
      }
      const fileURL = URL.createObjectURL(file);
      setSelectedFile(fileURL);
      setFileType(file.type === "application/pdf" ? "pdf" : null);
      return true; // Allow upload for all allowed types
    },
    onChange(info) {
      if (info.file.status === "done") {
        const response = info.file.response;
  
        if (response?.Success) {
          const documentId = response.Data?.Id;  
          sessionStorage.setItem("uploadedDocumentId", documentId);
          onUploadSuccess(documentId); 
          message.success(`${info.file.name} uploaded successfully`);
          console.log("📄 Document ID:", documentId);
        } else {
          message.error("Upload failed. Server did not return success.");        }
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} upload failed.`);
      }
    },
  };
  useEffect(() => {
    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      const docId = sessionStorage.getItem("uploadedDocumentId");
  
      if (docId) {
        try {
          // Call your delete document API here
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
    <div className="flex flex-col bg-[#F7F7F7] w-full max-w-md md:max-w-xs lg:max-w-sm px-4 sm:px-8 items-center shadow h-auto py-6">
      {/* Upload Button */}
      <Upload {...props} showUploadList={false}>
        <Button
          icon={<UploadOutlined />}
          className="flex justify-center mt-5 items-center bg-[#242424] w-full max-w-[180px] py-2 px-5 h-10 rounded-[30px] cursor-pointer gap-1.5 text-white text-base font-medium"
        >
          Upload File
        </Button>
      </Upload>

      {/* Display Area */}
      <div className="mt-3 relative w-full max-w-[280px] sm:max-w-[300px] h-[320px] sm:h-[400px] flex items-center justify-center ">
        {selectedFile ? (
          fileType === "pdf" ? (
            <iframe
              src={`${selectedFile}#toolbar=0`}
              width="100%"
              height="100%"
              className="rounded-md border"
              title="PDF Preview"
            />
          ) : (
            <img src={selectedFile} alt="Uploaded File" className="w-full h-full object-contain rounded-md" />
          )
        ) : (
          <img src="/images/product/Rectangle970.svg" alt="Placeholder" className="w-full h-full object-cover rounded-md" />
        )}
      </div>
      <div className="mt-4 text-center text-xs text-gray-500 max-w-xs">
        Supported file formats: JPG, JPEG, PNG, GIF, HEIC, SVG, WEBP, PDF, PSD, AI, EPS.
      </div>
    </div>
  );
};

export default FileUploader;
