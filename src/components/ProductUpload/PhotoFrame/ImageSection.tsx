import React, { useState, useEffect } from "react";
import type { UploadFile } from "antd/es/upload";
import { CloseCircleOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";

const ImageSection = ({
  uploadedImages,
  setUploadedImages,
  setSelectedQuantity,
}: {
  uploadedImages: UploadFile[];
  setUploadedImages: React.Dispatch<React.SetStateAction<UploadFile[]>>;
  setSelectedQuantity: (quantity: number | null) => void;
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const maxVisible = 5; // Maximum images shown at a time

  const handleRemove = (uid: string | undefined, name: string) => {
    setUploadedImages((prev) => {
      const updatedList = prev.filter((file) => file.uid !== uid && file.name !== name);
      console.log("Updated List:", updatedList); // Debugging step
      
      // Update the selected quantity after removing an image
      setSelectedQuantity(updatedList.length > 0 ? updatedList.length : null);
  
      return updatedList;
    });
  };
  
  
  useEffect(() => {
    setStartIndex((prevIndex) => Math.max(0, Math.min(prevIndex, uploadedImages.length - maxVisible)));
  }, [uploadedImages.length]); 

  const handleNext = () => {
    if (startIndex + maxVisible < uploadedImages.length) {
      setStartIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="relative flex items-center w-full">
      {/* Left Arrow */}
      {uploadedImages.length > maxVisible && (
        <button
          className={`p-2 bg-white shadow-md rounded-full ${
            startIndex === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={handlePrevious}
          disabled={startIndex === 0}
        >
          <LeftOutlined />
        </button>
      )}

      {/* Image Container */}
      <div className="flex gap-3 p-2">
        {uploadedImages.length > 0 ? (
          uploadedImages.slice(startIndex, startIndex + maxVisible).map((file, index) => (
            <div key={file.uid || file.name || index} className="relative">
              {file.url ? (
                <img src={file.url} alt={file.name} className="w-24 h-24 object-cover rounded-md" />
              ) : (
                <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded-md">
                  No Image
                </div>
              )}
              <CloseCircleOutlined
                className="absolute top-0 right-0 text-red-500 cursor-pointer"
                onClick={() => handleRemove(file.uid, file.name)}
              />
            </div>
          ))
        ) : (
          <img src="/images/product/Frame4.svg" alt="Placeholder" />
        )}
      </div>

      {/* Right Arrow */}
      {uploadedImages.length > maxVisible && (
        <button
          className={`p-2 bg-white shadow-md rounded-full ${
            startIndex + maxVisible >= uploadedImages.length ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={handleNext}
          disabled={startIndex + maxVisible >= uploadedImages.length}
        >
          <RightOutlined />
        </button>
      )}
    </div>
  );
};

export default ImageSection;
