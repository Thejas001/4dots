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
              <a key={idx} href={design.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
                <img src="/images/product/pdf.png" alt="PDF" className="w-32 h-32 object-contain" />
                <div className="mt-2 text-sm text-center">{design.productName}</div>
              </a>
            ) : (
              <img key={idx} src={design.url} alt={design.productName} className="w-32 h-32 object-cover rounded" />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default DesignPreviewModal;