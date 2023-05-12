import React from "react";
import styles from "../../../styles/components/storefront/cart/cartitem.module.css";
import Image from "next/image";
import mug_temp from "../../../public/images/temp/custom_mug.jpg";
import sweater_temp from "../../../public/images/temp/custom_sweater.jpg";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

function CartItem() {
	return (
		<div className={`${styles.cart_item_box} ${styles.flexCol}`}>
			<div className={`${styles.flex} ${styles.cart_item_top_box}`}>
				<Image
					src={mug_temp}
					alt="product image"
					className={`${styles.cart_item_img}`}
				/>
				<div className={`${styles.flexCol} ${styles.item_info_box}`}>
					<h3>Product Name</h3>
					<h4>$2.99</h4>
					<p>
						<b>Options:</b> small, strawberry, cheese
					</p>
				</div>
			</div>
			<div className={`${styles.flexCol} ${styles.cart_item_bottom_box}`}>
				<p>
					<b>Personalization:</b> Please use a superman theme, It is for my kids
					birthday party.
				</p>
				<p>
					<b>Uploads:</b>
				</p>
				<div className={`${styles.flex} ${styles.example_images_box}`}>
					{/* {exampleImages.length !== 0 &&
						exampleImages.map((item, idx) => ( */}
					<div
						// key={idx}
						className={`${styles.example_image_box} ${styles.flexCol}`}
					>
						{/* <DeleteForeverIcon
							fontSize="small"
							sx={{ color: "var(--gray)" }}
							// onClick={(e) => handleRemoveImage(e, item)}
						/> */}
						<div className={`${styles.flex} ${styles.image_box}`}>
							<Image
								src={sweater_temp}
								className={`${styles.example_image}`}
								fill={true}
								alt="customer uploaded images"
								// alt={item.fileName}
							/>
						</div>
						<div className={`${styles.flexCol} ${styles.file_name_group}`}>
							{/* <p>{item.fileName}</p> */}
							<p>fileName</p>
						</div>
					</div>
					<div
						// key={idx}
						className={`${styles.example_image_box} ${styles.flexCol}`}
					>
						{/* <DeleteForeverIcon
							fontSize="small"
							sx={{ color: "var(--gray)" }}
							// onClick={(e) => handleRemoveImage(e, item)}
						/> */}
						<div className={`${styles.flex} ${styles.image_box}`}>
							<Image
								src={sweater_temp}
								className={`${styles.example_image}`}
								fill={true}
								alt="customer uploaded images"
								// alt={item.fileName}
							/>
						</div>
						<div className={`${styles.flexCol} ${styles.file_name_group}`}>
							{/* <p>{item.fileName}</p> */}
							<p>fileName</p>
						</div>
					</div>
					<div
						// key={idx}
						className={`${styles.example_image_box} ${styles.flexCol}`}
					>
						{/* <DeleteForeverIcon
							fontSize="small"
							sx={{ color: "var(--gray)" }}
							// onClick={(e) => handleRemoveImage(e, item)}
						/> */}
						<div className={`${styles.flex} ${styles.image_box}`}>
							<Image
								src={sweater_temp}
								className={`${styles.example_image}`}
								fill={true}
								alt="customer uploaded images"
								// alt={item.fileName}
							/>
						</div>
						<div className={`${styles.flexCol} ${styles.file_name_group}`}>
							{/* <p>{item.fileName}</p> */}
							<p>fileName</p>
						</div>
					</div>
					{/* ))} */}
				</div>
			</div>
		</div>
	);
}

export default CartItem;
