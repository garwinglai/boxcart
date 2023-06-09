import React from "react";
import Badge from "@mui/material/Badge";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";

function ShopNavTop() {
	return (
		<nav className="flex justify-between p-2 items-center sticky top-0 bg-[color:var(--white)] border-b border-[color:var(--gray-light)] z-10 shadow-md">
			<h3 className="text-[color:var(--black-design)] ">BoxCart</h3>
			<IconButton
				sx={{ backgroundColor: "var(--gray-light)", marginRight: "1rem" }}
			>
				<StyledBadge badgeContent={4} color="primary" fontSize="small">
					<ShoppingCartOutlinedIcon
						sx={{ color: "var(--black-design-extralight)" }}
						fontSize="small"
					/>
				</StyledBadge>
			</IconButton>
		</nav>
	);
}

export default ShopNavTop;

const StyledBadge = styled(Badge)(({ theme }) => ({
	"& .MuiBadge-badge": {
		right: -6,
		top: 11,
		border: `2px solid ${theme.palette.background.paper}`,
		padding: "0 4px",
	},
}));
