import React from "react";

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
  if (!isOpen) return null;

  const progress = totalCount > 0 ? (uploadedCount / totalCount) * 100 : 0;
  const radius = 40; // circle radius
  const stroke = 6; // stroke width
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-black/70">
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

            {/* Progress ring (black) */}
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

        {/* Label below circle */}
        <p className="mt-4 text-base text-black font-bold">
          Uploading Files...
        </p>
      </div>
    </div>
  );
};

export default UploadProgress;
