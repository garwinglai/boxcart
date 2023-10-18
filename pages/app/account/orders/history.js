import React, { useState } from "react";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AppLayout from "@/components/layouts/AppLayout";
import styles from "@/styles/app/account/orders/order-history.module.css";
import Calendar from "@/components/global/designs/Calendar";
import SearchBar from "@/components/global/designs/SearchBar";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TodayOutlinedIcon from "@mui/icons-material/TodayOutlined";
import OrderGridHistory from "@/components/app/orders/OrderGridHistory";
import ButtonFilter from "@/components/global/buttons/ButtonFilter";
import { isAuth } from "@/helper/client/auth/isAuth";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import prisma from "@/lib/prisma";

function AllOrders({ orders }) {
  const [snackbarValues, setSnackbarValues] = useState({
    snackbarOpen: false,
    snackbarMessage: "",
  });
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const [allHistoryOrders, setAllHistoryOrders] = useState(orders);
  const [errorLoadingOrders, setErrorLoadingOrders] = useState(
    orders ? false : true
  );

  const { snackbarOpen, snackbarMessage } = snackbarValues;

  const handleOpenSnackbar = (message) => {
    setSnackbarValues({ snackbarOpen: true, snackbarMessage: message });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarValues({ snackbarOpen: false, snackbarMessage: "" });
  };

  const getAllHistoryOrders = async () => {
    const orders = await fetch(`/api/private/orders/getAllHistoryOrders`);
    const allOrders = await orders.json();
    const responseStatus = orders.status;

    if (responseStatus === 200) {
      setAllHistoryOrders(allOrders);
    }

    if (responseStatus === 500) {
      setErrorLoadingOrders(true);
    }
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const errorLoadingView = () => {
    return (
      <div className="flex flex-col items-center justify-center mt-28">
        <p className="text-sm">Error loading orders... please refresh.</p>
      </div>
    );
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnackbar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  if (errorLoadingOrders) {
    return errorLoadingView();
  }

  return (
    <div className={`${styles.order_history_box}`}>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={action}
      />
      <SwipeableDrawer
        anchor={"right"}
        open={state["right"]}
        onClose={toggleDrawer("right", false)}
        onOpen={toggleDrawer("right", true)}
      >
        <div className={`${styles.calendar_box}`}>
          <div className={`${styles.flex} ${styles.calendar_header_group}`}>
            <h2>Calendar</h2>
            <p>🌚 = Orders</p>
          </div>
          <Calendar />
        </div>
      </SwipeableDrawer>

      {/* <div className={`${styles.search_group} ${styles.flex}`}>
        <SearchBar />
        <div className="w-fit ml-auto">
          <ButtonFilter
            name="Select Date"
            icon={<TodayOutlinedIcon fontSize="small" />}
          />
        </div>
        <div className={` ${styles.filter_box} ${styles.flex}`}>
          <div className="min-w-fit">
            <ButtonFilter name="View all" />
          </div>
          <div className="w-fit">
            <ButtonFilter name="Completed" />
          </div>
          <div className="w-fit">
            <ButtonFilter name="Canceled" />
          </div>
        </div>
      </div> */}
      {allHistoryOrders.length > 0 ? (
        <div className={`${styles.order_grid_box}`}>
          <OrderGridHistory
            orders={allHistoryOrders}
            getAllHistoryOrders={getAllHistoryOrders}
            handleOpenSnackbar={handleOpenSnackbar}
          />
        </div>
      ) : (
        <div className="flex justify-center mt-16">
          <p className="text-gray-600 font-light text-sm">No history...</p>
        </div>
      )}
    </div>
  );
}

export default AllOrders;

export async function getServerSideProps(context) {
  return isAuth(context, async (userSession) => {
    const { user, expires } = userSession;
    const { name, email, id } = user;

    let serializedData;

    try {
      const orders = await prisma.customerOrder.findMany({
        where: {
          accountId: id,
          orderStatus: { not: "pending" },
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          orderItems: {
            include: {
              orderOptionGroups: true,
              orderExampleImages: true,
              orderQuestionsAnswers: true,
            },
          },
          customer: true,
        },
      });

      serializedData = JSON.parse(JSON.stringify(orders));
      console.log(" server orders", serializedData);
    } catch (error) {
      console.log("serversideprops checklist error:", error);
      serializedData = null;
    }

    return {
      props: {
        orders: serializedData,
      },
    };
  });
}

AllOrders.getLayout = function getLayout(
  page,
  pageTitle,
  pageIcon,
  pageRoute,
  mobilePageRoute
) {
  return (
    <AppLayout
      pageTitle={pageTitle}
      pageIcon={pageIcon}
      pageRoute={pageRoute}
      mobilePageRoute={mobilePageRoute}
    >
      {page}
    </AppLayout>
  );
};

AllOrders.pageTitle = "Order History";
AllOrders.pageIcon = <FormatListBulletedIcon />;
AllOrders.pageRoute = "history";
AllOrders.mobilePageRoute = "history";
