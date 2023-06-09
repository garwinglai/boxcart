import React, { useState } from "react";
import styles from "../../../styles/components/storefront/menus/shop-card.module.css";
import Image from "next/image";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ProductDrawer from "@/components/app/my-shop/products/ProductDrawer";

function ShopCard({ subdomain, product, isOwner }) {
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

	const [state, setState] = useState({
		right: false,
	});

	function handleClickProduct(e) {
		console.log("clicked");
	}

	const toggleDrawer = (anchor, open) => (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}

		setState({ ...state, [anchor]: open });
	};

	return (
		<div className={`${styles.card_box}`}>
			<Link
				href={`/product/${id}`}
				className={`${styles.card_button_box_link} ${styles.flexCol}  `}
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

					<p className={`${styles.price}`}>{priceStr}</p>
					{quantity == 0 && (
						<p className={`${styles.sold_out_text}`}>Sold out</p>
					)}
				</div>
			</Link>
			<div className={`${styles.add_to_cart_btn}`}>
				{isOwner ? (
					<React.Fragment>
						<IconButton onClick={toggleDrawer("right", true)}>
							<MoreVertIcon
								fontSize="small"
								sx={{ color: "var(--brown-text)" }}
							/>
						</IconButton>
						<ProductDrawer state={state} toggleDrawer={toggleDrawer} />
					</React.Fragment>
				) : (
					<IconButton>
						<AddShoppingCartIcon
							fontSize="small"
							sx={{ color: "var(--brown-text)" }}
						/>
					</IconButton>
				)}
			</div>
		</div>
	);
}

export default ShopCard;
