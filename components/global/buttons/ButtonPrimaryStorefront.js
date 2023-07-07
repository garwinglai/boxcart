import React from "react";

function ButtonPrimaryStorefront({ name }) {
	return (
		<button className="bg-[color:var(--black-design-extralight)] font-extralight text-white w-full h-full active:bg-black">
			{name}
		</button>
	);
}

export default ButtonPrimaryStorefront;
