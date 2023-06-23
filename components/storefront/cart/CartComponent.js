import React, { useState } from "react";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CartItem from "./CartItem";
import OrderReview from "./OrderReview";
import OrderSubtotal from "./OrderSubtotal";
import Image from "next/image";
import product_tag_icon from "@/public/images/icons/product_tag_icon.png";
import { useRouter } from "next/router";

function CartComponent({ toggleDrawer, cartItems, isDesktop }) {
	const [isLoading, setIsLoading] = useState(false);

	const { push, back } = useRouter();

	const handleCheckout = (e) => {
		if (isLoading) return;
		setIsLoading(true);
		push("/checkout");
	};

	return (
		<div className="flex flex-col w-screen lg:w-full lg:border-l lg:border-[color:var(--gray-light-med)] lg:h-full ">
			<div className="flex justify-between items-center py-2 px-4 sticky top-0 bg-white border-b border-[color:var(--gray-light-med)] z-10 lg:w-full">
				<h2 className="text-[color:var(--black-design-extralight)]  font-medium">
					My Cart
				</h2>
				<div className="lg:hidden">
					<IconButton onClick={toggleDrawer}>
						<CloseIcon color="black" />
					</IconButton>
				</div>
			</div>
			<div className="pb-8 overflow-y-scroll">
				{cartItems.length === 0 ? (
					<div className="mt-28 flex flex-col items-center gap-2 justify-center lg:w-full">
						<Image
							src={product_tag_icon}
							alt="product tag icon"
							className="w-12 h-12 object-contain"
						/>
						<h4>No items added ...</h4>
					</div>
				) : (
					<React.Fragment>
						<h3 className="font-medium pt-4 px-4">Items added:</h3>
						{cartItems.map((item, idx) => (
							<CartItem key={idx} />
						))}
						<OrderReview />
						<OrderSubtotal />
					</React.Fragment>
				)}
			</div>
			<div
				className={`sticky top-0 w-full p-4 bg-white border-y border-[color:var(--gray-light-med)] ${
					isDesktop && cartItems.length === 0 && "lg:hidden"
				}`}
			>
				<button
					onClick={cartItems.length === 0 ? toggleDrawer : handleCheckout}
					className="text-white font-extralight py-2 w-full  bg-[color:var(--black-design-extralight)] active:bg-black min-w-fit"
					// disabled={isLoading ? true : false}
				>
					{cartItems.length === 0
						? "Continue shopping ..."
						: isLoading
						? `Checking out ...`
						: "Checkout"}
				</button>
			</div>
		</div>
	);
}

export default CartComponent;
