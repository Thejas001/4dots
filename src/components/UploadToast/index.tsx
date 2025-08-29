import React from 'react';

interface UploadToastProps {
  isOpen: boolean;
  uploadedCount: number;
  totalCount: number;
}

const UploadToast: React.FC<UploadToastProps> = ({ isOpen, uploadedCount, totalCount }) => {
  if (!isOpen) return null;
  const progress = totalCount > 0 ? (uploadedCount / totalCount) * 100 : 0;

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-xs w-full z-50 animate-slide-in">
      <p className="text-sm font-medium mb-2">
        Uploading {uploadedCount}/{totalCount} images...
      </p>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default UploadToast;