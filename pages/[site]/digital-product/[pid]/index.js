import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import ShareIcon from "@mui/icons-material/Share";
import { IconButton, Rating } from "@mui/material";
import Image from "next/image";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import RadioGroupComponent from "@/components/storefront/options/RadioGroupComponent";
import CheckGroupComponent from "@/components/storefront/options/CheckGroupComponent";
import ButtonPrimaryStorefront from "@/components/global/buttons/ButtonPrimaryStorefront";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ShopLayout from "@/components/layouts/storefront/ShopLayout";
import prisma from "@/lib/prisma";
import Snackbar from "@mui/material/Snackbar";
import {
  useCartStore,
  useProductQuantityStore,
  useOptionsQuantityStore,
  useShopperStore,
} from "@/lib/store";
import { nanoid } from "nanoid";
import Link from "next/link";
import CheckmarkGif from "@/public/videos/checkmark.gif";
import ReviewComponent from "@/components/storefront/reviews/ReviewComponent";

// generate item quantity constant to 100 values in an array from 1
const unlimitedQuantity = Array.from({ length: 100 }, (_, i) => i + 1);

function DigitalProduct({ product }) {
  const { account, id: productId } = product || {};
  const { id: accountId, subdomain } = account || {};

  const shopperAccount = useShopperStore((state) => state.shopperAccount);

  const setCart = useCartStore((state) => state.setCart);
  const addSubtotal = useCartStore((state) => state.addSubtotal);

  const {
    id,
    productName,
    description,
    priceStr,
    salePriceStr,
    defaultImage,
    productType,
    productTypeDisplay,
  } = product;

  const [reviews, setReviews] = useState(product.reviews);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [exampleImages, setExampleImages] = useState([]);
  const [itemTotal, setItemTotal] = useState(
    product.salePriceStr || product.salePriceStr !== ""
      ? product.salePriceStr
      : product.priceStr
  );
  const [itemTotalPenny, setItemTotalPenny] = useState(
    product.salePricePenny || product.salePricePenny !== null
      ? product.salePricePenny
      : product.priceIntPenny
  );
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    isSnackbarOpen: false,
    snackbarMessage: "",
  });
  const [isSoldOut, setIsSoldOut] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const { isSnackbarOpen, snackbarMessage } = snackbar;

  const router = useRouter();
  const selectRef = useRef(null);
  const {
    query: { site },
  } = router;

  const getReviews = async (accountId, productId) => {
    const api = `/api/public/storefront/review/retrieve?accountId=${accountId}&productId=${productId}`;
    const res = await fetch(api, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { success, error, reviews } = await res.json();

    if (!success || error) {
      return handleOpenSnackbar("Couldn't load reviews.");
    }

    setReviews(reviews);
  };

  function handleGoHome() {
    router.push(`/${site}`);
  }

  function handleShare() {
    // window.alert("share clicked");
  }

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

  const handleQuantityChange = (event) => {
    const { value } = event.target;
    const quantityInt = parseInt(value);

    const productPricePenny = product.salePricePenny
      ? product.salePricePenny
      : product.priceIntPenny;
    let newItemTotalInt = productPricePenny * quantityInt;
    const newItemTotalDisplay =
      `$` + (newItemTotalInt / 100).toFixed(2).toString();

    setItemTotal(newItemTotalDisplay);
    setItemTotalPenny(newItemTotalInt);
    setSelectedQuantity(quantityInt);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const addToCartProductData = structureOrderData();

    setAddedToCart(true);
    addSubtotal(subdomain, itemTotalPenny);
    setCart(subdomain, addToCartProductData);
    setIsLoading(false);
  };

  const structureOrderData = () => {
    const addToCartTempItemId = nanoid();

    const addToCartProductData = {
      defaultImage,
      productId: id,
      addToCartTempItemId,
      productName: productName,
      pricePenny: itemTotalPenny,
      priceDisplay: itemTotal,
      productType, //0 = physical, 1 = digital
      productTypeDisplay,
      quantity: parseInt(selectedQuantity),
      hasUnlimitedQuantity: true,
    };

    return addToCartProductData;
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

  if (addedToCart) {
    return (
      <div className="flex flex-col items-center justify-center mt-28">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 relative aspect-square">
            <Image
              src={CheckmarkGif}
              alt="checkmark"
              fill
              priority
              className=" object-cover rounded"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <h4>Added to cart</h4>
        </div>
        <h2>{productName}</h2>
        {defaultImage ? (
          <div className={`w-28 h-28 relative aspect-square mt-2 mb-16`}>
            <Image
              src={defaultImage}
              alt="product image"
              fill
              priority
              className="object-cover snap-center rounded"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className={`w-28 h-28 relative aspect-square mt-2 mb-16`}>
            <Image
              src={"https://fl-1.cdn.flockler.com/embed/no-image.svg"}
              alt="product image"
              fill
              priority
              className="object-cover snap-center rounded"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <div className="">
          <Link
            href={`/${site}`}
            className=" text-center px-4 flex justify-center rounded items-center h-10 border border-[color:var(--black-design-extralight)] font-light text-[color:var(--black-design-extralight)] w-full active:bg-[color:var(--gray-light-med)] "
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleAddToCart}
      className="md:flex md:relative md:w-full md:px-8 md:pb-8 md:gap-4  md:overflow-hidden"
    >
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        sx={{ width: "fit-content" }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        action={action}
      />
      <div className="md:w-[65%] md:overflow-y-scroll">
        <div className="flex justify-between items-center my-1 mx-2 md:ml-0 md:my-4">
          <div className="flex items-center">
            <IconButton onClick={handleGoHome} className="flex items-center">
              <ChevronLeftIcon
                fontSize="medium"
                sx={{ color: "var(--black-design-extralight)" }}
              />
            </IconButton>
            <button
              type="button"
              onClick={handleGoHome}
              className="font-light text-sm text-[color:var(--black-design-extralight)]"
            >
              Home
            </button>
          </div>
          <div className="rounded-full">
            <IconButton onClick={handleShare}>
              <ShareIcon
                fontSize="small"
                sx={{ color: "var(--black-design-extralight)" }}
              />
            </IconButton>
          </div>
        </div>
        <div className="flex gap-2 snap-x overflow-x-scroll w-full md:grid md:grid-cols-2 lg:w-5/6 lg:mx-auto xl:w-3/4">
          {defaultImage ? (
            <div
              className={`min-w-full snap-center relative aspect-square md:col-span-2 `}
            >
              <Image
                src={defaultImage}
                alt="product image"
                fill
                priority
                className="object-cover "
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ) : (
            <div
              className={`min-w-full snap-center relative aspect-square md:col-span-2`}
            >
              <Image
                src={"https://fl-1.cdn.flockler.com/embed/no-image.svg"}
                alt="product image"
                fill
                priority
                className="object-cover  rounded"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
        </div>
      </div>
      <div className="md:w-[35%] md:pt-10 md:sticky md:top-0">
        {salePriceStr && salePriceStr !== "" && (
          <h4 className="text-[color:var(--sale-text)] px-6">Sale</h4>
        )}
        <div className="flex flex-col gap-2 px-6 pb-4 border-b border-[color:var(--gray-light)]">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">{productName}</h3>
              <div className="flex items-center gap-2">
                <Rating
                  name="read-only"
                  value={parseInt(product.rating)}
                  readOnly
                  sx={{ fontSize: "0.75rem" }}
                />
                <p className="text-[color:var(--gray-text)] font-extralight text-xs">
                  ({product.reviewCount})
                </p>
              </div>
            </div>
            <p className="">
              {salePriceStr && salePriceStr !== "" ? (
                <span>
                  <span className=" line-through text-xs font-extralight mr-2 text-gray-500">
                    {priceStr}
                  </span>
                  <span>{salePriceStr}</span>
                </span>
              ) : (
                <span className="font-medium">{priceStr}</span>
              )}
            </p>
          </div>
          <div className="flex justify-between gap-4  md:flex-col-reverse md:items-start md:gap-2">
            <p className="font-light text-sm text-[color:var(--gray)] ">
              {description}
            </p>
          </div>
        </div>
        <div className="relative px-6 pb-4 pt-3">
          <label
            htmlFor="quantitySelect"
            className="block mb-1 font-medium text-sm text-[color:var(--black-design-extralight)] "
            ref={selectRef}
          >
            Item Quantity:
          </label>
          <select
            id="quantitySelect"
            value={selectedQuantity}
            onChange={handleQuantityChange}
            className="appearance-none w-full px-4 py-2 border text-sm font-light border-gray-300 rounded focus:outline-[color:var(--third)] "
          >
            {
              // 100 is the max quantity
              unlimitedQuantity.map((item, idx) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))
            }
          </select>
        </div>

        <div className="flex px-6 py-4 justify-between items-center border-b">
          <h3 className="font-medium">Item total:</h3>
          <p className="font-medium">{itemTotal}</p>
        </div>
        <div className="md:hidden">
          <ReviewComponent
            getReviews={getReviews}
            product={product}
            account={account}
            reviews={reviews}
            handleOpenSnackbar={handleOpenSnackbar}
            shopperAccount={shopperAccount}
          />
        </div>
        <div className="sticky bottom-0 p-4 mt-20 flex flex-col gap-2 bg-white border-t border-[color:var(--gray-light-med)] md:border-none md:mt-8">
          <div className="h-10">
            <ButtonPrimaryStorefront
              name={isLoading ? "Adding ..." : isSoldOut ? "Sold out" : "Add"}
              type="submit"
              disabled={isLoading || isSoldOut}
            />
          </div>

          <Link
            href={`/${site}`}
            className=" text-center flex justify-center items-center h-10 border border-[color:var(--black-design-extralight)] font-light text-[color:var(--black-design-extralight)] w-full active:bg-[color:var(--gray-light-med)] "
          >
            Continue Shopping
          </Link>
        </div>
        <div className="hidden md:block">
          <ReviewComponent
            getReviews={getReviews}
            product={product}
            account={account}
            reviews={reviews}
            handleOpenSnackbar={handleOpenSnackbar}
            shopperAccount={shopperAccount}
          />
        </div>
      </div>
    </form>
  );
}

export default DigitalProduct;

DigitalProduct.getLayout = function getLayout(page) {
  return <ShopLayout>{page}</ShopLayout>;
};

export async function getServerSideProps(context) {
  const { pid } = context.query;
  const id = parseInt(pid);

  try {
    const product = await prisma.digitalProduct.findUnique({
      where: {
        id,
      },
      include: {
        account: true,
        reviews: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!product) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    const { account } = product;

    if (!account.isChecklistComplete) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    const serializedProduct = JSON.parse(JSON.stringify(product));

    return {
      props: {
        product: serializedProduct,
      },
    };
  } catch (error) {
    console.log("error", error);
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
}
