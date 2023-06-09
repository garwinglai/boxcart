import React from "react";
import styles from "../../../styles/components/storefront/cart/cartitem.module.css";
import Image from "next/image";
import mug_temp from "../../../public/images/temp/custom_mug.jpg";
import sweater_temp from "../../../public/images/temp/custom_sweater.jpg";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import candle_2 from "@/public/images/temp/candle_2.jpeg";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

import candle_4 from "@/public/images/temp/candle_4.jpeg";

function CartItem({ isDesktop, isBusiness }) {
	return (
		<div className={`${styles.cart_item_box} ${styles.flexCol}`}>
			<div className={`${styles.flex} ${styles.cart_item_top_box}`}>
				<Image
					src={candle_4}
					alt="product image"
					className={`${styles.cart_item_img}`}
				/>
				<div className={`${styles.flexCol} ${styles.item_info_box}`}>
					<h4>Candle de la Special</h4>
					<h5>$2.99</h5>
					<p>
						<b>Options:</b> small, strawberry, cheese
					</p>
					<p>
						<b>Note:</b> Please use a superman theme, It is for my kids birthday
						party. Lorem ipsum dolor sit amet consectetur, adipisicing elit.
						Hic, alias at, adipisci assumenda eligendi quam omnis cupiditate
						labore, reprehenderit culpa nemo! Magnam.
					</p>
					{!isBusiness && (
						<div className={`${styles.edit_quantity_btn_group} ${styles.flex}`}>
							<button className={`${styles.quantity_btn} ${styles.remove_btn}`}>
								<DeleteForeverIcon fontSize="small" />
							</button>
							<div className={`${styles.item_quantity_box} ${styles.flex}`}>
								<p>1</p>
							</div>
							<button className={`${styles.quantity_btn} ${styles.add_btn}`}>
								<AddIcon fontSize="small" />
							</button>
						</div>
					)}
				</div>
			</div>
			<div className={`${styles.flexCol} ${styles.cart_item_uploads_box}`}>
				<div className={`${styles.flex} ${styles.upload_title_group}`}>
					{isBusiness ? <h5>Customer Uploads:</h5> : <h5>Uploads:</h5>}
					{!isBusiness && <button>edit</button>}
				</div>
				<div className={`${styles.flex} ${styles.example_images_box}`}>
					<div className={`${styles.example_image_group} ${styles.flexCol}`}>
						<Image
							src={candle_2}
							className={`${styles.example_image}`}
							alt="customer uploaded images"
						/>

						<p>fileNameaskadhflkjahsdlfiawdfa</p>
					</div>
					<div className={`${styles.example_image_group} ${styles.flexCol}`}>
						<Image
							src={candle_2}
							className={`${styles.example_image}`}
							alt="customer uploaded images"
						/>
						<p>fileName</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default CartItem;
