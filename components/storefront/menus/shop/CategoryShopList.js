import React from "react";
import Divider from "@mui/material/Divider";

function CategoryShopList() {
	return (
		<div className="hidden xl:block xl:w-1/4 xl:p-4 xl:border-r xl:border-[color:var(--gray-light-med)]">
			<h4>Categories</h4>
			<div className="flex flex-col p-4 gap-2">
				<button
					// href="/account/orders/live"
					// onClick={toggleDrawer("bottom", false)}
					className="text-sm py-2 px-4 rounded hover:bg-[color:var(--third-light-soft)] active:bg-[color:var(--third-light)]"
				>
					<span className="flex items-center gap-4 justify-between">
						<p className="font-light">All Products</p>
						<p className="font-extralight">7</p>
					</span>
				</button>
				<Divider />
				<button
					// href="/account/orders/history"
					// onClick={toggleDrawer("bottom", false)}
					className="text-sm py-2 px-4 rounded hover:bg-[color:var(--third-light-soft)] active:bg-[color:var(--third-light)]"
				>
					<span className="flex items-center gap-4 justify-between">
						<p className="font-light">Cupcakes</p>
						<p className="font-extralight">7</p>
					</span>
				</button>
				<button
					// href="/account/orders/history"
					// onClick={toggleDrawer("bottom", false)}
					className="text-sm py-2 px-4 rounded hover:bg-[color:var(--third-light-soft)] active:bg-[color:var(--third-light)]"
				>
					<span className="flex items-center gap-4 justify-between">
						<p className="font-light">Cakes</p>
						<p className="font-extralight">7</p>
					</span>
				</button>
				<button
					// href="/account/orders/history"
					// onClick={toggleDrawer("bottom", false)}
					className="text-sm py-2 px-4 rounded hover:bg-[color:var(--third-light-soft)] active:bg-[color:var(--third-light)]"
				>
					<span className="flex items-center gap-4 justify-between">
						<p className="font-light">Candles</p>
						<p className="font-extralight">17</p>
					</span>
				</button>
			</div>
		</div>
	);
}

export default CategoryShopList;
