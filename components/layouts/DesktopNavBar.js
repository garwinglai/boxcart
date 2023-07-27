import React, { useState } from "react";
import styles from "@/styles/components/layouts/desktop-navbar.module.css";
import Image from "next/image";
import candle_logo from "@/public/images/temp/candle_logo_temp.jpeg";
import Link from "next/link";
import List from "@mui/material/List";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import DeliveryDiningOutlinedIcon from "@mui/icons-material/DeliveryDiningOutlined";
import AddCardRoundedIcon from "@mui/icons-material/AddCardRounded";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import HistoryIcon from "@mui/icons-material/History";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import StoreIcon from "@mui/icons-material/Store";
import StarIcon from "@mui/icons-material/Star";
import SettingsIcon from "@mui/icons-material/Settings";
import SmsIcon from "@mui/icons-material/Sms";
import ContactEmergencyIcon from "@mui/icons-material/ContactEmergency";
import ButtonThird from "../global/buttons/ButtonThird";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { deleteLocalStorage } from "@/utils/clientStorage";
import { Divider } from "@mui/material";

function DesktopNavBar({ pageRoute }) {
  const [openStoreList, setOpenStoreList] = useState(
    pageRoute === "availability" ||
      pageRoute === "fulfillment" ||
      pageRoute === "payments"
      ? true
      : false
  );
  const [openOrderList, setOpenOrderList] = useState(
    pageRoute === "history" || pageRoute === "live" ? true : false
  );
  const [openInventoryList, setOpenInventoryList] = useState(
    pageRoute === "products" || pageRoute === "category" ? true : false
  );
  const [openCommList, setOpenCommList] = useState(
    pageRoute === "contacts" ||
      pageRoute === "chat" ||
      pageRoute === "comm-settings"
      ? true
      : false
  );
  const [openPremiumList, setOpenPremiumList] = useState(
    pageRoute === "membership" || pageRoute === "add-ons" ? true : false
  );

  const { push } = useRouter();

  const handleNestedStoreList = () => {
    setOpenStoreList((prev) => !prev);
  };

  const handleNestedOrderList = () => {
    setOpenOrderList((prev) => !prev);
  };

  const handleInventoryList = () => {
    setOpenInventoryList((prev) => !prev);
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
    deleteLocalStorage("checklist");
    deleteLocalStorage("isChecklistComplete");
    push("/auth/signin");
  };

  return (
    <div className={`${styles.navbar_box} ${styles.flexCol}`}>
      <div className={`${styles.navbar_header_group} ${styles.flexCol}`}>
        <Image
          alt="business logo"
          src={candle_logo}
          className={`${styles.avatar_image}`}
        />
        <h4>BoxCart</h4>

        <Link href="/account/my-shop">
          <ButtonThird
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
        <MenuItem onClick={handleNestedStoreList}>
          <ListItemIcon>
            <StoreIcon
              sx={{
                color: `${
                  pageRoute === "availability" ||
                  pageRoute === "fulfillment" ||
                  pageRoute === "payments"
                    ? "var(--third-dark)"
                    : "gray"
                }  `,
              }}
            />
          </ListItemIcon>
          <ListItemText
            primary="Store"
            sx={{
              color: `${
                pageRoute === "availability" ||
                pageRoute === "fulfillment" ||
                pageRoute === "payments"
                  ? "var(--third-dark)"
                  : "gray"
              }  `,
            }}
          />

          {openStoreList ? (
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
        <Collapse in={openStoreList} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: "16px" }}>
            <Link
              href="/account/my-shop/availability"
              className={`${styles.menu_link_group}`}
            >
              <MenuItem
                sx={{
                  backgroundColor: `${
                    pageRoute === "availability" && "var(--third-light-soft)"
                  }`,

                  borderRadius: `${pageRoute === "availability" && "4px"}`,
                }}
              >
                <ListItemIcon>
                  <CalendarTodayOutlinedIcon
                    fontSize="small"
                    sx={{
                      color: `${
                        pageRoute === "availability"
                          ? "var(--third-dark)"
                          : "gray"
                      }  `,
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={<p className="text-sm font-light">Availability</p>}
                  sx={{
                    color: `${
                      pageRoute === "availability"
                        ? "var(--third-dark)"
                        : "gray"
                    }  `,
                  }}
                />
              </MenuItem>
            </Link>
            <Link
              href="/account/my-shop/fulfillment"
              className={`${styles.menu_link_group}`}
            >
              <MenuItem
                sx={{
                  backgroundColor: `${
                    pageRoute === "fulfillment" && "var(--third-light-soft)"
                  }`,

                  borderRadius: `${pageRoute === "fulfillment" && "4px"}`,
                }}
              >
                <ListItemIcon>
                  <DeliveryDiningOutlinedIcon
                    fontSize="small"
                    sx={{
                      color: `${
                        pageRoute === "fulfillment"
                          ? "var(--third-dark)"
                          : "gray"
                      }  `,
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={<p className="text-sm font-light">Fulfillment</p>}
                  sx={{
                    color: `${
                      pageRoute === "fulfillment" ? "var(--third-dark)" : "gray"
                    }  `,
                  }}
                />
              </MenuItem>
            </Link>
            <Link
              href="/account/my-shop/payments"
              className={`${styles.menu_link_group}`}
            >
              <MenuItem
                sx={{
                  backgroundColor: `${
                    pageRoute === "payments" && "var(--third-light-soft)"
                  }`,

                  borderRadius: `${pageRoute === "payments" && "4px"}`,
                }}
              >
                <ListItemIcon>
                  <AddCardRoundedIcon
                    fontSize="small"
                    sx={{
                      color: `${
                        pageRoute === "payments" ? "var(--third-dark)" : "gray"
                      }  `,
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={<p className="text-sm font-light">Payments</p>}
                  sx={{
                    color: `${
                      pageRoute === "payments" ? "var(--third-dark)" : "gray"
                    }  `,
                  }}
                />
              </MenuItem>
            </Link>
          </List>
        </Collapse>

        <MenuItem onClick={handleNestedOrderList}>
          <ListItemIcon>
            <LocalGroceryStoreIcon
              sx={{
                color: `${
                  pageRoute === "live" || pageRoute === "history"
                    ? "var(--third-dark)"
                    : "gray"
                }  `,
              }}
            />
          </ListItemIcon>
          <ListItemText
            primary="Orders"
            sx={{
              color: `${
                pageRoute === "live" || pageRoute === "history"
                  ? "var(--third-dark)"
                  : "gray"
              }  `,
            }}
          />
          {openOrderList ? (
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
        <Collapse in={openOrderList} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: "16px" }}>
            <Link
              href="/account/orders/live"
              className={`${styles.menu_link_group}`}
            >
              <MenuItem
                sx={{
                  backgroundColor: `${
                    pageRoute === "live" && "var(--third-light-soft)"
                  }`,

                  borderRadius: `${pageRoute === "live" && "4px"}`,
                }}
              >
                <ListItemIcon>
                  <LocalOfferOutlinedIcon
                    fontSize="small"
                    sx={{
                      color: `${
                        pageRoute === "live" ? "var(--third-dark)" : "gray"
                      }  `,
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={<p className="text-sm font-light">Live</p>}
                  sx={{
                    color: `${
                      pageRoute === "live" ? "var(--third-dark)" : "gray"
                    }  `,
                  }}
                />
              </MenuItem>
            </Link>
            <Link
              href="/account/orders/history"
              className={`${styles.menu_link_group}`}
            >
              <MenuItem
                sx={{
                  backgroundColor: `${
                    pageRoute === "history" && "var(--third-light-soft)"
                  }`,

                  borderRadius: `${pageRoute === "history" && "4px"}`,
                }}
              >
                <ListItemIcon>
                  <HistoryIcon
                    fontSize="small"
                    sx={{
                      color: `${
                        pageRoute === "history" ? "var(--third-dark)" : "gray"
                      }  `,
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={<p className="text-sm font-light">History</p>}
                  sx={{
                    color: `${
                      pageRoute === "history" ? "var(--third-dark)" : "gray"
                    }  `,
                  }}
                />
              </MenuItem>
            </Link>
          </List>
        </Collapse>

        <Link
          href="/account/inventory/products"
          className={`${styles.menu_link_group}`}
        >
          <MenuItem
            sx={{
              backgroundColor: `${
                (pageRoute === "products" || pageRoute === "category") &&
                "var(--third-light-soft)"
              }`,

              borderRadius: `${pageRoute === "chat" && "4px"}`,
            }}
          >
            <ListItemIcon>
              <InventoryIcon
                sx={{
                  color: `${
                    pageRoute === "products" || pageRoute === "category"
                      ? "var(--third-dark)"
                      : "gray"
                  }  `,
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary="Inventory"
              sx={{
                color: `${
                  pageRoute === "products" || pageRoute === "category"
                    ? "var(--third-dark)"
                    : "gray"
                }  `,
              }}
            />
          </MenuItem>
        </Link>

        <Link href="/account/chat" className={`${styles.menu_link_group}`}>
          <MenuItem
            sx={{
              backgroundColor: `${
                pageRoute === "chat" && "var(--third-light-soft)"
              }`,

              borderRadius: `${pageRoute === "chat" && "4px"}`,
            }}
          >
            <ListItemIcon>
              <SmsIcon
                sx={{
                  color: `${
                    pageRoute === "chat" ? "var(--third-dark)" : "gray"
                  }  `,
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary="Chat"
              sx={{
                color: `${
                  pageRoute === "chat" ? "var(--third-dark)" : "gray"
                }  `,
              }}
            />
          </MenuItem>
        </Link>
        {/* 
        <Link href="/account/contacts" className={`${styles.menu_link_group}`}>
          <MenuItem
            sx={{
              backgroundColor: `${
                pageRoute === "contacts" && "var(--third-light-soft)"
              }`,

              borderRadius: `${pageRoute === "contacts" && "4px"}`,
            }}
          >
            <ListItemIcon>
              <ContactEmergencyIcon
                sx={{
                  color: `${
                    pageRoute === "contacts" ? "var(--third-dark)" : "gray"
                  }  `,
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary="Contacts"
              sx={{
                color: `${
                  pageRoute === "contacts" ? "var(--third-dark)" : "gray"
                }  `,
              }}
            />
          </MenuItem>
        </Link> */}
        <Divider sx={{ marginTop: "1rem", marginBottom: "1rem" }} />
        <MenuItem onClick={handleNestedPremiumList}>
          <ListItemIcon>
            <StarIcon
              sx={{
                color: `${
                  pageRoute === "membership" || pageRoute === "add-ons"
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
                pageRoute === "membership" || pageRoute === "add-ons"
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
            >
              <MenuItem
                sx={{
                  backgroundColor: `${
                    pageRoute === "membership" && "var(--third-light-soft)"
                  }`,

                  borderRadius: `${pageRoute === "membership" && "4px"}`,
                }}
              >
                <ListItemIcon>
                  <CardMembershipIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={<p className="text-sm font-light">Membership</p>}
                  sx={{
                    color: `${
                      pageRoute === "membership" ? "var(--third-dark)" : "gray"
                    }  `,
                  }}
                />
              </MenuItem>
            </Link>
            {/* <Link
							href="/account/premium/add-ons"
							className={`${styles.menu_link_group}`}
						>
							<MenuItem
								sx={{
									backgroundColor: `${
										pageRoute === "add-ons" && "var(--third-light-soft)"
									}`,

									borderRadius: `${pageRoute === "add-ons" && "4px"}`,
								}}
							>
								<ListItemIcon>
									<AddIcon fontSize="small" />
								</ListItemIcon>
								<ListItemText
									primary={<p className="text-sm font-light">Add ons</p>}
									sx={{
										color: `${
											pageRoute === "add-ons" ? "var(--third-dark)" : "gray"
										}  `,
									}}
								/>
							</MenuItem>
						</Link> */}
          </List>
        </Collapse>

        <Link href="/account/settings" className={`${styles.menu_link_group}`}>
          <MenuItem
            sx={{
              backgroundColor: `${
                pageRoute === "account-settings" && "var(--third-light-soft)"
              }`,

              borderRadius: `${pageRoute === "account-settings" && "4px"}`,
            }}
          >
            <ListItemIcon>
              <SettingsIcon
                sx={{
                  color: `${
                    pageRoute === "account-settings"
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
                  pageRoute === "account-settings"
                    ? "var(--third-dark)"
                    : "gray"
                }  `,
              }}
            />
          </MenuItem>
        </Link>
        <Link href="/account/newsroom" className={`${styles.menu_link_group}`}>
          <MenuItem
            sx={{
              backgroundColor: `${
                pageRoute === "news-room" && "var(--third-light-soft)"
              }`,

              borderRadius: `${pageRoute === "news-room" && "4px"}`,
            }}
          >
            <ListItemIcon>
              <NewspaperIcon
                sx={{
                  color: `${
                    pageRoute === "news-room" ? "var(--third-dark)" : "gray"
                  }  `,
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary="Newsroom"
              sx={{
                color: `${
                  pageRoute === "news-room" ? "var(--third-dark)" : "gray"
                }  `,
              }}
            />
          </MenuItem>
        </Link>
      </List>
      <div className={`${styles.navbar_footer_group}`}>
        <Link href="/account/my-shop/share">
          <MenuItem>
            <ListItemIcon>
              <ShareOutlinedIcon />
            </ListItemIcon>
            <ListItemText
              primary="Share store"
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
      </div>
    </div>
  );
}

export default DesktopNavBar;
