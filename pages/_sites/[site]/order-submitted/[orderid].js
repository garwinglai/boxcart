import React from "react";
import styles from "../../../../styles/site/order/orderid.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import mobile_order_placed_icon from "@/public/images/icons/mobile_order.png";
import Image from "next/image";

function OrderSubmitted() {
	const router = useRouter();
	const { subdomain, orderid } = router.query;
	console.log(orderid);
	console.log(subdomain);
	console.log(router);
	// todo: Get params for link href - continue shopping
	return (
		<div className={`${styles.orderid_box} ${styles.flexCol}`}>
			<Image src={mobile_order_placed_icon} alt="mobile order icon" />
			<h2>Your order has been placed.</h2>
			<p>Confirmation email sent.</p>
			<Link href={`/`} className={`${styles.continue_shopping_link}`}>
				Continue Shopping
			</Link>
		</div>
	);
}

export default OrderSubmitted;

// export async function getServersideProps(context) {
// 	const test = context.query;

// 	console.log(context, test);

// 	return {
// 		props: test,
// 	};
// }

// TODO get server side props - check order id from params protected route - redirect to 404
