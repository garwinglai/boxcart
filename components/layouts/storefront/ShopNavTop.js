import React, { useState } from "react";
import Badge from "@mui/material/Badge";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import CartDrawer from "@/components/storefront/cart/CartDrawer";
import { useRouter } from "next/router";
import Link from "next/link";

function ShopNavTop() {
	const [anchor, setAnchor] = useState("right");
	const [isCartOpenRight, setIsCartOpenRight] = useState(false);

	const { push, pathname, query, asPath } = useRouter();
	const { site } = query;

	function toggleDrawerRight() {
		setIsCartOpenRight((prev) => !prev);
		setAnchor("right");
	}

	const handleDesktopCartClick = (e) => {
		if (asPath === "/") return;

		push("/");
	};

	return (
		<nav className="flex justify-between py-2 px-4 items-center sticky top-0 bg-[color:var(--white)] border-b border-[color:var(--gray-light)] z-20 shadow-md">
			<Link href="/" className="text-[color:var(--black-design)] font-medium">BoxCart</Link>
			<div className="lg:hidden">
				<IconButton onClick={toggleDrawerRight} sx={{ marginRight: "1rem" }}>
					<StyledBadge badgeContent={4} color="warning" fontSize="small">
						<ShoppingCartOutlinedIcon
							sx={{ color: "var(--black-design-extralight)" }}
							fontSize="small"
						/>
					</StyledBadge>
				</IconButton>
				<CartDrawer
					toggleDrawer={toggleDrawerRight}
					anchor={anchor}
					isCartOpenRight={isCartOpenRight}
				/>
			</div>
			<div className="hidden lg:block">
				<IconButton
					onClick={handleDesktopCartClick}
					sx={{ marginRight: "1rem" }}
				>
					<StyledBadge badgeContent={4} color="warning" fontSize="small">
						<ShoppingCartOutlinedIcon
							sx={{ color: "var(--black-design-extralight)" }}
							fontSize="small"
						/>
					</StyledBadge>
				</IconButton>
			</div>
		</nav>
	);
}

export default ShopNavTop;

const StyledBadge = styled(Badge)(({ theme }) => ({
	"& .MuiBadge-badge": {
		right: -6,
		top: 8,
		border: `2px solid ${theme.palette.background.paper}`,
		padding: "0 4px",
	},
}));