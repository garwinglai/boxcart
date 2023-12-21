import React, { useState, useEffect } from "react";
import styles from "@/styles/components/layouts/desktop-navbar.module.css";
import Image from "next/image";
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
import LogoutIcon from "@mui/icons-material/Logout";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import DeliveryDiningOutlinedIcon from "@mui/icons-material/DeliveryDiningOutlined";
import AddCardRoundedIcon from "@mui/icons-material/AddCardRounded";
import HistoryIcon from "@mui/icons-material/History";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import StoreIcon from "@mui/icons-material/Store";
import StarIcon from "@mui/icons-material/Star";
import SettingsIcon from "@mui/icons-material/Settings";
import SmsIcon from "@mui/icons-material/Sms";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { deleteLocalStorage } from "@/utils/clientStorage";
import { Divider } from "@mui/material";
import { useAccountStore } from "@/lib/store";
import { useHasHydrated } from "@/utils/useHasHydrated";
import ButtonPrimary from "../global/buttons/ButtonPrimary";
import SavingsIcon from "@mui/icons-material/Savings";

function DesktopNavBar({ pageRoute }) {
  const hydrated = useHasHydrated();

  const account = useAccountStore((state) => state.account);
  const removeAccount = useAccountStore((state) => state.removeAccount);

  const { businessName } = account;

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
  const [openPromoList, setOpenPromoList] = useState(
    pageRoute === "gift-card" || pageRoute === "email-marketing" ? true : false
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

  const handleNestedPromoList = () => {
    setOpenPromoList((prev) => !prev);
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
    push("/app/auth/signin");
  };

  return (
    <div className={`${styles.navbar_box} ${styles.flexCol}`}>
      <div className={`${styles.navbar_header_group} ${styles.flexCol}`}>
        {logoImage ? (
          <div className="w-28 h-28 relative">
            <Image
              src={logoImage}
              alt="logo icon"
              // priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              fill
              className="object-contain rounded-full border border-gray-300 shadow-md bg-white"
            />
          </div>
        ) : (
          <div className="rounded-full w-28 h-28 bg-[color:var(--gray-light)] flex justify-center items-center border text-[color:var(--gray-text)] text-center">
            Logo
          </div>
        )}
        <h4>{hydrated && businessName}</h4>

        <Link href="/app/account/my-shop">
          <ButtonPrimary
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
                    ? "var(--primary-dark)"
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
                  ? "var(--primary-dark)"
                  : "gray"
              }  `,
            }}
          />

          {openStoreList ? (
            <ExpandLess
              sx={{
                color: "var(--primary-dark)",
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
              href="/app/account/my-shop/availability"
              className={`${styles.menu_link_group}`}
            >
              <MenuItem
                sx={{
                  backgroundColor: `${
                    pageRoute === "availability" && "var(--primary-light)"
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
                          ? "var(--primary-dark)"
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
                        ? "var(--primary-dark)"
                        : "gray"
                    }  `,
                  }}
                />
              </MenuItem>
            </Link>
            <Link
              href="/app/account/my-shop/fulfillment"
              className={`${styles.menu_link_group}`}
            >
              <MenuItem
                sx={{
                  backgroundColor: `${
                    pageRoute === "fulfillment" && "var(--primary-light)"
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
                          ? "var(--primary-dark)"
                          : "gray"
                      }  `,
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={<p className="text-sm font-light">Fulfillment</p>}
                  sx={{
                    color: `${
                      pageRoute === "fulfillment"
                        ? "var(--primary-dark)"
                        : "gray"
                    }  `,
                  }}
                />
              </MenuItem>
            </Link>
            <Link
              href="/app/account/my-shop/payments"
              className={`${styles.menu_link_group}`}
            >
              <MenuItem
                sx={{
                  backgroundColor: `${
                    pageRoute === "payments" && "var(--primary-light)"
                  }`,

                  borderRadius: `${pageRoute === "payments" && "4px"}`,
                }}
              >
                <ListItemIcon>
                  <AddCardRoundedIcon
                    fontSize="small"
                    sx={{
                      color: `${
                        pageRoute === "payments"
                          ? "var(--primary-dark)"
                          : "gray"
                      }  `,
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={<p className="text-sm font-light">Payments</p>}
                  sx={{
                    color: `${
                      pageRoute === "payments" ? "var(--primary-dark)" : "gray"
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
                    ? "var(--primary-dark)"
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
                  ? "var(--primary-dark)"
                  : "gray"
              }  `,
            }}
          />
          {openOrderList ? (
            <ExpandLess
              sx={{
                color: "var(--primary-dark)",
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
              href="/app/account/orders/live"
              className={`${styles.menu_link_group}`}
            >
              <MenuItem
                sx={{
                  backgroundColor: `${
                    pageRoute === "live" && "var(--primary-light)"
                  }`,

                  borderRadius: `${pageRoute === "live" && "4px"}`,
                }}
              >
                <ListItemIcon>
                  <LocalOfferOutlinedIcon
                    fontSize="small"
                    sx={{
                      color: `${
                        pageRoute === "live" ? "var(--primary-dark)" : "gray"
                      }  `,
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={<p className="text-sm font-light">Live</p>}
                  sx={{
                    color: `${
                      pageRoute === "live" ? "var(--primary-dark)" : "gray"
                    }  `,
                  }}
                />
              </MenuItem>
            </Link>
            <Link
              href="/app/account/orders/history"
              className={`${styles.menu_link_group}`}
            >
              <MenuItem
                sx={{
                  backgroundColor: `${
                    pageRoute === "history" && "var(--primary-light)"
                  }`,

                  borderRadius: `${pageRoute === "history" && "4px"}`,
                }}
              >
                <ListItemIcon>
                  <HistoryIcon
                    fontSize="small"
                    sx={{
                      color: `${
                        pageRoute === "history" ? "var(--primary-dark)" : "gray"
                      }  `,
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={<p className="text-sm font-light">History</p>}
                  sx={{
                    color: `${
                      pageRoute === "history" ? "var(--primary-dark)" : "gray"
                    }  `,
                  }}
                />
              </MenuItem>
            </Link>
          </List>
        </Collapse>

        <Link
          href="/app/account/inventory/products"
          className={`${styles.menu_link_group}`}
        >
          <MenuItem
            sx={{
              backgroundColor: `${
                (pageRoute === "products" || pageRoute === "category") &&
                "var(--primary-light)"
              }`,
              borderRadius: `${
                (pageRoute === "products" || pageRoute === "category") && "4px"
              }`,
            }}
          >
            <ListItemIcon>
              <InventoryIcon
                sx={{
                  color: `${
                    pageRoute === "products" || pageRoute === "category"
                      ? "var(--primary-dark)"
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
                    ? "var(--primary-dark)"
                    : "gray"
                }  `,
              }}
            />
          </MenuItem>
        </Link>

        <Link href="/app/account/chat" className={`${styles.menu_link_group}`}>
          <MenuItem
            sx={{
              backgroundColor: `${
                pageRoute === "chat" && "var(--primary-light)"
              }`,

              borderRadius: `${pageRoute === "chat" && "4px"}`,
            }}
          >
            <ListItemIcon>
              <SmsIcon
                sx={{
                  color: `${
                    pageRoute === "chat" ? "var(--primary-dark)" : "gray"
                  }  `,
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary="Chat"
              sx={{
                color: `${
                  pageRoute === "chat" ? "var(--primary-dark)" : "gray"
                }  `,
              }}
            />
          </MenuItem>
        </Link>
        <Link href="/app/account/revenue" className={`${styles.menu_link_group}`}>
          <MenuItem
            sx={{
              backgroundColor: `${
                pageRoute === "revenue" && "var(--primary-light)"
              }`,

              borderRadius: `${pageRoute === "revenue" && "4px"}`,
            }}
          >
            <ListItemIcon>
              <SavingsIcon
                sx={{
                  color: `${
                    pageRoute === "revenue" ? "var(--primary-dark)" : "gray"
                  }  `,
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary="Revenue"
              sx={{
                color: `${
                  pageRoute === "revenue" ? "var(--primary-dark)" : "gray"
                }  `,
              }}
            />
          </MenuItem>
        </Link>

        {/* <Link href="/app/account/contacts" className={`${styles.menu_link_group}`}>
          <MenuItem
            sx={{
              backgroundColor: `${
                pageRoute === "contacts" && "var(--primary-light)"
              }`,

              borderRadius: `${pageRoute === "contacts" && "4px"}`,
            }}
          >
            <ListItemIcon>
              <ContactEmergency
                sx={{
                  color: `${
                    pageRoute === "contacts" ? "var(--primary-dark)" : "gray"
                  }  `,
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary="Contacts"
              sx={{
                color: `${
                  pageRoute === "contacts" ? "var(--primary-dark)" : "gray"
                }  `,
              }}
            />
          </MenuItem>
        </Link> */}
        {/* <MenuItem onClick={handleNestedPromoList}>
          <ListItemIcon>
            <DiscountIcon
              sx={{
                color: `${
                  pageRoute === "gift-card" || pageRoute === "email-marketing"
                    ? "var(--primary-dark)"
                    : "gray"
                }  `,
              }}
            />
          </ListItemIcon>
          <ListItemText
            primary="Promotions"
            sx={{
              color: `${
                pageRoute === "gift-card" || pageRoute === "email-marketing"
                  ? "var(--primary-dark)"
                  : "gray"
              }  `,
            }}
          />
          {openPromoList ? (
            <ExpandLess
              sx={{
                color: "var(--primary-dark)",
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
        <Collapse in={openPromoList} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: "16px" }}>
            <Link
              href="/app/account/promotion/gift-card"
              className={`${styles.menu_link_group}`}
            >
              <MenuItem
                sx={{
                  backgroundColor: `${
                    pageRoute === "gift-card" && "var(--primary-light)"
                  }`,

                  borderRadius: `${pageRoute === "gift-card" && "4px"}`,
                }}
              >
                <ListItemIcon>
                  <CardGiftcardIcon
                    fontSize="small"
                    sx={{
                      color: `${
                        pageRoute === "gift-card"
                          ? "var(--primary-dark)"
                          : "gray"
                      }  `,
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={<p className="text-sm font-light">Gift card</p>}
                  sx={{
                    color: `${
                      pageRoute === "gift-card" ? "var(--primary-dark)" : "gray"
                    }  `,
                  }}
                />
              </MenuItem>
            </Link>
            <Link
              href="/app/account/promotion/email-marketing"
              className={`${styles.menu_link_group}`}
            >
              <MenuItem
                sx={{
                  backgroundColor: `${
                    pageRoute === "email-marketing" && "var(--primary-light)"
                  }`,

                  borderRadius: `${pageRoute === "email-marketing" && "4px"}`,
                }}
              >
                <ListItemIcon>
                  <ForwardToInboxIcon
                    fontSize="small"
                    sx={{
                      color: `${
                        pageRoute === "email-marketing"
                          ? "var(--primary-dark)"
                          : "gray"
                      }  `,
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <p className="text-sm font-light">Email marketing</p>
                  }
                  sx={{
                    color: `${
                      pageRoute === "email-marketing"
                        ? "var(--primary-dark)"
                        : "gray"
                    }  `,
                  }}
                />
              </MenuItem>
            </Link>
          </List>
        </Collapse> */}

        <Divider sx={{ marginTop: "1rem", marginBottom: "1rem" }} />
        <MenuItem onClick={handleNestedPremiumList}>
          <ListItemIcon>
            <StarIcon
              sx={{
                color: `${
                  pageRoute === "membership" || pageRoute === "add-ons"
                    ? "var(--primary-dark)"
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
                  ? "var(--primary-dark)"
                  : "gray"
              }  `,
            }}
          />
          {openPremiumList ? (
            <ExpandLess
              sx={{
                color: "var(--primary-dark)",
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
              href="/app/account/premium/membership"
              className={`${styles.menu_link_group}`}
            >
              <MenuItem
                sx={{
                  backgroundColor: `${
                    pageRoute === "membership" && "var(--primary-light)"
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
                      pageRoute === "membership"
                        ? "var(--primary-dark)"
                        : "gray"
                    }  `,
                  }}
                />
              </MenuItem>
            </Link>
            {/* <Link
							href="/app/account/premium/add-ons"
							className={`${styles.menu_link_group}`}
						>
							<MenuItem
								sx={{
									backgroundColor: `${
										pageRoute === "add-ons" && "var(--primary-light)"
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
											pageRoute === "add-ons" ? "var(--primary-dark)" : "gray"
										}  `,
									}}
								/>
							</MenuItem>
						</Link> */}
          </List>
        </Collapse>

        <Link href="/app/account/settings" className={`${styles.menu_link_group}`}>
          <MenuItem
            sx={{
              backgroundColor: `${
                pageRoute === "account-settings" && "var(--primary-light)"
              }`,

              borderRadius: `${pageRoute === "account-settings" && "4px"}`,
            }}
          >
            <ListItemIcon>
              <SettingsIcon
                sx={{
                  color: `${
                    pageRoute === "account-settings"
                      ? "var(--primary-dark)"
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
                    ? "var(--primary-dark)"
                    : "gray"
                }  `,
              }}
            />
          </MenuItem>
        </Link>
        <Link href="/app/account/newsroom" className={`${styles.menu_link_group}`}>
          <MenuItem
            sx={{
              backgroundColor: `${
                pageRoute === "news-room" && "var(--primary-light)"
              }`,

              borderRadius: `${pageRoute === "news-room" && "4px"}`,
            }}
          >
            <ListItemIcon>
              <NewspaperIcon
                sx={{
                  color: `${
                    pageRoute === "news-room" ? "var(--primary-dark)" : "gray"
                  }  `,
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary="Newsroom"
              sx={{
                color: `${
                  pageRoute === "news-room" ? "var(--primary-dark)" : "gray"
                }  `,
              }}
            />
          </MenuItem>
        </Link>
      </List>
      <div className={`${styles.navbar_footer_group}`}>
        <Link href="/app/account/my-shop/share">
          <MenuItem
            sx={{
              backgroundColor: `${
                pageRoute === "share-shop" && "var(--primary-light)"
              }`,

              borderRadius: `${pageRoute === "share-shop" && "4px"}`,
            }}
          >
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
