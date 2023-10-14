import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import mobile_order_placed_icon from "@/public/images/icons/mobile_order.png";
import Image from "next/image";
import prisma from "@/lib/prisma";
import CartItem from "@/components/storefront/cart/CartItem";
import OrderReview from "@/components/storefront/cart/OrderReview";
import OrderSubtotal from "@/components/storefront/cart/OrderSubtotal";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import { useCartStore } from "@/lib/store";
import PaymentNotes from "@/components/storefront/checkout/PaymentNotes";

function OrderSubmitted({ order }) {
  const resetCartStore = useCartStore((state) => state.resetCartStore);
  const cartDetails = useCartStore((state) => state.cartDetails);

  const [snackbar, setSnackbar] = useState({
    isSnackbarOpen: false,
    snackbarMessage: "",
  });

  const { query } = useRouter();
  const {
    orderId,
    orderItems,
    paymentMethod,
    paymentAccount,
    paymentInstructions,
  } = order;

  const { isSnackbarOpen, snackbarMessage } = snackbar;

  // useEffect(() => {
  //   unsetCartStoreData();
  // }, [order]);

  const unsetCartStoreData = () => {
    resetCartStore({
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      requireOrderTime: false,
      requireOrderDate: false,
      orderForDateDisplay: "Select date",
      orderForTimeDisplay: "time",
      fulfillmentType: null,
      fulfillmentDisplay: null,
      deliveryAddress: "",
      subtotalPenny: 0,
      subtotalDisplay: "$0.00",
      taxRate: 0,
      taxRateDisplay: "$0.00",
      cardFeePenny: 0,
      cardFeeDisplay: "$0.00",
      taxAndFeesPenny: 0,
      taxAndFeesDisplay: "$0.00",
      deliveryFeePenny: 0,
      deliveryFeeDisplay: "$0.00",
      deliveryFeeType: 0, // 0 = free, 1 = flat, 2 = percentage , 3 = distance
      deliveryFeeTypeDisplay: "free",
      deliveryDistanceMi: 0,
      deliveryDistanceMiDisplay: "0 mi",
      deliveryDistanceKm: 0,
      deliveryDistanceKmDisplay: "0 km",
      selectedTipIndex: null,
      totalPenny: 0,
      totalDisplay: "$0.00",
    });
  };

  // TODO: generate receipt download
  const handleDownloadAsPDF = async () => {
    window.print();
    // await exportAsImage(exportRef.current, "order-receipt");
  };

  const handleCopyIdToClipboard = () => {
    navigator.clipboard.writeText(orderId);
    handleOpenSnackbar("copied.");
  };

  const handleOpenSnackbar = (message) => {
    setSnackbar({
      isSnackbarOpen: true,
      snackbarMessage: message,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      isSnackbarOpen: false,
      snackbarMessage: "",
    });
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
    <div className="mt-4">
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        action={action}
      />
      <div className=" flex flex-col items-center gap-4 pb-4 border-b">
        <Image src={mobile_order_placed_icon} alt="mobile order icon" />
        <div className="flex flex-col gap-2 items-center">
          <h2>Order placed.</h2>
          <div className="flex items-center gap-2">
            <h3 className="font-light text-sm">Order No:</h3>
            <h2 className="font-bold text-xs">{orderId}</h2>
            <IconButton onClick={handleCopyIdToClipboard}>
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </div>
          <p className="font-base underline">
            Please keep a record of this page.
          </p>
        </div>
        {paymentMethod !== "card" && (
          <div className="p-4 border-y">
            <PaymentNotes
              selectedPaymentDetails={order}
              isOrderSubmittedPage={true}
            />
          </div>
        )}
        <Link
          href={`/`}
          className="bg-[color:var(--black-design-extralight)] text-white font-light px-4 py-2 active:bg-black"
        >
          Continue Shopping
        </Link>
      </div>
      <div className="lg:w-1/2 lg:mx-auto">
        <div className="flex justify-between items-center px-4 pt-4">
          <h3 className="">Order Receipt</h3>
          <button
            onClick={handleDownloadAsPDF}
            className="text-blue-600 font-light text-lg underline"
          >
            save receipt
          </button>
        </div>
        {orderItems.map((item) => {
          const { id } = item;
          return <CartItem key={id} cartItem={item} orderSubmitted={true} />;
        })}
        <OrderReview orderSubmitted={true} order={order} isMobile={false} />
        <OrderSubtotal orderSubmitted={true} order={order} />
      </div>
    </div>
  );
}

export default OrderSubmitted;

export async function getServerSideProps(context) {
  const { query } = context;
  const { orderid } = query;

  const id = parseInt(orderid);

  try {
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        account: true,
        orderItems: {
          include: {
            orderOptionGroups: {
              include: {
                orderOptions: true,
              },
            },
            orderExampleImages: true,
            orderQuestionsAnswers: true,
          },
        },
      },
    });

    if (!order) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    const { account } = order;

    if (!account.isChecklistComplete) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    const serializedOrder = JSON.parse(JSON.stringify(order));

    return {
      props: { order: serializedOrder },
    };
  } catch (error) {
    console.log("error", error);

    return {
      props: { order: null },
    };
  }
}
