import React from "react";

function ButtonFilter({ name, icon, handleClick, type }) {
  return (
    <div className="bg-[color:var(--primary-dark-med)] rounded h-full w-full ">
      <button
        type={type}
        onClick={handleClick}
        className="flex items-center justify-center -translate-y-[1px] py-2 active:translate-y-0  h-full w-full bg-[color:var(--primary-light-soft)] border border-[color:var(--primary-dark-med)] text-[color:var(--primary-dark-med)] rounded  px-4 font-normal text-xs lg:text-base lg:py-1 lg:translate-y-0 lg:translate-x-0 lg:hover:-translate-y-0.5 lg:active:translate-y-0  "
      >
        {icon && icon}
        {name}
      </button>
    </div>
  );
}

export default ButtonFilter;
