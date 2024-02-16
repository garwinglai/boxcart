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
import {
  useCartStore,
  useProductQuantityStore,
  useOptionsQuantityStore,
} from "@/lib/store";
import PaymentNotes from "@/components/storefront/checkout/PaymentNotes";

function OrderSubmitted({ order }) {
  const resetCartStore = useCartStore((state) => state.resetCartStore);

  const resetProductStore = useProductQuantityStore(
    (state) => state.removeAllProducts
  );
  const resetQuantityStore = useOptionsQuantityStore(
    (state) => state.removeAllOptions
  );

  const [snackbar, setSnackbar] = useState({
    isSnackbarOpen: false,
    snackbarMessage: "",
  });

  const {
    query: { site },
  } = useRouter();

  const {
    orderId,
    orderItems,
    paymentMethod,
    paymentAccount,
    paymentInstructions,
  } = order;

  const { isSnackbarOpen, snackbarMessage } = snackbar;

  useEffect(() => {
    unsetCartStoreData();
    resetProductStore();
    resetQuantityStore();
  }, [order]);

  const unsetCartStoreData = () => {
    // Removes cart and cart details
    resetCartStore(site, {});
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
    <div className="mt-4 p-4">
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
          <p className="font-base text-sm">Your invoice was emailed</p>
          <Link
            href={`/${site}`}
            className="bg-[color:var(--black-design-extralight)] my-2 rounded text-sm text-white font-light px-4 py-2 active:bg-black"
          >
            Continue Shopping
          </Link>
        </div>
        {paymentMethod !== "card" && (
          <div className="p-4 border-y">
            <PaymentNotes
              selectedPaymentDetails={order}
              isOrderSubmittedPage={true}
            />
          </div>
        )}
        <div className="lg:w-1/2 lg:mx-auto">
          <OrderReview orderSubmitted={true} order={order} isMobile={false} />
          <OrderSubtotal orderSubmitted={true} order={order} />
        </div>
      </div>
      <div className="md:w-1/2 md:mx-auto">
        <div className="flex justify-between items-center pt-4">
          <h3 className="">Order Receipt</h3>
          <button
            onClick={handleDownloadAsPDF}
            className="text-blue-600 font-light text-sm underline"
          >
            save receipt
          </button>
        </div>
        {orderItems.map((item, idx) => {
          const { id } = item;
          return (
            <CartItem
              key={id}
              idx={idx}
              cartItem={item}
              orderSubmitted={true}
            />
          );
        })}
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
    const order = await prisma.customerOrder.findUnique({
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
