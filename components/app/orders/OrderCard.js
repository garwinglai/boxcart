import React, { useRef } from "react";
import styles from "@/styles/components/orders/order-card.module.css";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import TodayOutlinedIcon from "@mui/icons-material/TodayOutlined";
import { IconButton } from "@mui/material";
import CartItem from "../../storefront/cart/CartItem";
import ContactMailOutlinedIcon from "@mui/icons-material/ContactMailOutlined";
import OrderReview from "../../storefront/cart/OrderReview";
import OrderSubtotal from "../../storefront/cart/OrderSubtotal";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import HomeIcon from "@mui/icons-material/Home";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import Grid3x3Icon from "@mui/icons-material/Grid3x3";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import ButtonSecondary from "@/components/global/buttons/ButtonSecondary";
import ButtonFourth from "@/components/global/buttons/ButtonFourth";
import ButtonThird from "@/components/global/buttons/ButtonThird";

function OrderCard({ status, isDesktop, isBusiness, isOrderHistory }) {
  const [expanded, setExpanded] = React.useState(false);

  const cardRef = useRef(null);

  const handleChange = (e, panel) => {
    setExpanded((prev) => !prev);
  };

  const handleFooterCloseCard = (e, panel) => {
    setExpanded((prev) => !prev);
    const cardPositionY = cardRef.current.offsetTop;

    window.scroll(0, cardPositionY - 180);
    // cardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={cardRef} className={`${styles.card_box}`}>
      <div className={`${styles.card_summary_group}`}>
        <div className={`${styles.summary_header_group}`}>
          <p
            className={`${styles.status_text} ${
              status === "pending" ? styles.pending_text : styles.accepted_text
            }`}
          >
            {status}
          </p>
          <div className={`${styles.flex} ${styles.header_box}`}>
            <div className={`${styles.group_one}`}>
              <div className={`${styles.flex} ${styles.info_icon_group}`}>
                <ContactMailOutlinedIcon fontSize="small" color="disabled" />
                <p>Jessica Joe</p>
              </div>
              <div className={`${styles.flex} ${styles.info_icon_group}`}>
                <EmailOutlinedIcon fontSize="small" color="disabled" />
                <p>jessical@gmail.com</p>
              </div>
              <div className={`${styles.flex} ${styles.info_icon_group}`}>
                <LocalPhoneOutlinedIcon fontSize="small" color="disabled" />
                <p>123 123 1234</p>
              </div>
              <div className={`${styles.flex} ${styles.info_icon_group}`}>
                <DeliveryDiningIcon fontSize="small" color="disabled" />
                <p>Delivery</p>
              </div>
              <div className={`${styles.flex} ${styles.info_icon_group}`}>
                <HomeIcon fontSize="small" color="disabled" />
                <p>123 W Adams Blvd, Culver City CA 91039</p>
              </div>
            </div>
            <div className={`${styles.group_two}`}>
              <div className={`${styles.flex} ${styles.info_icon_group}`}>
                <SellOutlinedIcon fontSize="small" color="disabled" />
                <p>4 items</p>
              </div>
              <div className={`${styles.flex} ${styles.info_icon_group}`}>
                <PaidOutlinedIcon fontSize="small" color="disabled" />
                <p>$123.32</p>
              </div>
              <div className={`${styles.flex} ${styles.info_icon_group}`}>
                <TodayOutlinedIcon fontSize="small" color="disabled" />
                <p>Order date: 4/23/2023</p>
              </div>
              <div className={`${styles.flex} ${styles.info_icon_group}`}>
                <EventAvailableIcon fontSize="small" color="disabled" />
                <p>Order for: 4/31/2023</p>
              </div>
              <div className={`${styles.flex} ${styles.info_icon_group}`}>
                <Grid3x3Icon fontSize="small" color="disabled" />
                <p>Order Id: 2</p>
              </div>
            </div>
            {!isDesktop && (
              <div className={`${styles.group_three}`}>
                <IconButton
                  id="panel1"
                  name="panel1"
                  onClick={(e) => handleChange(e, "panel1")}
                >
                  {expanded ? (
                    <ExpandLessOutlinedIcon />
                  ) : (
                    <ExpandMoreOutlinedIcon />
                  )}
                </IconButton>
              </div>
            )}
          </div>
        </div>
        <div
          className={`${styles.card_details_group} ${
            (expanded || isDesktop) && styles.card_details_expanded
          }`}
        >
          <h3>Items:</h3>
          {/* <OrderReview /> */}
          <CartItem isDesktop={isDesktop} isBusiness={isBusiness} />
          <CartItem isDesktop={isDesktop} isBusiness={isBusiness} />
          <OrderSubtotal />
        </div>
        {!isOrderHistory && (
          <div className={`${styles.action_btn_group_expanded} ${styles.flex}`}>
            {expanded && (
              <div className={`${styles.group_three}`}>
                <IconButton onClick={(e) => handleFooterCloseCard(e, "panel1")}>
                  <ExpandLessOutlinedIcon />
                </IconButton>
              </div>
            )}
            <div className={`${styles.action_btn_group} ${styles.flex}`}>
              {status === "pending" && <ButtonSecondary name="Decline" />}
              {status === "pending" && <ButtonPrimary name="Accept" />}
              {/* Split */}
              {status === "accepted" && <ButtonFourth name="Cancel" />}
              {status === "accepted" && <ButtonThird name="Complete" />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderCard;
