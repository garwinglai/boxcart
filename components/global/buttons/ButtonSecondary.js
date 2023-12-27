import React from "react";

function ButtonSecondary({ type, name, icon, handleClick }) {
  return (
    <div className="bg-[color:var(--primary)] rounded-full w-full h-full">
      <button
        type={type}
        onClick={handleClick}
        className="flex items-center justify-center gap-1 -translate-y-[1px] active:translate-y-0 py-2 h-full  w-full bg-[color:var(--primary-light)] border border-[color:var(--primary)] text-[color:var(--primary-dark-med)] rounded-full lg:py-1 px-4 font-normal text-sm lg:translate-y-0 lg:translate-x-0  lg:hover:-translate-y-0.5 lg:active:translate-y-0 "
      >
        {icon && icon}
        {name}
      </button>
    </div>
  );
}

export default ButtonSecondary;
