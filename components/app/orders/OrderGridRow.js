import React from "react";
import styles from "@/styles/components/orders/order-grid-row.module.css";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { IconButton } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import OrderCard from "./OrderCard";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import order_icon from "@/public/images/icons/order_icon.png";
import Image from "next/image";
import ButtonSecondary from "@/components/global/buttons/ButtonSecondary";
import ButtonFourth from "@/components/global/buttons/ButtonFourth";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import ButtonThird from "@/components/global/buttons/ButtonThird";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

const orderStatus = "pending";

function OrderGridRow({ status }) {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const handleRowClick = () => {
    toggleDrawer("right", true);
  };

  const handleAction = () => {};

  return (
    <tr className={`${styles.table_row}`}>
      <td
        className={`${styles.table_data}`}
        onClick={toggleDrawer("right", true)}
      >
        <p className="text-xs">2130913</p>
      </td>
      <td
        className={`${styles.table_data}`}
        onClick={toggleDrawer("right", true)}
      >
        <p className="text-xs">4.23.2023</p>
      </td>
      <td
        className={`${styles.table_data}`}
        onClick={toggleDrawer("right", true)}
      >
        <p className="text-xs">5.23.2023</p>
      </td>
      <td
        className={`${styles.table_data} ${styles.black_text}`}
        onClick={toggleDrawer("right", true)}
      >
        <p className="text-xs">Jessica Joe</p>
      </td>
      <td
        className={`${styles.table_data}`}
        onClick={toggleDrawer("right", true)}
      >
        <p className="text-xs">4 Items</p>
      </td>
      <td
        className={`${styles.table_data} ${styles.black_text}`}
        onClick={toggleDrawer("right", true)}
      >
        <p className="text-xs">$123.23</p>
      </td>
      <td
        className={`${styles.table_data}`}
        onClick={toggleDrawer("right", true)}
      >
        <p className="text-xs">Delivery</p>
      </td>
      <td className={`${styles.table_data} ${styles.action}`}>
        <Select
          size="small"
          color="warning"
          autoWidth
          id="select-order-status"
          // variant="standard"
          sx={{
            boxShadow: "none",
            ".MuiOutlinedInput-notchedOutline": { border: 0 },
          }}
          value={orderStatus}
          // onChange={handleChangeOrderStatus}
        >
          <MenuItem value="pending">
            <div className={`${styles.pending_text}`}>
              <p>pending</p>
            </div>
          </MenuItem>
          <MenuItem value="completed">
            <div className={`${styles.completed_text}`}>
              <p>completed</p>
            </div>
          </MenuItem>
          <MenuItem value="canceled">
            <div className={`${styles.canceled_text}`}>
              <p>canceled</p>
            </div>
          </MenuItem>
        </Select>
      </td>
      <td className={`${styles.table_data} ${styles.view_more_btn}`}>
        <IconButton onClick={toggleDrawer("right", true)}>
          <OpenInFullIcon fontSize="small" color="disabled" />
        </IconButton>
        <Drawer
          anchor={"right"}
          open={state["right"]}
          onClose={toggleDrawer("right", false)}
        >
          <div className={`${styles.drawer_box}`}>
            <div className={`${styles.flex} ${styles.order_drawer_title_box}`}>
              <div
                className={`${styles.flex} ${styles.order_drawer_title_group}`}
              >
                <Image
                  src={order_icon}
                  alt="order detail icon"
                  className={`${styles.order_icon_image}`}
                />
                <h2>Order details:</h2>
              </div>
              <button
                className={`${styles.flex} ${styles.close_btn_group}`}
                onClick={toggleDrawer("right", false)}
              >
                <ChevronLeftIcon />
                <p>close</p>
              </button>
            </div>
            <OrderCard status="accepted" isDesktop={true} isBusiness={true} />
          </div>
        </Drawer>
      </td>
    </tr>
  );
}

export default OrderGridRow;

// * status buttons
// {status === "pending" && (
//   <div className="w-1/2">
//     <ButtonSecondary name="Decline" />
//   </div>
// )}
// {status === "pending" && (
//   <div className="w-1/2">
//     <ButtonPrimary name="Accept" />
//   </div>
// )}
// {/* Split */}
// {status === "accepted" && (
//   <div className="w-1/2">
//     <ButtonFourth name="Cancel" />
//   </div>
// )}
// {status === "accepted" && (
//   <div className="w-1/2">
//     <ButtonThird name="Complete" />
//   </div>
// )}
