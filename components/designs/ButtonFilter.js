import React from "react";

function ButtonFilter({ name, icon, handleClick }) {
	return (
		<div className="bg-[color:var(--primary-dark-med)] rounded-full h-full w-fit ">
			<button
				onClick={handleClick}
				className="-translate-y-[1px] active:translate-y-0 h-full w-fit  flex items-center gap-1  bg-[color:var(--primary-light-soft)] border border-[color:var(--primary-dark-med)] text-[color:var(--primary-dark-med)] rounded-full py-1 px-4 font-normal text-xs lg:translate-y-0 lg:translate-x-0  lg:hover:-translate-y-0.5 lg:active:translate-y-0 lg:text-sm "
			>
				{icon && icon}
				{name}
			</button>
		</div>
	);
}

export default ButtonFilter;
