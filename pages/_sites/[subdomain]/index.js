import React, { useState } from "react";
import styles from "../../../styles/subdomain/subdomain.module.css";
import gar_img from "../../../public/images/temp/gar.jpg";
import Image from "next/image";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StoreIcon from "@mui/icons-material/Store";
import GridOnIcon from "@mui/icons-material/GridOn";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import { products } from "@/helper/temp/tempData";
import ShopCard from "@/components/storefront/menus/ShopCard";
import Cart from "@/components/storefront/Cart";

function Sites({ subdomain }) {
	console.log("subdomain:", subdomain);
	const [alignment, setAlignment] = useState("");
	const [menuSelected, setmenuSelected] = useState("shop");

	const handleAlignment = (event, newAlignment) => {
		setAlignment(newAlignment);
	};

	function setMenu(e, value) {
		// const { value, name } = e.target;
		console.log(value);
		setmenuSelected(value);
	}

	function showMenuLayout(menuSelected) {
		if (menuSelected === "shop") {
			return products.map((item) => <ShopCard key={item.id} product={item} />);
		}
	}

	return (
		<React.Fragment>
			<div className={`${styles.site_box} ${styles.flexCol}`}>
				<div className={`${styles.flex} ${styles.nav_bar_box}`}>
					<h2 className={`${styles.business_name}`}>{subdomain}</h2>
					<IconButton>
						<MenuOutlinedIcon />
					</IconButton>
				</div>
				<div className={`${styles.flex} ${styles.header_box}`}>
					<Image
						src={gar_img}
						alt={`${subdomain} logo`}
						className={`${styles.business_logo}`}
						priority={true}
					/>
					<div className={`${styles.business_bio_box} ${styles.flexCol}`}>
						<p>
							The best bakery you're find in town. Contact us for customer
							orders, or select your favorite baked goods.
						</p>
						<div className={`${styles.flex} ${styles.socials_box}`}>
							<IconButton>
								<FacebookIcon
									fontSize="medium"
									sx={{ color: "var(--gray-light-med)" }}
								/>
							</IconButton>
							<IconButton>
								<InstagramIcon
									fontSize="medium"
									sx={{ color: "var(--gray-light-med)" }}
								/>
							</IconButton>
							<IconButton>
								<YouTubeIcon
									fontSize="medium"
									sx={{ color: "var(--gray-light-med)" }}
								/>
							</IconButton>
						</div>
					</div>
				</div>
				<div className={`${styles.header_sub_button_box} ${styles.flex}`}>
					<div className={`${styles.flexCol} ${styles.subscriber_count_box}`}>
						<p className={`${styles.sub_number}`}>10.3k</p>
						<p className={`${styles.sub_word}`}>Subscribers</p>
					</div>
					<button className={`${styles.btn} ${styles.subscribe_btn}`}>
						Subscribe
					</button>
					<button className={`${styles.btn} ${styles.contact_btn}`}>
						<EmailOutlinedIcon />
					</button>
				</div>

				<div className={`${styles.fulfillment_box} ${styles.flexCol}`}>
					<div className={`${styles.location_box} ${styles.flex}`}>
						<LocationOnIcon
							fontSize="medium"
							sx={{ color: "var(--secondary-light-med)" }}
						/>
						<p>Los Angeles, CA</p>
					</div>
					<div className={`${styles.tabs}`}>
						<input type="radio" id="radio-1" name="tabs" />
						<label className={`${styles.tab}`} htmlFor="radio-1">
							Delivery
						</label>
						<input type="radio" id="radio-2" name="tabs" />
						<label className={`${styles.tab}`} htmlFor="radio-2">
							Pickup
						</label>
						<span className={`${styles.glider}`}></span>
					</div>
					<div className={`${styles.date_box} ${styles.flex}`}>
						<p>Feb 23, 2023 @ 2:45 pm</p>
						<button>Change date</button>
					</div>
				</div>

				<StyledToggleButtonGroup
					value={alignment}
					color="primary"
					exclusive
					onChange={handleAlignment}
					aria-label="text alignment"
					className={`${styles.menu_icons_box} ${styles.flex}`}
				>
					<ToggleButton
						value="shop"
						aria-label="shop icon"
						className={`${styles.icon_box}`}
						onClick={setMenu}
						selected={menuSelected === "shop" ? true : false}
					>
						<StoreIcon />
					</ToggleButton>
					<ToggleButton
						value="gallery"
						aria-label="gallery icon"
						className={`${styles.icon_box}`}
						onClick={setMenu}
						selected={menuSelected === "gallery" ? true : false}
					>
						<GridOnIcon />
					</ToggleButton>
					<ToggleButton
						value="customize"
						aria-label="custom order icon"
						className={`${styles.icon_box}`}
						onClick={setMenu}
						selected={menuSelected === "customize" ? true : false}
					>
						<AddShoppingCartIcon />
					</ToggleButton>
				</StyledToggleButtonGroup>
				<div className={`${styles.display_menu_box} ${styles.flex}`}>
					{showMenuLayout(menuSelected)}
				</div>
			</div>
			{/* <p className={`${styles.boxcart_promo}`}>Powered by BoxCart</p> */}
			<Cart />
		</React.Fragment>
	);
}

export default Sites;

export async function getServerSideProps(context) {
	const { subdomain } = context.query;

	return {
		props: {
			subdomain,
		},
	};
}

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
	"& .MuiToggleButtonGroup-grouped": {
		border: 0,
		borderBottom: "1px solid var(--gray-light)",

		"&.Mui-selected": {
			borderBottom: "1px solid var(--secondary)",
		},
		"&:not(:first-of-type)": {
			borderRadius: theme.shape.borderRadius,
		},
		"&:first-of-type": {
			borderRadius: theme.shape.borderRadius,
		},
	},
}));
