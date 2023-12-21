import React from "react";
import Link from "next/link";
import List from "@mui/material/List";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LogoutIcon from "@mui/icons-material/Logout";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import SettingsIcon from "@mui/icons-material/Settings";
import { IconButton } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import SellIcon from "@mui/icons-material/Sell";
import CloseIcon from "@mui/icons-material/Close";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

function UserMenu({ pageRoute, isMobileView, handleCloseMenu }) {
  const { push } = useRouter();

  const handleLogOut = async () => {
    await signOut({ redirect: false });
    if (isMobileView) {
      handleCloseMenu();
    }
    push("/user/auth/signin");
  };

  return (
    <div className="flex flex-col border-r h-full relative w-full">
      {isMobileView && (
        <IconButton
          onClick={handleCloseMenu}
          sx={{ position: "absolute", top: "4px", right: "18px" }}
        >
          <CloseIcon />
        </IconButton>
      )}

      <div className="flex flex-col items-center gap-2 border-b py-8">
        <div>
          <Avatar {...stringAvatar("Garwing Lai")} />
        </div>
        <h4>👋 Hey Garwing</h4>
      </div>

      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        className="relative overflow-y-scroll h-full w-full"
        sx={{ padding: "1rem", width: "100%" }}
      >
        <Link
          href="/user/account/dashboard"
          onClick={isMobileView && handleCloseMenu}
        >
          <MenuItem
            sx={{
              backgroundColor: `${
                pageRoute === "dashboard" && "var(--secondary-light)"
              }`,
              borderRadius: `${pageRoute === "dashboard" && "4px"}`,
            }}
          >
            <ListItemIcon>
              <InventoryIcon
                sx={{
                  color: `${
                    pageRoute === "dashboard" ? "var(--secondary-dark)" : "gray"
                  }  `,
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary="Dashboard"
              sx={{
                color: `${
                  pageRoute === "dashboard" ? "var(--secondary-dark)" : "gray"
                }  `,
              }}
            />
          </MenuItem>
        </Link>
        <Link
          href="/user/account/orders"
          onClick={isMobileView && handleCloseMenu}
        >
          <MenuItem
            sx={{
              backgroundColor: `${
                pageRoute === "orders" && "var(--secondary-light)"
              }`,
              borderRadius: `${pageRoute === "orders" && "4px"}`,
            }}
          >
            <ListItemIcon>
              <SellIcon
                sx={{
                  color: `${
                    pageRoute === "orders" ? "var(--secondary-dark)" : "gray"
                  }  `,
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary="Orders"
              sx={{
                color: `${
                  pageRoute === "orders" ? "var(--secondary-dark)" : "gray"
                }  `,
              }}
            />
          </MenuItem>
        </Link>
        <Link
          href="/user/account/wishlist"
          onClick={isMobileView && handleCloseMenu}
        >
          <MenuItem
            sx={{
              backgroundColor: `${
                pageRoute === "wishlist" && "var(--secondary-light)"
              }`,
              borderRadius: `${pageRoute === "wishlist" && "4px"}`,
            }}
          >
            <ListItemIcon>
              <FolderSpecialIcon
                sx={{
                  color: `${
                    pageRoute === "wishlist" ? "var(--secondary-dark)" : "gray"
                  }  `,
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary="Wishlist"
              sx={{
                color: `${
                  pageRoute === "wishlist" ? "var(--secondary-dark)" : "gray"
                }  `,
              }}
            />
          </MenuItem>
        </Link>
        {/* <Link
          href="/user/account/likes"
          onClick={isMobileView && handleCloseMenu}
        >
          <MenuItem
            sx={{
              backgroundColor: `${
                pageRoute === "likes" && "var(--secondary-light)"
              }`,
              borderRadius: `${pageRoute === "likes" && "4px"}`,
            }}
          >
            <ListItemIcon>
              <FavoriteIcon
                sx={{
                  color: `${
                    pageRoute === "likes" ? "var(--secondary-dark)" : "gray"
                  }  `,
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary="Likes"
              sx={{
                color: `${
                  pageRoute === "likes" ? "var(--secondary-dark)" : "gray"
                }  `,
              }}
            />
          </MenuItem>
        </Link> */}
        <Link
          href="/user/account/subs"
          onClick={isMobileView && handleCloseMenu}
        >
          <MenuItem
            sx={{
              backgroundColor: `${
                pageRoute === "subs" && "var(--secondary-light)"
              }`,
              borderRadius: `${pageRoute === "subs" && "4px"}`,
            }}
          >
            <ListItemIcon>
              <SubscriptionsIcon
                sx={{
                  color: `${
                    pageRoute === "subs" ? "var(--secondary-dark)" : "gray"
                  }  `,
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary="Subs"
              sx={{
                color: `${
                  pageRoute === "subs" ? "var(--secondary-dark)" : "gray"
                }  `,
              }}
            />
          </MenuItem>
        </Link>
        {/* <Link
          href="/user/account/reviews"
          onClick={isMobileView && handleCloseMenu}
        >
          <MenuItem
            sx={{
              backgroundColor: `${
                pageRoute === "reviews" && "var(--secondary-light)"
              }`,
              borderRadius: `${pageRoute === "reviews" && "4px"}`,
            }}
          >
            <ListItemIcon>
              <InventoryIcon
                sx={{
                  color: `${
                    pageRoute === "reviews" ? "var(--secondary-dark)" : "gray"
                  }  `,
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary="Reviews"
              sx={{
                color: `${
                  pageRoute === "reviews" ? "var(--secondary-dark)" : "gray"
                }  `,
              }}
            />
          </MenuItem>
        </Link> */}
        <Link
          href="/user/account/cart"
          onClick={isMobileView && handleCloseMenu}
        >
          <MenuItem
            sx={{
              backgroundColor: `${
                pageRoute === "cart" && "var(--secondary-light)"
              }`,
              borderRadius: `${pageRoute === "cart" && "4px"}`,
            }}
          >
            <ListItemIcon>
              <LocalGroceryStoreIcon
                sx={{
                  color: `${
                    pageRoute === "cart" ? "var(--secondary-dark)" : "gray"
                  }  `,
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary="Cart"
              sx={{
                color: `${
                  pageRoute === "cart" ? "var(--secondary-dark)" : "gray"
                }  `,
              }}
            />
          </MenuItem>
        </Link>
        <Link
          href="/user/account/settings"
          className=""
          onClick={isMobileView && handleCloseMenu}
        >
          <MenuItem
            sx={{
              backgroundColor: `${
                pageRoute === "user-settings" && "var(--secondary-light)"
              }`,

              borderRadius: `${pageRoute === "user-settings" && "4px"}`,
            }}
          >
            <ListItemIcon>
              <SettingsIcon
                sx={{
                  color: `${
                    pageRoute === "user-settings"
                      ? "var(--secondary-dark)"
                      : "gray"
                  }  `,
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary="Settings"
              sx={{
                color: `${
                  pageRoute === "user-settings"
                    ? "var(--secondary-dark)"
                    : "gray"
                }  `,
              }}
            />
          </MenuItem>
        </Link>
      </List>
      <div className="mt-auto w-full border-t">
        <List sx={{ padding: "1rem" }}>
          <Link
            href="/user/account/referral"
            onClick={isMobileView && handleCloseMenu}
          >
            <MenuItem
              sx={{
                backgroundColor: `${
                  pageRoute === "referral" && "var(--secondary-light)"
                }`,

                borderRadius: `${pageRoute === "referral" && "4px"}`,
              }}
            >
              <ListItemIcon>
                <ShareOutlinedIcon />
              </ListItemIcon>
              <ListItemText
                primary="Referral"
                sx={{ color: "var(--black-design-extralight)" }}
              />
            </MenuItem>
          </Link>

          <MenuItem onClick={handleLogOut}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Log out"
              sx={{ color: "var(--black-design-extralight)" }}
            />
          </MenuItem>
        </List>
      </div>
      {isMobileView && (
        <p className="absolute bottom-0 right-0 p-2 text-xs text-gray-500">
          Powered by Beavr
        </p>
      )}
    </div>
  );
}

export default UserMenu;
