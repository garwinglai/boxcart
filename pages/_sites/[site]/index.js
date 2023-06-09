import Cart from "@/components/storefront/cart";
import Gallery from "@/components/storefront/menus/Gallery";
import ShopMenu from "@/components/storefront/menus/ShopMenu";
import canlde_banner_temp from "@/public/images/temp/candle_banner.jpeg";
import candle_logo_temp from "@/public/images/temp/candle_logo_temp.jpeg";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import FacebookIcon from "@mui/icons-material/Facebook";
import GridOnIcon from "@mui/icons-material/GridOn";
import InstagramIcon from "@mui/icons-material/Instagram";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import StoreIcon from "@mui/icons-material/Store";
import VerifiedIcon from "@mui/icons-material/Verified";
import YouTubeIcon from "@mui/icons-material/YouTube";
import IconButton from "@mui/material/IconButton";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import React, { useState } from "react";
import styles from "../../../styles/site/site.module.css";
import ShopHeader from "@/components/storefront/ShopHeader";
import ShopLayout from "@/components/layouts/storefront/ShopLayout";
import AppLayout from "@/components/layouts/AppLayout";
import ShopBio from "@/components/storefront/ShopBio";
import ShopFulfillment from "@/components/storefront/ShopFulfillment";
import Divider from "@mui/material/Divider";
import ShopSearchBar from "@/components/layouts/storefront/ShopSearchBar";

function Sites({ site }) {
	const [alignment, setAlignment] = useState("");
	const [menuSelected, setmenuSelected] = useState("shop");

	// useEffect(() => {
	// 	router.push("https://www.home.boxcart.shop");
	// }, []);

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
			return <ShopMenu />;
		}

		if (menuSelected === "gallery") {
			return <Gallery />;
		}
	}

	return (
		<div className="pb-8">
			<ShopHeader isOwner={false} />
			<ShopBio isOwner={false} />
			<ShopFulfillment isOwner={false} />
			<div className="px-4">
				<Divider light />
			</div>
			<ShopSearchBar isOwner={false} />
			<ShopMenu isOwner={false} />
		</div>
	);
}
export default Sites;

Sites.getLayout = function getLayout(page) {
	return <ShopLayout>{page}</ShopLayout>;
};

export async function getServerSideProps(context) {
	const { site } = context.query;

	return {
		props: {
			site,
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
