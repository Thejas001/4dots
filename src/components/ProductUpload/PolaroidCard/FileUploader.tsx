"use client";

import React, { useState ,useEffect } from "react";
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
    action: "https://localhost:7049/api/document/upload",
    method: "POST",
    accept: ".pdf",
    headers: {
      authorization: "authorization-text",
    },
    beforeUpload: (file) => {
      const fileURL = URL.createObjectURL(file);
      setSelectedFile(fileURL);
  
      if (file.type === "application/pdf") {
        setFileType("pdf");
        return true;
      } else {
        message.error("Unsupported file type. Please upload a PDF.");
        return false;
      }
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
          await fetch(`https://localhost:7049/api/document/delete/${docId}`, {
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
      <Upload {...props} showUploadList={false}>
        <Button
          icon={<UploadOutlined />}
          className="flex justify-center mt-5 items-center bg-[#242424] w-[164px] py-2 px-5 h-10 rounded-[30px] cursor-pointer gap-1.5 text-white text-base font-medium"
        >
          Upload File
        </Button>
      </Upload>

      {/* Display Area */}
      <div className="mt-[11px] relative w-[300px] h-[400px] flex items-center justify-center border rounded-md bg-white">
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
            <img src={selectedFile} alt="Uploaded File" className="w-full h-full object-cover rounded-md" />
          )
        ) : (
          <img src="/images/product/Rectangle970.svg" alt="Placeholder" className="w-full h-full object-cover rounded-md" />
        )}
      </div>
    </div>
  );
};

export default FileUploader;
