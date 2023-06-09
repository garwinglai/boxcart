import React from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SortOutlinedIcon from "@mui/icons-material/SortOutlined";

function ShopSearchBar({isOwner}) {
	return (
		<div className="flex py-2 px-4 gap-2 items-center justify-between">
			<div className="relative flex-grow py-2">
				<label
					htmlFor="search"
					className="absolute flex items-center gap-2 top-[18px] left-4 text-[color:var(--gray-text)] font-light text-sm"
				>
					<SearchOutlinedIcon />
				</label>
				<input
					type="text"
					name="search"
					id="search"
					placeholder="Search all products"
					className="bg-[color:var(--gray-light)] w-full py-3 rounded-full font-light text-sm indent-12"
				/>
			</div>
			<button className="bg-[color:var(--gray-light)] text-white rounded-full py-2 px-3 ">
				<SortOutlinedIcon
					fontSize="small"
					sx={{ color: "var(--black-design-extralight)" }}
				/>
			</button>
		</div>
	);
}

export default ShopSearchBar;
