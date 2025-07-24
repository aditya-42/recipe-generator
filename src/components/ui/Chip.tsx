"use client";

import React from "react";

type ChipProps = {
  label: string;
  onRemove?: () => void;
};

const Chip: React.FC<ChipProps> = ({ label, onRemove }) => {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-200 text-sm text-gray-800 max-w-[160px]">
      <span className="truncate inline-block max-w-[120px]">{label}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-2 text-gray-500 hover:text-red-500 font-bold focus:outline-none"
          aria-label={`Remove ${label}`}
        >
          ×
        </button>
      )}
    </span>
  );
};

export default Chip;
