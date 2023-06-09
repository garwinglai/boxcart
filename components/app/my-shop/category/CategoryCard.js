import React, { useState } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import ButtonSecondary from "@/components/designs/ButtonSecondary";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import ButtonFilter from "@/components/designs/ButtonFilter";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import CategoryDrawer from "./CategoryDrawer";

function CategoryCard({ handleEidtCategoryClick }) {
	const [isViewWholeCard, setIsViewWholeCard] = useState(false);
	const [state, setState] = useState({
		right: false,
	});

	const toggleDrawer = (anchor, open) => (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}

		setState({ ...state, [anchor]: open });
	};

	const handleViewCardClick = () => {
		setIsViewWholeCard((prev) => !prev);
	};

	return (
		<div className="p-4 rounded-3xl w-full shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)] bg-white">
			<div className="flex justify-between items-center">
				<div className="flex flex-col gap-1">
					<h4>Drinks</h4>
					<p className="font-light text-sm">5 products added</p>
				</div>
				<button
					onClick={handleViewCardClick}
					className="flex items-center gap-1 active text-sm underline "
				>
					{isViewWholeCard ? (
						<KeyboardArrowUpOutlinedIcon fontSize="small" />
					) : (
						<KeyboardArrowDownOutlinedIcon fontSize="small" />
					)}
					View
				</button>
			</div>
			<div className="flex gap-4 justify-between mt-4 pt-2 border-t border-[color:var(--gray-light-med)]">
				<button className="flex items-center gap-1 text-sm text-red-400 ">
					<DeleteOutlineOutlinedIcon fontSize="small" />
					Remove
				</button>
				<div className="md:hidden">
					<ButtonFilter name="Edit" handleClick={toggleDrawer("right", true)} />
				</div>
				<div className="hidden md:block">
					<ButtonFilter name="Edit" handleClick={handleEidtCategoryClick} />
				</div>
				<CategoryDrawer state={state} toggleDrawer={toggleDrawer} />
			</div>
			{isViewWholeCard && (
				<div className="border-t border-[color:var(--gray-light-med)] pt-4 mt-2">
					<h4>Products added</h4>
					<ul className="px-8 pt-2">
						<li className="text-sm font-light list-disc">Mug</li>
						<li className="text-sm font-light list-disc">Car</li>
						<li className="text-sm font-light list-disc">Juice</li>
						<li className="text-sm font-light list-disc">Sweater</li>
					</ul>
				</div>
			)}
		</div>
	);
}

export default CategoryCard;
