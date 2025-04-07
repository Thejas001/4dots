"use Client";
import { useState, useRef } from "react";

const FileUploader = ({ pageCount, setPageCount }: { pageCount: number; setPageCount: (count: number) => void }) => {
  // Explicitly define ref type to prevent "never" error
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Allow state to hold both null and string (URL of the file)
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click(); // Optional chaining to prevent null errors
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Safely access files
    if (file) {
      setSelectedFile(URL.createObjectURL(file)); // Store file preview URL
    }
  };

  return (
    <div className="flex flex-col bg-[#F7F7F7] h-[571px] w-full md:w-[486px] px-4 md:px-[67px] items-center shadow">
      {/* Upload Button */}
      <div
        className="flex justify-center items-center bg-[#242424] w-[164px] py-2 px-5 h-10 rounded-[30px] relative cursor-pointer gap-1.5"
        onClick={handleButtonClick}
      >
        <img src="/images/icon/upload-icon.svg" alt="Upload Icon" />
        <span className="text-base text-[#fff] font-medium leading-6 tracking-tight">
          Upload File
        </span>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Display Area */}
      <div className="mt-[11px] relative">
        {selectedFile ? (
          <img src={selectedFile} alt="Uploaded File" className="w-[300px] h-auto rounded-md" />
        ) : (
          <img src="/images/product/Rectangle970.svg" alt="Placeholder" />
        )}

        {/* Left & Right Navigation */}
        <div className="absolute top-1/2 -left-7 cursor-pointer">
          <img src="/images/icon/vector-left.svg" alt="Previous" />
        </div>
        <div className="absolute top-1/2 -right-7 cursor-pointer">
          <img src="/images/icon/vector-right.svg" alt="Next" />
        </div>
      </div>

      {/* Pagination */}
      <div
        className="w-[75px] h-10 bg-[#fff] rounded-[30px] mt-[11px] px-5 py-2 text-sm font-medium leading-6 text-[#242424] tracking-[-0.2px]"
        style={{ boxShadow: "0px 4px 16px 0px rgba(91, 91, 91, 0.10)" }}
      > 
       <input
          type="number"
          value={pageCount}
          min="1"
          className="w-full bg-transparent text-center outline-none"
          onChange={(e) => setPageCount(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
 export default FileUploader;