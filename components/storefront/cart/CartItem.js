import React from "react";
import styles from "../../../styles/components/storefront/cart/cartitem.module.css";
import Image from "next/image";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import candle_2 from "@/public/images/temp/candle_2.jpeg";
import AddIcon from "@mui/icons-material/Add";

import candle_4 from "@/public/images/temp/candle_4.jpeg";
import { IconButton } from "@mui/material";

function CartItem({ isDesktop, isBusiness }) {
	return (
		<div className={`${styles.cart_item_box} ${styles.flexCol}`}>
			<div className={`${styles.flex} ${styles.cart_item_top_box}`}>
				<Image
					src={candle_4}
					alt="product image"
					className=" min-w-[5rem] max-w-[5rem] min-h-[5rem] max-h-[5rem] object-cover"
				/>
				<div className={`${styles.flexCol} ${styles.item_info_box}`}>
					<h4 className="font-medium">Candle de la Special</h4>

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
						<div className="flex justify-between items-center">
							<div className="flex gap-2 items-center  ">
								<IconButton>
									<DeleteForeverIcon fontSize="small" />
								</IconButton>

								<div className="w-fit border border-[color:var(--gray-light-med)] px-3 py-1">
									<p>12</p>
								</div>
								<IconButton className="">
									<AddIcon fontSize="small" />
								</IconButton>
							</div>
							<h5 className="font-medium">$2.99</h5>
						</div>
					)}
				</div>
			</div>
			<div className={`${styles.flexCol} ${styles.cart_item_uploads_box}`}>
				<div className={`${styles.flex} ${styles.upload_title_group}`}>
					{isBusiness ? (
						<h5 className="font-medium">Customer Uploads:</h5>
					) : (
						<h5 className="font-medium">Uploads:</h5>
					)}
					{!isBusiness && <button>edit</button>}
				</div>
				<div className={`${styles.flex} ${styles.example_images_box}`}>
					<div className={`${styles.example_image_group} ${styles.flexCol}`}>
						<Image
							src={candle_2}
							className=" min-w-[5rem] max-w-[5rem] min-h-[5rem] max-h-[5rem] object-cover"
							alt="customer uploaded images"
						/>

						<p className="truncate">fileNameaskadhflkjahsdlfiawdfa</p>
					</div>
					<div className={`${styles.example_image_group} ${styles.flexCol}`}>
						<Image
							src={candle_2}
							className=" min-w-[5rem] max-w-[5rem] min-h-[5rem] max-h-[5rem] object-cover"
							alt="customer uploaded images"
						/>
						<p className="truncate">fileName</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default CartItem;
