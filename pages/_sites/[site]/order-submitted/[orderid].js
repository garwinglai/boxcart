import React, { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import mobile_order_placed_icon from "@/public/images/icons/mobile_order.png";
import Image from "next/image";
import ButtonPrimaryStorefront from "@/components/global/buttons/ButtonPrimaryStorefront";
import prisma from "@/lib/prisma";
import CartItem from "@/components/storefront/cart/CartItem";
import OrderReview from "@/components/storefront/cart/OrderReview";
import OrderSubtotal from "@/components/storefront/cart/OrderSubtotal";

function OrderSubmitted({ order }) {
  const { query } = useRouter();
  const { orderId, orderItems } = order;

  // TODO: generate receipt download
  const handleDownloadAsPDF = async () => {
    window.print();
    // await exportAsImage(exportRef.current, "order-receipt");
  };

  return (
    <div className="mt-4">
      <div className=" flex flex-col items-center gap-4 pb-4 border-b">
        <Image src={mobile_order_placed_icon} alt="mobile order icon" />
        <div className="flex flex-col gap-2 items-center">
          <h2>Order placed.</h2>
          <div className="flex items-center gap-2">
            <h3>Order No:</h3>
            <h2 className="font-bold text-xs">{orderId}</h2>
          </div>
          <p className="font-light">Please keep a record of this page.</p>
        </div>

        <Link
          href={`/`}
          className="bg-[color:var(--black-design-extralight)] text-white font-light px-4 py-2 active:bg-black"
        >
          Continue Shopping
        </Link>
      </div>
      <div>
        <div className="flex justify-between items-center px-4 pt-4">
          <h3 className="">Order Receipt</h3>
          <button
            onClick={handleDownloadAsPDF}
            className="text-blue-600 font-light text-sm underline"
          >
            download receipt
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
  const { orderId } = context.query;

  try {
    const order = await prisma.order.findUnique({
      where: {
        orderId,
      },
      include: {
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

    const serializedOrder = JSON.parse(JSON.stringify(order));

    if (!serializedOrder) {
      return {
        redirect: {
          permanent: false,
          destination: "/",
        },
      };
    }

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
