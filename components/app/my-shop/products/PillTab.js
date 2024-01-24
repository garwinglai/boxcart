import React from "react";

function PillTab({ name, handleClick }) {
  return (
    <div className="flex items-center gap-2 bg-gray-200 px-2 shadow text-gray-500 rounded-full border border-gray-400">
      <p className="text-sm font-extralight">{name}</p>
      <button
        type="button"
        onClick={handleClick}
        className="text-gray-500 text-xs hover:cursor-pointer"
      >
        x
      </button>
    </div>
  );
}

export default PillTab;
