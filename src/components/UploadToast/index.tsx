import React, { useEffect, useState } from "react";

interface UploadProgressProps {
  isOpen: boolean;
  uploadedCount: number;
  totalCount: number;
}

const UploadProgress: React.FC<UploadProgressProps> = ({
  isOpen,
  uploadedCount,
  totalCount,
}) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
    "Uploading Files...",
    "Processing..."
  ];

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000); // change message every 2s

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const progress = totalCount > 0 ? (uploadedCount / totalCount) * 100 : 0;
  const radius = 40;
  const stroke = 6;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black">
      <div className="flex flex-col items-center">
        {/* Circle + Text wrapper */}
        <div className="relative flex items-center justify-center">
          <svg
            height={radius * 2}
            width={radius * 2}
            className="transform -rotate-90"
          >
            {/* Grey track */}
            <circle
              stroke="#e5e7eb"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />

            {/* Progress ring */}
            <circle
              stroke="#000000"
              fill="transparent"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              className="transition-all duration-300"
            />
          </svg>

          {/* Centered progress text */}
          <span className="absolute text-base font-semibold text-gray-900">
            {uploadedCount}/{totalCount}
          </span>
        </div>

        {/* Floating word */}
        <p className="mt-4 text-base text-black font-bold animate-pulse">
          {messages[messageIndex]}
        </p>
      </div>
    </div>
  );
};

export default UploadProgress;
