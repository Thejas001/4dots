"use client";

import React, { useState, useEffect } from "react";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Button, message, Upload } from "antd";

interface FileUploaderProps {
  onUploadSuccess: (documentId: number, file?: File, name?: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUploadSuccess }) => {
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
    accept: ".jpg,.jpeg,.bmp,.png,.gif,.heic,.svg,.webp,.pdf,.psd",
    action: "https://fourdotsapp.azurewebsites.net/api/document/upload",
    method: "POST",
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
      return true;
    },
    onChange(info) {
      if (info.file.status === "done") {
        const response = info.file.response;
  
        if (response?.Success) {
          const documentId = response.Data?.Id;  
          sessionStorage.setItem("uploadedDocumentId", documentId);
          onUploadSuccess(documentId, info.file.originFileObj, info.file.name); 
          message.success(`${info.file.name} uploaded successfully`);
        } else {
          message.error("Upload failed. Server did not return success.");
        }
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
          await fetch(`https://fourdotsapp.azurewebsites.net/api/document/delete/${docId}`, {
            method: "DELETE",
          });
  
          sessionStorage.removeItem("uploadedDocumentId");
        } catch (err) {
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
      <Upload {...props} showUploadList={false}>
        <Button
          icon={<UploadOutlined />}
          className="flex justify-center mt-5 items-center bg-[#242424] w-[164px] py-2 px-5 h-10 rounded-[30px] cursor-pointer gap-1.5 text-white text-base font-medium"
        >
          Upload File
        </Button>
      </Upload>

      {/* Display Area */}
      <div className="mt-[11px] relative w-[300px] h-[400px] flex items-center justify-center">
        {selectedFile ? (
          fileType === "pdf" ? (
            isMobile ? (
              <div className="flex flex-col items-center justify-center p-4 text-center">
                <p className="text-sm text-gray-700 mb-2">PDF preview is not supported on mobile.</p>
                <a
                  href={selectedFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  Open PDF in new tab
                </a>
              </div>
            ) : (
              <iframe
                src={`${selectedFile}#toolbar=0`}
                width="100%"
                height="100%"
                className="rounded-md border"
                title="PDF Preview"
              />
            )
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
