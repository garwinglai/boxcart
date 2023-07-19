import React from "react";

function ButtonThird({ name, icon, handleClick }) {
  return (
    <div className="bg-[color:var(--black)] rounded w-full h-full">
      <button
        onClick={handleClick}
        className="flex gap-2 items-center justify-center -translate-y-[1px] active:translate-y-0 py-2 w-full h-full bg-[color:var(--black-design-extralight)] border border-[color:var(--black-design-extralight)] text-white rounded px-4 font-normal text-xs lg:text-base lg:py-1  lg:translate-y-0 lg:translate-x-0 lg:hover:-translate-y-0.5  lg:active:translate-y-0  "
      >
        {icon && icon}
        {name && name}
      </button>
    </div>
  );
}

export default ButtonThird;
