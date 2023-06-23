import React, { useState } from "react";
import ButtonPrimary from "@/components/common/buttons/ButtonPrimary";
import { IconButton } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Image from "next/image";
import category_icon from "@/public/images/icons/category_icon.png";

function CategoryDrawerComponent({ toggleDrawer, isDesktopView }) {
	const [products, setProducts] = useState([]);
	const [selectedProduct, setSelectedProduct] = useState("");

	const handleChangeSelectedProduct = (e) => {
		const { value } = e.target;
		setSelectedProduct(value);
	};

	const handleAddProductsClick = (e) => {
		setSelectedProduct("");

		if (!products.includes(selectedProduct)) {
			setProducts((prev) => [...prev, selectedProduct]);
		}
	};
	return (
		<div className="p-4 flex flex-col gap-4 overflow-y-scroll pb-28 md:pt-0 md:pl-2">
			{!isDesktopView && (
				<div className="flex justify-between items-center">
					<span className="flex gap-4 items-center">
						<Image
							src={category_icon}
							alt="category icon"
							className="w-[3rem] h-[3rem]"
						/>
						<h2>Edit Category:</h2>
					</span>
					<button
						className="flex text-[color:var(--secondary)] "
						onClick={toggleDrawer("right", false)}
					>
						<ChevronLeftIcon />
						<p>close</p>
					</button>
				</div>
			)}
			<div className="rounded p-4 w-full shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)] bg-white relative">
				<span className="flex flex-col gap-2">
					<label
						htmlFor="categoryTitle"
						className="text-black font-semibold text-sm "
					>
						Category name:
					</label>
					<input
						type="text"
						id="categoryTitle"
						className={`transition-colors duration-300 border border-[color:var(--primary)] rounded w-full py-2 focus:outline-none focus:border focus:border-[color:var(--primary-light-med)] indent-4 font-light text-xs`}
					/>
				</span>
				<span className="flex flex-col gap-2 mt-4 relative">
					<label htmlFor="product" className="text-black font-semibold text-sm">
						Add products:
					</label>
					<select
						name="product"
						id="product"
						onChange={handleChangeSelectedProduct}
						value={selectedProduct}
						className={`transition-colors duration-300 border border-[color:var(--primary)] rounded w-full py-2 px-4 focus:outline-none focus:border focus:border-[color:var(--primary-light-med)]  font-light text-xs overflow-hidden`}
					>
						<option value="n/a">n / a</option>
						<option value="Desserts">Desserts</option>
						<option value="Drinks">das</option>
						<option value="Drisadfsanks">Drisadfsanks</option>
						<option value="Drisadfnks">Drisadfnks</option>
						<option value="Dridfnks">Dridfnks</option>
						<option value="Drienks">Drienks</option>
						<option value="Drivqnks">Drivqnks</option>
						<option value="Drfsdfivqnks">Drivqnks</option>
						<option value="Dri12favqnks">Drivqnks</option>
						<option value="Drif2vqnks">Drivqnks</option>
						<option value="Driv3121qnks">Drivqnks</option>
					</select>
				</span>
				<div className="mt-4 w-fit ml-auto">
					<ButtonPrimary
						name="Add product"
						handleClick={handleAddProductsClick}
					/>
				</div>
			</div>
			<div className="rounded p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)] bg-white relative">
				<h4>Added Products:</h4>
				<ul className="pt-2">
					{products.length === 0 ? (
						<li className="font-light text-sm text-center py-2">
							No added products.
						</li>
					) : (
						products.map((product, idx) => (
							<div key={idx} className="flex justify-between items-center w-full mb-2">
								<li key={idx} className="text-sm font-light">
									{product}
								</li>
								<IconButton sx={{ backgroundColor: "var(--gray-light)" }}>
									<DeleteOutlineOutlinedIcon
										fontSize="small"
										// sx={{ color: "var(--black)" }}
									/>
								</IconButton>
							</div>
						))
					)}
				</ul>
			</div>
		</div>
	);
}

export default CategoryDrawerComponent;
