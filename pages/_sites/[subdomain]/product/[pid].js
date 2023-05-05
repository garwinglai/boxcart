import React, { useState } from "react";
import { useRouter } from "next/router";
import Cart from "@/components/storefront/Cart";
import styles from "../../../../styles/subdomain/product/pid.module.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Link from "next/link";
import ShareIcon from "@mui/icons-material/Share";
import { IconButton } from "@mui/material";
import { products } from "@/helper/temp/tempData";
import Image from "next/image";
import Rating from "@mui/material/Rating";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import RadioGroupComponent from "@/components/storefront/options/RadioGroupComponent";
import CheckGroupComponent from "@/components/storefront/options/CheckGroupComponent";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

function Product() {
	const router = useRouter();
	const product = products[0];
	const {
		id,
		name,
		description,
		priceStr,
		reviewStr,
		reviewCountStr,
		quantity,
		options,
		enableNote,
		hasOptions,
		notePlaceHOlder,
	} = product;
	// Show default image first
	const imgArr = product.imgArr.sort((a, b) => b.isDefault - a.isDefault);

	const [exampleImages, setExampleImages] = useState([]);

	function handleBack() {
		router.back();
	}

	function handleShare() {
		// window.alert("share clicked");
	}

	function handleExampleFile(e) {
		console.log(e.target);
		const selectedImage = e.target.files[0];
		const fileName = selectedImage.name;
		const imgUrl = URL.createObjectURL(selectedImage);
		const imgData = { imgUrl, fileName };
		console.log("here", exampleImages);

		if (exampleImages.length < 3) {
			setExampleImages((prev) => [...prev, imgData]);
		}
	}

	function handleRemoveImage(e, item) {
		console.log(item);
		const { fileName, imgUrl } = item;
		const remainingImages = exampleImages.filter(
			(item) => item.fileName !== fileName
		);

		setExampleImages(remainingImages);
	}

	function displayOptions() {
		return (
			<div className={`${styles.options_box}`}>
				{options.map((option, index) => {
					const diffOptionsArr = Object.keys(option);

					return diffOptionsArr.map((optionName) => {
						const currOption = option[optionName];
						const selectOne = currOption.selectOne;
						const selectMany = currOption.selectMany;

						if (selectOne) {
							return <RadioGroupComponent currOption={currOption} />;
						}

						if (selectMany) {
							return <CheckGroupComponent currOption={currOption} />;
						}
					});
				})}
			</div>
		);
	}

	function displayNote() {
		return (
			<div className={`${styles.custom_note_box} ${styles.flexCol}`}>
				<p>Personalization</p>
				<label htmlFor="customNote">
					Know exactly what you want? Let us know and share references.
				</label>
				<textarea
					name="customNote"
					id="customNote"
					cols="30"
					rows="10"
					className={`${styles.custom_note_textbox}`}
				></textarea>
			</div>
		);
	}

	return (
		<React.Fragment>
			<div className={`${styles.product_page_box} ${styles.flexCol}`}>
				<div className={`${styles.flex} ${styles.header_icons_box}`}>
					<IconButton onClick={handleBack}>
						<ArrowBackIosIcon
							fontSize="medium"
							sx={{ color: "var(--secondary-dark-med)" }}
						/>
					</IconButton>
					<h3>Palette Studio</h3>
					<IconButton onClick={handleShare}>
						<ShareIcon
							fontSize="medium"
							sx={{ color: "var(--secondary-dark-med)" }}
						/>
					</IconButton>
				</div>
				<div className={`${styles.images_box} ${styles.flex}`}>
					{imgArr.map((imgItem, index) => (
						<Image
							src={imgItem.imgStr}
							alt={imgItem.imgAlt}
							key={index}
							className={`${styles.product_image}`}
						/>
					))}
				</div>
				<div className={`${styles.triple_dots_box}`}>
					<MoreHorizIcon
						fontSize="medium"
						sx={{ color: "var(--gray-light-med)" }}
					/>
				</div>
				<div className={`${styles.product_info_box}`}>
					<div className={`${styles.product_info_top} ${styles.flex}`}>
						<h2>{name}</h2>
						<p>{priceStr}</p>
					</div>
					<div className={`${styles.product_info_bottom} ${styles.flex}`}>
						<p>{description}</p>
						<div className={`${styles.flexCol} ${styles.reviews_box}`}>
							<p>{`(${reviewCountStr})`}</p>

							<Rating
								name="read-only"
								defaultValue={reviewStr}
								precision={0.5}
								readOnly
								size="small"
							/>
						</div>
					</div>
				</div>
				{hasOptions && displayOptions()}
				{enableNote && displayNote()}
				<div className={`${styles.upload_box} ${styles.flex}`}>
					<p>3 uploads max</p>
					{exampleImages.length < 3 && (
						<React.Fragment>
							<label htmlFor="file" aria-disabled>
								Upload image
							</label>
							<input
								type="file"
								id="file"
								accept="image/"
								onChange={handleExampleFile}
							/>
						</React.Fragment>
					)}
				</div>
				<div className={`${styles.flex} ${styles.example_images_box}`}>
					{exampleImages.length !== 0 &&
						exampleImages.map((item, idx) => (
							<div className={`${styles.example_image_box} ${styles.flexCol}`}>
								<DeleteForeverIcon
									fontSize="medium"
									sx={{ color: "var(--gray)" }}
									onClick={(e) => handleRemoveImage(e, item)}
								/>
								<div className={`${styles.flex} ${styles.image_box}`}>
									<Image
										src={item.imgUrl}
										className={`${styles.example_image}`}
										fill={true}
										alt={item.fileName}
									/>
								</div>
								<div className={`${styles.flexCol} ${styles.file_name_group}`}>
									<p>{item.fileName}</p>
								</div>
							</div>
						))}
				</div>
				<div className={`${styles.buy_buttons_group} ${styles.flexCol}`}>
					<button className={`${styles.one_click_buy_button} ${styles.btn}`}>
						1-Click Buy
					</button>
					<button className={`${styles.add_to_cart_button} ${styles.btn}`}>
						Add to Cart
					</button>
				</div>
			</div>
			<Cart />
		</React.Fragment>
	);
}

export default Product;

// TODO: get products
// export async function getServerSideProps(context) {
// 	console.log(context.query.pid);

// 	const user = await prisma.user.findFirst({
// 		where: {
// 			email: "garwingl@usc.edu",
// 		},
// 	});

// 	console.log(user);

// 	return { props: {} };
// }
