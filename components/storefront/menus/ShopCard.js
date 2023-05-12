import React from "react";
import styles from "../../../styles/components/storefront/menus/shop-card.module.css";
import Image from "next/image";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import Link from "next/link";

function ShopCard({ subdomain, product }) {
	const {
		id,
		name,
		imgDefaultStr,
		priceStr,
		reviewStr,
		reviewDouble,
		reviewCountStr,
		quantity,
		imgDefaultAlt,
	} = product;

	function handleClickProduct(e) {
		console.log("clicked");
	}
	return (
		<div className={`${styles.card_box}`}>
			<Link
				href={`/product/${id}`}
				className={`${styles.card_button_box_link} ${styles.flexCol}`}
			>
				<div className={`${styles.img_box}`}>
					<Image
						src={imgDefaultStr}
						alt={imgDefaultAlt}
						className={`${styles.card_img}`}
					/>
				</div>
				<div className={`${styles.card_context_box} ${styles.flexCol}`}>
					<h4>{name}</h4>
					{quantity == 0 && (
						<p className={`${styles.sold_out_text}`}>Sold out</p>
					)}

					<div className={`${styles.rating_box} ${styles.flex}`}>
						<Rating
							name="read-only"
							defaultValue={reviewDouble}
							precision={0.5}
							readOnly
							size="small"
						/>
						<p>{`(${reviewCountStr})`}</p>
					</div>
					<p>{priceStr}</p>
				</div>
			</Link>
		</div>
	);
}

export default ShopCard;
