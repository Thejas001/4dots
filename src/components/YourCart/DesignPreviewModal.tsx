import React from 'react';

interface DesignPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  designs: { url: string; isPdf: boolean; productName: string }[];
}

const DesignPreviewModal: React.FC<DesignPreviewModalProps> = ({
  isOpen,
  onClose,
  designs,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] mt-8 overflow-y-auto">
        <button className="mb-4 px-4 py-2 bg-gray-200 rounded" onClick={onClose}>Close</button>
        <div className="flex flex-wrap gap-4 justify-center">
          {designs.map((design, idx) =>
            design.isPdf ? (
              <div key={idx} className="flex flex-col items-center">
                {/* PDF Icon */}
                <a href={design.url} target="_blank" rel="noopener noreferrer">
                  <img
                    src="/images/product/pdf.png"
                    alt="PDF"
                    className="w-32 h-32 object-contain"
                  />
                </a>
                <div className="mt-2 text-sm text-center">{design.productName}</div>

                {/* Download Button */}
                <a
                  href={design.url}
                  download
                  className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                >
                  Click Here 
                </a>
              </div>
            ) : (
              <img
                key={idx}
                src={design.url}
                alt={design.productName}
                className="w-32 h-32 object-cover rounded"
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default DesignPreviewModal;