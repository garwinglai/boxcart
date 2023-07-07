import React from "react";

function ButtonSecondaryStorefront({ name }) {
	return (
		<button className="border border-[color:var(--black-design-extralight)] font-extralight text-[color:var(--black-design-extralight)] w-full h-full active:bg-[color:var(--gray-light-med)] ">
			{name}
		</button>
	);
}

export default ButtonSecondaryStorefront;
