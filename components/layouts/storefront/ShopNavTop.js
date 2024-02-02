import React, { useState, useEffect } from "react";
import Badge from "@mui/material/Badge";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import CartDrawer from "@/components/storefront/cart/CartDrawer";
import { useRouter } from "next/router";
import Link from "next/link";
import { useCartStore, useShopperStore } from "@/lib/store";
import { getLocalStorage } from "@/utils/clientStorage";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import Avatar from "@mui/material/Avatar";
import { useHasHydrated } from "@/utils/useHasHydrated";
import CredentialsModal from "@/components/user/auth/CredentialsModal";
import AccountPopup from "@/components/user/account/AccountPopup";
import { blue } from "@mui/material/colors";

function stringAvatar(name) {
  return {
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

function ShopNavTop() {
  const hydrated = useHasHydrated();
  // const cart = useCartStore((state) => state.cart);
  const shopper = useShopperStore((state) => state.shopperAccount);

  const [anchor, setAnchor] = useState("right");
  const [isCartOpenRight, setIsCartOpenRight] = useState(false);
  const [cartLength, setCartLength] = useState(0);
  const [businessName, setBusinessName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [popupAnchorElement, setPopupAnchorElement] = useState(null);

  const popupOpen = Boolean(popupAnchorElement);
  const anchorId = popupOpen ? "simple-popover" : undefined;

  const { pathname, query } = useRouter();
  const { site } = query;

  const cartStore = useCartStore((state) => {
    return state.store.find((store) => store.storeName === site);
  });

  const { cart } = cartStore || {};

  useEffect(() => {
    if (cart) {
      setCartLength(cart.length);
    }

    const businessName = getLocalStorage("businessName");
    setBusinessName(businessName);
  }, [cart, pathname]);

  const handleOpenAccountModal = (e) => setPopupAnchorElement(e.currentTarget);
  const handleCloseAccountModal = () => setPopupAnchorElement(null);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  function toggleDrawerRight() {
    setIsCartOpenRight((prev) => !prev);
    setAnchor("right");
  }

  return (
    <nav className="flex justify-between py-2 px-4 items-center sticky top-0 bg-[color:var(--white)] border-b border-[color:var(--gray-light)] z-20 shadow-md lg:px-28">
      <Link
        href={`/${site}`}
        className="text-[color:var(--black-design)] font-medium"
      >
        {businessName ? businessName : "Home"}
      </Link>
      <div className="flex gap-1 items-center">
        {/* {hydrated && !shopper ? (
          <div>
            <IconButton onClick={handleOpenModal}>
              <PermIdentityIcon />
            </IconButton>
            <CredentialsModal
              isModalOpen={isModalOpen}
              handleClose={handleCloseModal}
              handleOpenAccountModal={handleOpenAccountModal}
            />
          </div>
        ) : (
          <div>
            <IconButton
              aria-describedby={anchorId}
              onClick={handleOpenAccountModal}
            >
              {hydrated && (
                <Avatar
                  {...stringAvatar(shopper.name)}
                  sx={{
                    bgcolor: blue[300],
                    width: 24,
                    height: 24,
                    fontSize: 10,
                  }}
                />
              )}
            </IconButton>
            <AccountPopup
              isModalOpen={popupOpen}
              anchorEl={popupAnchorElement}
              anchorId={anchorId}
              handleClose={handleCloseAccountModal}
            />
          </div>
        )} */}

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
            query={query}
          />
        </div>
      </div>
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
