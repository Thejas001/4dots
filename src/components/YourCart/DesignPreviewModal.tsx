import React from 'react';

interface DesignPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string;
  isPdf: boolean;
  productName: string;
}

const DesignPreviewModal: React.FC<DesignPreviewModalProps> = ({
  isOpen,
  onClose,
  documentUrl,
  isPdf,
  productName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2">
      <div className="bg-white rounded-lg p-2 sm:p-6 w-full max-w-[800px] max-h-[90vh] overflow-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{productName}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 text-2xl"
          >
            &times;
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex justify-center">
          {isPdf ? (
            <embed
              src={documentUrl}
              type="application/pdf"
              width="100%"
              height="300px"
              className="border border-gray-300 sm:h-[500px]"
            />
          ) : (
            <img
              src={documentUrl}
              alt="Uploaded Design"
              className="max-w-full max-h-[40vh] sm:max-h-[60vh] object-contain"
            />
          )}
        </div>

        {/* Modal Footer */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DesignPreviewModal;