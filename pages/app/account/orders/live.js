import React, { useState } from "react";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import AppLayout from "@/components/layouts/AppLayout";
import styles from "@/styles/app/account/orders/live-orders.module.css";
import Calendar from "@/components/global/designs/Calendar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import OrderCard from "@/components/app/orders/OrderCard";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import OrderGrid from "@/components/app/orders/OrderGrid";
import { isAuth } from "@/helper/client/auth/isAuth";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import prisma from "@/lib/prisma";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

function LiveOrders({ orders }) {
  console.log("orders client", orders);
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
  const [errorLoadingOrders, setErrorLoadingOrders] = useState(
    orders ? false : true
  );
  const [allOrders, setAllOrders] = useState(orders);

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

  const getOrders = async () => {
    const orders = await fetch(`/api/private/orders/getPendingOrders`);
    const allOrders = await orders.json();
    const responseStatus = orders.status;

    if (responseStatus === 200) {
      setAllOrders(allOrders);
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

  const mobileView = () => {
    return (
      <div className={`${styles.live_orders_box_mobile}`}>
        <SwipeableDrawer
          anchor={"bottom"}
          open={state["bottom"]}
          onClose={toggleDrawer("bottom", false)}
          onOpen={toggleDrawer("bottom", true)}
        >
          <div className={`${styles.calendar_box}`}>
            <div className={`${styles.flex} ${styles.calendar_header_group}`}>
              <h2>Calendar</h2>
              <p>🌚 = Orders</p>
            </div>
            <Calendar />
          </div>
        </SwipeableDrawer>
        <div className="flex items-center ml-4">
          <p className="text-xs">
            This page only shows pending orders. Completed orders are in
            history.
          </p>
          <div className="w-fit ml-auto px-4">
            <ButtonPrimary name="+ Create Order" />
          </div>
        </div>

        <div className={`${styles.incoming_orders_box}`}>
          <div className={`${styles.pending_box}`}>
            {allOrders.length > 0 ? (
              allOrders.map((order, idx) => {
                const { id, orderStatus, paymentStatus } = order;
                return (
                  <OrderCard
                    key={id}
                    status={orderStatus}
                    payStatus={paymentStatus}
                    isDesktop={false}
                    isBusiness={true}
                    order={order}
                    getOrders={getOrders}
                    handleOpenSnackbar={handleOpenSnackbar}
                  />
                );
              })
            ) : (
              <div className="flex justify-center mt-16">
                <p className="text-gray-600 font-light text-sm">
                  No pending orders...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const desktopView = () => {
    return (
      <div className={`${styles.live_orders_box_desktop}`}>
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
        <div className="flex items-center">
          <p className="text-sm">
            This page only shows pending orders. Completed orders are in
            history.
          </p>
          <div className="w-fit ml-auto">
            <ButtonPrimary name="+ Create Order" />
          </div>
        </div>

        {allOrders.length > 0 ? (
          <div className={`${styles.order_grid_box}`}>
            <OrderGrid
              orders={allOrders}
              getOrders={getOrders}
              handleOpenSnackbar={handleOpenSnackbar}
            />
          </div>
        ) : (
          <div className="flex justify-center mt-16">
            <p className="text-gray-600 font-light text-sm">
              No pending orders...
            </p>
          </div>
        )}
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

  return (
    <React.Fragment>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={action}
      />
      {errorLoadingOrders ? (
        errorLoadingView()
      ) : (
        <React.Fragment>
          {mobileView()}
          {desktopView()}
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default LiveOrders;

export async function getServerSideProps(context) {
  return isAuth(context, async (userSession) => {
    const { user, expires } = userSession;
    const { name, email, id } = user;

    let serializedData;

    try {
      const orders = await prisma.customerOrder.findMany({
        where: {
          accountId: id,
          orderStatus: "pending",
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

      console.log(" server orders", orders);

      serializedData = JSON.parse(JSON.stringify(orders));
    } catch (error) {
      console.log("serversideprops` error:", error);
      serializedData = null;
    }

    return {
      props: {
        orders: serializedData,
      },
    };
  });
}

LiveOrders.getLayout = function getLayout(
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
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {page}
      </LocalizationProvider>
    </AppLayout>
  );
};

LiveOrders.pageTitle = "Live Orders";
LiveOrders.pageIcon = <ShoppingCartCheckoutIcon />;
LiveOrders.pageRoute = "live";
LiveOrders.mobilePageRoute = "live";
