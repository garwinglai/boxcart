import React from "react";

function ButtonPrimary({ type, name, handleClick, icon, disabled }) {
	return (
		<div className="bg-[color:var(--primary-dark)] rounded w-full h-full">
			<button
				disabled={disabled}
				type={type}
				onClick={handleClick}
				className="flex items-center justify-center gap-1 -translate-y-[1px] py-2 active:translate-y-0  h-full w-full bg-[color:var(--primary)] border border-[color:var(--primary-dark)] text-white rounded  px-4 font-normal text-xs lg:py-1 lg:translate-y-0 lg:translate-x-0 lg:hover:-translate-y-0.5 lg:active:translate-y-0  "
			>
				{icon && icon}
				{name}
			</button>
		</div>
	);
}

export default ButtonPrimary;
