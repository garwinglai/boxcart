import React from "react";
import ButtonSecondary from "../designs/ButtonSecondary";
import ButtonPrimary from "../designs/ButtonPrimary";

function SaveCancelButtons({ handleCancel }) {
	return (
		<div className="z-10 flex  gap-4 justify-center fixed bottom-0 p-4 w-full text-center bg-white shadow-[0_7px_29px_0_rgba(100,100,111,0.2)] md:justify-end md:w-[calc(100vw-250px)]  lg:right-0  lg:rounded-none   lg:border-t ">
			<span className="w-full bg-[color:var(--primary)] rounded-full md:w-32 lg:flex-grow-0">
				<button
					onClick={handleCancel}
					className=" -translate-y-[2px] active:translate-y-0 h-full  w-full bg-[color:var(--primary-light)] border border-[color:var(--primary)] text-[color:var(--primary-dark-med)] rounded-full py-2 font-normal text-xs lg:translate-y-0 lg:translate-x-0  lg:hover:-translate-y-1 lg:active:translate-y-0  lg:text-sm"
				>
					Cancel
				</button>
			</span>
			<span className="w-full bg-[color:var(--primary-dark)] rounded-full md:w-32 lg:flex-grow-0">
				<button className="-translate-y-[2px] active:translate-y-0  h-full w-full bg-[color:var(--primary)] border border-[color:var(--primary)] text-white rounded-full py-2  font-normal text-xs lg:translate-y-0 lg:translate-x-0 lg:hover:-translate-y-1 lg:active:translate-y-0 lg:text-sm ">
					Save changes
				</button>
			</span>
		</div>
	);
}

export default SaveCancelButtons;
