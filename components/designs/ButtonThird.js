import React from "react";

function ButtonThird({ name }) {
	return (
	<div className="bg-[color:var(--secondary-dark-med)] rounded-full w-fit h-full">
			<button className="-translate-y-[1px] active:translate-y-0 py-2 w-fit h-full bg-[color:var(--secondary)] border border-[color:var(--secondary-dark-med)] text-white rounded-full lg:py-1 px-4 font-normal text-xs lg:translate-y-0 lg:translate-x-0 lg:hover:-translate-y-0.5  lg:active:translate-y-0 lg:text-sm ">
				{name}
			</button>
		</div>
	);
}

export default ButtonThird;
