import React from "react";

function ButtonPrimaryStorefront({ name, handleClick, type, disabled }) {
  return (
    <button
      disabled={disabled}
      onClick={handleClick}
      type={type}
      className="rounded disabled:bg-[color:var(--black-design-extralight)] bg-[color:var(--black-design-extralight)] font-extralight text-white w-full h-full active:bg-black text-sm"
    >
      {name}
    </button>
  );
}

export default ButtonPrimaryStorefront;
