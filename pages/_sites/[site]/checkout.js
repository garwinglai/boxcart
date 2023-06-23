import React, { useState } from "react";
import { Divider, IconButton } from "@mui/material";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/router";
import OrderReview from "@/components/storefront/cart/OrderReview";
import OrderSubtotal from "@/components/storefront/cart/OrderSubtotal";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ButtonPrimaryStorefront from "@/components/common/buttons/ButtonPrimaryStorefront";

function Checkout() {
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();

	function handleBack(e) {
		router.back();
	}

	function handleSubmitOrder(e) {
		if (isLoading) return;

		e.preventDefault();
		setIsLoading(true);
		router.push("/order-submitted/123");
	}

	return (
		<div className="">
			<div className="flex justify-between sticky top-0 p-2 bg-white items-center border-b z-10">
				<IconButton onClick={handleBack}>
					<ChevronLeftIcon color="black" />
				</IconButton>
				<div className="flex gap-2 items-center">
					<h3 className="text-[color:var(--black-design-extralight)]">
						Checkout Information
					</h3>
					<ShoppingCartCheckoutIcon
						sx={{ color: "var(--black-design-extralight)" }}
					/>
				</div>
			</div>
			<form
				onSubmit={handleSubmitOrder}
				className="flex flex-col gap-1 pb-16 lg:flex-row lg:mt-8 lg:mx-16 lg:gap-4"
			>
				<div className="lg:w-2/3">
					<div className="p-4 gap-2 flex flex-col bg-white md:border md:round md:my-4 md:mx-16 lg:mx-0 lg:mt-0">
						<h3 className="font-medium">Your information:</h3>
						<div className="lg:px-12">
							<div className="flex w-full gap-2">
								<TextField
									id="outlined-basic"
									label="First name"
									variant="standard"
									fullWidth
									required
									color="warning"
								/>
								<TextField
									fullWidth
									id="outlined-basic"
									label="Last name"
									variant="standard"
									required
									color="warning"
								/>
							</div>
							<TextField
								id="outlined-basic"
								label="Email"
								variant="standard"
								required
								fullWidth
								color="warning"
								sx={{ marginTop: "1rem" }}
							/>
							<TextField
								id="outlined-basic"
								label="Phone (optional)"
								variant="standard"
								fullWidth
								color="warning"
								sx={{ marginTop: "1rem" }}
							/>
						</div>
					</div>

					<div className="p-4 bg-white border-t-2 md:border md:round md:mb-4 md:mx-16 lg:mx-0">
						<h3 className="font-medium">Payment:</h3>
						{/* //TODO: Depending on payment type, show different inputs */}
					</div>
				</div>

				<div className="relative lg:flex-grow">
					<div className="bg-white border-t-2 md:border md:round md:mx-16 lg:mx-0">
						<OrderReview />
					</div>

					<div className="bg-white border-t-2 md:border md:round md:my-4 md:mx-16 lg:mx-0">
						<OrderSubtotal />
					</div>
					<div className="fixed bottom-0 w-full p-4 bg-white border-t border-[color:var(--gray-light-med)] lg:relative lg:border">
						<button
							type="submit"
							className="text-white font-extralight py-2 w-full  bg-[color:var(--black-design-extralight)] active:bg-black"
						>
							{isLoading ? "Submitting order..." : "Submit Order"}
						</button>
					</div>
				</div>
			</form>
		</div>
	);
}

export default Checkout;
