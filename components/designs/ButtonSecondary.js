import React from "react";

function ButtonSecondary({ name, icon, handleClick }) {
	return (
		<div className="bg-[color:var(--primary)] rounded-full w-full h-full">
			<button
				onClick={handleClick}
				className="flex items-center gap-1 -translate-y-[1px] active:translate-y-0 py-2 h-full  w-fit bg-[color:var(--primary-light)] border border-[color:var(--primary)] text-[color:var(--primary-dark-med)] rounded-full lg:py-1 px-4 font-normal text-xs lg:translate-y-0 lg:translate-x-0  lg:hover:-translate-y-0.5 lg:active:translate-y-0  lg:text-sm"
			>
				{icon && icon}
				{name}
			</button>
		</div>
	);
}

export default ButtonSecondary;
