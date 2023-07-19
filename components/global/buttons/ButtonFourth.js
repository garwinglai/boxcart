import React from "react";

function ButtonFourth({ name, icon, handleClick }) {
  return (
    <div className="bg-[color:var(--black)] rounded w-full h-full ">
      <button
        onClick={handleClick}
        className="flex items-center justify-center -translate-y-[1px] active:translate-y-0 py-2 h-full w-full bg-[color:var(--white-design)] border border-[color:var(--black-design-extralight)] text-[color:var(--black-design-extralight)] rounded lg:py-1 px-4 font-normal text-xs lg:text-base lg:translate-y-0 lg:translate-x-0  lg:hover:-translate-y-0.5 lg:active:translate-y-0  "
      >
        {icon && icon}
        {name && name}
      </button>
    </div>
  );
}

export default ButtonFourth;