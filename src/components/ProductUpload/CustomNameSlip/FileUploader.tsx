"use client";

import React, { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Button, message, Upload } from "antd";

const FileUploader = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"pdf" | null>(null);

  const props: UploadProps = {
    name: "file",
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    accept: ".pdf",  // Only allow PDF files in the file explorer
    headers: {
      authorization: "authorization-text",
    },
    beforeUpload: (file) => {
      // Always generate preview URL first
      const fileURL = URL.createObjectURL(file);
      setSelectedFile(fileURL);
      
      if (file.type === "application/pdf") {
        setFileType("pdf");
        return true; // Allow upload for PDFs
      } else {
        message.error("Unsupported file type. Please upload a PDF.");
        return false; // Prevent upload but still show preview
      }
    },
    onChange(info) {
      if (info.file.status === "done") {
        message.success(`${info.file.name} uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} upload failed.`);
      }
    },
  };

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
