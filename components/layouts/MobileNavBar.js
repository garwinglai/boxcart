import React, { useState, useEffect } from "react";
import styles from "@/styles/components/layouts/mobile-navbar.module.css";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import StarPurple500Icon from "@mui/icons-material/StarPurple500";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Image from "next/image";
import Link from "next/link";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ButtonThird from "../global/buttons/ButtonThird";
import StorefrontIcon from "@mui/icons-material/Storefront";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { deleteLocalStorage } from "@/utils/clientStorage";
import { useAccountStore } from "@/lib/store";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/firebase/fireConfig";

function MobileNavBar({ toggleDrawer, mobilePageRoute }) {
  const account = useAccountStore((state) => state.account);
  const removeAccount = useAccountStore((state) => state.removeAccount);

  const [openStoreList, setOpenStoreList] = useState(
    mobilePageRoute === "profile" ||
      mobilePageRoute === "products" ||
      mobilePageRoute === "category" ||
      mobilePageRoute === "availability" ||
      mobilePageRoute === "fulfillment" ||
      mobilePageRoute === "payments"
      ? true
      : false
  );
  const [openOrderList, setOpenOrderList] = useState(
    mobilePageRoute === "history" || mobilePageRoute === "live" ? true : false
  );
  const [openCommList, setOpenCommList] = useState(
    mobilePageRoute === "contacts" ||
      mobilePageRoute === "chat" ||
      mobilePageRoute === "comm-settings"
      ? true
      : false
  );
  const [openPremiumList, setOpenPremiumList] = useState(
    mobilePageRoute === "membership" || mobilePageRoute === "add-ons"
      ? true
      : false
  );
  const [logoImage, setLogoImage] = useState(null);

  const { push } = useRouter();

  useEffect(() => {
    const { logoImg } = account;

    setLogoImage(logoImg);
  }, [account]);

  const handleNestedStoreList = () => {
    setOpenStoreList((prev) => !prev);
  };

  const handleNestedOrderList = () => {
    setOpenOrderList((prev) => !prev);
  };

  const handleNestedCommList = () => {
    setOpenCommList((prev) => !prev);
  };

  const handleNestedPremiumList = () => {
    setOpenPremiumList((prev) => !prev);
  };

  const handleLogOut = async () => {
    await signOut({
      redirect: false,
    });

    removeAccount();
    deleteLocalStorage("checklist");
    deleteLocalStorage("isChecklistComplete");
    push("/auth/signin");
  };

  return (
    <div className={`${styles.mobile_nav_box} ${styles.flexCol}`}>
      <div className={`${styles.navbar_header_group} ${styles.flexCol}`}>
        {logoImage ? (
          <div className="w-28 h-28 relative">
            <Image
              src={logoImage}
              alt="logo icon"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              fill
              className="bg-white object-contain rounded-full border border-gray-300 shadow-md "
            />
          </div>
        ) : (
          <div className="rounded-full w-28 h-28 bg-[color:var(--gray-light)] flex justify-center items-center border text-[color:var(--gray-text)] text-center">
            Logo
          </div>
        )}
        <h3>BoxCart</h3>

        <Link href="/account/my-shop" className="mt-2">
          <ButtonThird
            handleClick={toggleDrawer("right", false)}
            icon={<StorefrontIcon fontSize="small" />}
            name="My Shop"
          />
        </Link>
      </div>
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        className={`${styles.menu_list_group}`}
        sx={{ padding: "1rem" }}
      >
        {/* <Link
          href="/account/contacts"
          className={`${styles.menu_link_group}`}
          onClick={toggleDrawer("right", false)}
        >
          <MenuItem
            sx={{
              backgroundColor: `${
                mobilePageRoute === "contacts" && "var(--third-light-soft)"
              }`,

              borderRadius: `${mobilePageRoute === "contacts" && "4px"}`,
            }}
          >
            <ListItemIcon>
              <ContactEmergencyOutlinedIcon
                sx={{
                  color: `${
                    mobilePageRoute === "contacts"
                      ? "var(--third-dark)"
                      : "gray"
                  }  `,
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary="Contacts"
              sx={{
                color: `${
                  mobilePageRoute === "contacts" ? "var(--third-dark)" : "gray"
                }  `,
              }}
            />
          </MenuItem>
        </Link> */}

        <MenuItem onClick={handleNestedPremiumList}>
          <ListItemIcon>
            <StarPurple500Icon
              sx={{
                color: `${
                  mobilePageRoute === "membership" ||
                  mobilePageRoute === "add-ons"
                    ? "var(--third-dark)"
                    : "gray"
                }  `,
              }}
            />
          </ListItemIcon>
          <ListItemText
            primary="Premium"
            sx={{
              color: `${
                mobilePageRoute === "membership" ||
                mobilePageRoute === "add-ons"
                  ? "var(--third-dark)"
                  : "gray"
              }  `,
            }}
          />
          {openPremiumList ? (
            <ExpandLess
              sx={{
                color: "var(--third-dark)",
              }}
            />
          ) : (
            <ExpandMore
              sx={{
                color: "gray",
              }}
            />
          )}
        </MenuItem>

        <Collapse in={openPremiumList} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: "16px" }}>
            <Link
              href="/account/premium/membership"
              className={`${styles.menu_link_group}`}
              onClick={toggleDrawer("right", false)}
            >
              <MenuItem
                sx={{
                  backgroundColor: `${
                    mobilePageRoute === "membership" &&
                    "var(--third-light-soft)"
                  }`,

                  borderRadius: `${mobilePageRoute === "membership" && "4px"}`,
                }}
              >
                <ListItemIcon>
                  <CardMembershipIcon
                    fontSize="small"
                    sx={{
                      color: `${
                        mobilePageRoute === "membership"
                          ? "var(--third-dark)"
                          : "gray"
                      }  `,
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={<p className="text-sm font-light">Membership</p>}
                  sx={{
                    color: `${
                      mobilePageRoute === "membership"
                        ? "var(--third-dark)"
                        : "gray"
                    }  `,
                  }}
                />
              </MenuItem>
            </Link>
            {/* <Link
							href="/account/premium/add-ons"
							className={`${styles.menu_link_group}`}
							onClick={toggleDrawer("right", false)}
						>
							<MenuItem
								sx={{
									backgroundColor: `${
										mobilePageRoute === "add-ons" && "var(--third-light-soft)"
									}`,

									borderRadius: `${mobilePageRoute === "add-ons" && "4px"}`,
								}}
							>
								<ListItemIcon>
									<AddIcon
										fontSize="small"
										sx={{
											color: `${
												mobilePageRoute === "add-ons"
													? "var(--third-dark)"
													: "gray"
											}  `,
										}}
									/>
								</ListItemIcon>
								<ListItemText
									primary={<p className="text-sm font-light">Add ons</p>}
									sx={{
										color: `${
											mobilePageRoute === "add-ons"
												? "var(--third-dark)"
												: "gray"
										}  `,
									}}
								/>
							</MenuItem>
						</Link> */}
          </List>
        </Collapse>

        <Link
          href="/account/settings"
          className={`${styles.menu_link_group}`}
          onClick={toggleDrawer("right", false)}
        >
          <MenuItem
            sx={{
              backgroundColor: `${
                mobilePageRoute === "account-settings" &&
                "var(--third-light-soft)"
              }`,

              borderRadius: `${
                mobilePageRoute === "account-settings" && "4px"
              }`,
            }}
          >
            <ListItemIcon>
              <SettingsOutlinedIcon
                sx={{
                  color: `${
                    mobilePageRoute === "account-settings"
                      ? "var(--third-dark)"
                      : "gray"
                  }  `,
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary="Settings"
              sx={{
                color: `${
                  mobilePageRoute === "account-settings"
                    ? "var(--third-dark)"
                    : "gray"
                }  `,
              }}
            />
          </MenuItem>
        </Link>
        <Link
          href="/account/newsroom"
          className={`${styles.menu_link_group}`}
          onClick={toggleDrawer("right", false)}
        >
          <MenuItem
            sx={{
              backgroundColor: `${
                mobilePageRoute === "news-room" && "var(--third-light-soft)"
              }`,

              borderRadius: `${mobilePageRoute === "news-room" && "4px"}`,
            }}
          >
            <ListItemIcon>
              <NewspaperIcon
                sx={{
                  color: `${
                    mobilePageRoute === "news-room"
                      ? "var(--third-dark)"
                      : "gray"
                  }  `,
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary="Newsroom"
              sx={{
                color: `${
                  mobilePageRoute === "news-room" ? "var(--third-dark)" : "gray"
                }  `,
              }}
            />
          </MenuItem>
        </Link>
      </List>
      <div className={`${styles.navbar_footer_group}`}>
        <Link
          href="/account/my-shop/share"
          onClick={toggleDrawer("right", false)}
        >
          <MenuItem>
            <ListItemIcon>
              <ShareOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Share store" />
          </MenuItem>
        </Link>

        <MenuItem onClick={handleLogOut}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Log out" />
        </MenuItem>
      </div>
    </div>
  );
}

export default MobileNavBar;
