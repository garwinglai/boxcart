import React, { useState, useEffect } from "react";
import Badge from "@mui/material/Badge";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import CartDrawer from "@/components/storefront/cart/CartDrawer";
import { useRouter } from "next/router";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { getLocalStorage } from "@/utils/clientStorage";

function ShopNavTop() {
  const cart = useCartStore((state) => state.cart);

  const [anchor, setAnchor] = useState("right");
  const [isCartOpenRight, setIsCartOpenRight] = useState(false);
  const [cartLength, setCartLength] = useState(0);
  const [businessName, setBusinessName] = useState("");

  const { push, pathname, query, asPath } = useRouter();
  const { site } = query;

  useEffect(() => {
    setCartLength(cart.length);
    const businessName = getLocalStorage("businessName");
    setBusinessName(businessName);
  }, [cart, pathname]);

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
      <Link href="/" className="text-[color:var(--black-design)] font-medium">
        {businessName ? businessName : "Home"}
      </Link>
      <div className="">
        <IconButton onClick={toggleDrawerRight}>
          <StyledBadge
            badgeContent={cartLength}
            color="secondary"
            fontSize="small"
          >
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
      {/* <div className="hidden lg:block">
        <IconButton
          onClick={handleDesktopCartClick}
          // sx={{ marginRight: "1rem" }}
        >
          <StyledBadge
            badgeContent={cartLength}
            color="secondary"
            fontSize="small"
          >
            <ShoppingCartOutlinedIcon
              sx={{ color: "var(--black-design-extralight)" }}
              fontSize="small"
            />
          </StyledBadge>
        </IconButton>
      </div> */}
    </nav>
  );
}

export default ShopNavTop;

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -2,
    top: 0,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));
