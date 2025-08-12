"use client";

import React, { useState, useEffect } from "react";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Button, message, Upload } from "antd";

interface FileUploaderProps {
  onUploadSuccess: (documentId: number, file?: File, name?: string) => void;
  pageCount: number;
  setPageCount: (count: number) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ pageCount, setPageCount, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"pdf" | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const props: UploadProps = {
    name: "document",
    action: "https://fourdotsapp-prod.azurewebsites.net/api/document/upload?returnPageCount=true",
    method: "POST",
    accept: ".pdf",
    headers: {
      authorization: "authorization-text",
    },
    beforeUpload: (file) => {
      const fileURL = URL.createObjectURL(file);
      setSelectedFile(fileURL);
      setUploadedFile(file);
      setFileName(file.name);

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
          const pages = response.Data?.PageCount;

          sessionStorage.setItem("uploadedDocumentId", documentId);
          onUploadSuccess(documentId, uploadedFile || undefined, fileName);

          if (pages !== undefined) {
            setPageCount(pages);
          }

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
    const handleBeforeUnload = async () => {
      const docId = sessionStorage.getItem("uploadedDocumentId");

      if (docId) {
        try {
          await fetch(`https://fourdotsapp-prod.azurewebsites.net/api/document/delete/${docId}`, {
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
      <div className="mt-[11px] relative w-[300px] h-[400px] flex items-center justify-center border rounded-md bg-white">
        {selectedFile ? (
          fileType === "pdf" ? (
          <iframe
            key={currentPage}
            src={`${selectedFile}#toolbar=0&page=${currentPage}`}
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

      {/* Pagination
      <div
        className="mt-[11px] h-10 w-[60px] rounded-[30px] bg-white px-3 py-2 text-sm font-medium leading-6 tracking-[-0.2px] text-[#242424] flex items-center justify-center shadow-[0px_4px_16px_0px_rgba(91,91,91,0.10)]"
      >
        {pageCount}
      </div> */}
      
      <div className="mt-4 text-center text-xs text-gray-500 max-w-xs">
        Supported file formats: PDF.
      </div>
    </div>
  );
};

export default FileUploader;