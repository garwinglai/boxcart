import React, { useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import styles from "@/styles/app/account/orders/order-history.module.css";
import Calendar from "@/components/global/designs/Calendar";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import OrderGridHistory from "@/components/app/orders/OrderGridHistory";
import { isAuth } from "@/helper/server/auth/isAuth";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import prisma from "@/lib/prisma";
import Image from "next/image";
import orders_icon from "@/public/images/icons/user/orders_icon.png";

function AllOrders({ orders, accountId }) {
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
    console.log("here");
    const orders = await fetch(
      `/api/private/orders/get-all-history-orders/?accountId=${accountId}`
    );
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

      <h5 className="p-4 md:p-0">All completed orders</h5>
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

      if (!orders) {
        return {
          redirect: {
            destination:
              process.env.NODE_ENV && process.env.NODE_ENV === "production"
                ? "/app/auth/signin"
                : "http://localhost:3000/app/auth/signin",
            permanent: false,
          },
        };
      }

      serializedData = JSON.parse(JSON.stringify(orders));
    } catch (error) {
      console.log("serversideprops checklist error:", error);
      serializedData = null;
    }

    return {
      props: {
        orders: serializedData,
        accountId: id,
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
AllOrders.pageIcon = (
  <div className="relative w-8 h-8">
    <Image
      src={orders_icon}
      alt="orders icon"
      fill
      className=""
      priority
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  </div>
);
AllOrders.pageRoute = "history";
AllOrders.mobilePageRoute = "history";
