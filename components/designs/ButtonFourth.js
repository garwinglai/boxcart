import React from "react";

function ButtonFourth({ name }) {
	return (
		<div className="bg-[color:var(--secondary)] rounded-full w-fit h-full ">
			<button className="-translate-y-[1px] active:translate-y-0 py-2 h-full w-fit bg-[color:var(--secondary-light)] border border-[color:var(--secondary)] text-[color:var(--secondary-dark-med)] rounded-full lg:py-1 px-4 font-normal text-xs lg:translate-y-0 lg:translate-x-0  lg:hover:-translate-y-0.5 lg:active:translate-y-0 lg:text-sm ">
				{name}
			</button>
		</div>
	);
}

export default ButtonFourth;
