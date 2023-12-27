import React, { useState } from "react";
import Review from "./Review";
import ReviewOverview from "./ReviewOverview";
import { Rating } from "@mui/material";
import review_icon from "@/public/images/icons/review_icon.png";
import Image from "next/image";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import ButtonPrimaryStorefront from "@/components/global/buttons/ButtonPrimaryStorefront";
import { styled } from "@mui/material/styles";
import { Timestamp } from "firebase/firestore";
import { createNotification } from "@/helper/client/api/notifications";
import { checkIfUserEmailInUse } from "@/helper/client/api/user";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  "@media (min-width: 769px)": {
    width: "50%",
  },
  "@media (min-width: 1025px)": {
    width: "35%",
  },
  bgcolor: "background.paper",
  borderRadius: "8px",
  // boxShadow: 24,
  p: 4,
};

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "var(--star)",
  },
});

function ReviewComponent({
  product,
  account,
  reviews,
  handleOpenSnackbar,
  getReviews,
  isOwner,
  shopperAccount,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [productState, setProductState] = useState(product);
  const [openCreateReview, setOpenCreateReview] = useState(false);
  const [reviewValues, setReviewValues] = useState({
    rating: 0,
    title: "",
    review: "",
    email: shopperAccount ? shopperAccount.email : "",
    name: shopperAccount ? shopperAccount.name : "",
  });

  const { rating, title, review, email, name } = reviewValues;

  const handleOpenCreateReview = () => setOpenCreateReview(true);
  const handleCloseCreateReview = () => {
    setOpenCreateReview(false);
    setReviewValues({
      rating: 0,
      title: "",
      review: "",
      email: "",
      name: "",
    });

    setIsLoading(false);
  };

  const handleReviewValueChange = (e) => {
    const { name, value } = e.target;

    setReviewValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (e, rating) => {
    setReviewValues((prev) => ({ ...prev, rating }));
  };

  const handleWriteReview = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      return handleOpenSnackbar("Please enter a rating.");
    }
    setIsLoading(true);
    const accountId = account.id;
    const productId = product.id;

    // check if customer exists in order to leave review
    const customerId = await retrieveCustomerId(email, accountId);

    if (!customerId) {
      setIsLoading(false);
      return handleOpenSnackbar("Only customers can leave a review.");
    }

    // Check if customer has bought the product in order to leave review
    const productBought = await checkProductBought(
      accountId,
      customerId,
      productId
    );

    if (!productBought) {
      setIsLoading(false);
      return handleOpenSnackbar(
        "Only customers who bought the product can leave a review."
      );
    }

    let shopper = null;

    // Connect to shopperAccount
    if (shopperAccount) {
      // if shopper is logged in, connect to shopperAccount
      shopper = shopperAccount;
    } else {
      // if not logged in, check if there is shopper with email.
      const { user } = await checkIfUserEmailInUse(email);
      if (user && user.shopperAccount) {
        shopper = user.shopperAccount;
      }
    }

    const data = buildReviewData(
      reviewValues,
      accountId,
      productId,
      customerId,
      shopper
    );

    const { success, error, updatedReview } = await createReview(data);

    if (!success || error) {
      setIsLoading(false);
      return handleOpenSnackbar("Error submitting review.");
    }

    handleOpenSnackbar("Submitted.");
    handleCloseCreateReview();
    createAndSendNotification(updatedReview);
    setProductState(updatedReview.product);
    await getReviews(accountId, productId);
    setIsLoading(false);
  };

  const createAndSendNotification = (updatedReview) => {
    const { product, account } = updatedReview;

    const now = new Date();

    const timeString = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const dateString = now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const dateTimeString = `${dateString} ${timeString}`;

    const notifData = {
      accountId: parseInt(account.id),
      subdomain: account.subdomain,
      relatedPostId: parseInt(product.id),
      notificationTypeDisplay: "Review",
      globalNotification: false, // true if sent from boxCart
      notificationType: 1, //0: order, 1:review
      notificationTitle: `New Review`,
      notificationMessage: `New review for ${product.productName}`,
      createdAt: Timestamp.fromDate(new Date()),
      dateTimeString,
    };

    createNotification(notifData);
  };

  const buildReviewData = (
    reviewValues,
    accountId,
    productId,
    customerId,
    shopper
  ) => {
    // destructure reviewValues;
    const { rating, title, review, email, name } = reviewValues;

    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    const reviewData = {
      rating: rating.toFixed(2),
      title,
      review,
      email,
      name: capitalizedName,
    };

    const productData = {
      reviewCount: {
        increment: 1,
      },
    };

    switch (rating) {
      case 5:
        productData.fiveStarCount = { increment: 1 };
        break;
      case 4:
        productData.fourStarCount = { increment: 1 };
        break;
      case 3:
        productData.threeStarCount = { increment: 1 };
        break;
      case 2:
        productData.twoStarCount = { increment: 1 };
        break;
      default:
        productData.oneStarCount = { increment: 1 };
        break;
    }

    // Build product data review rating update
    const avgRatings = parseFloat(product.rating) * 100;
    const newAvgRatings =
      avgRatings === 0
        ? rating.toFixed(2)
        : (
            (avgRatings * product.reviewCount + rating * 100) /
            (product.reviewCount + 1) /
            100
          ).toFixed(2);

    productData.rating = newAvgRatings;

    // Building account data review rating update
    const accountAvgRatings = parseFloat(account.rating * 100);
    const newAccountAvgRatings =
      account.reviewCount === 1
        ? account.rating
        : (
            (accountAvgRatings * account.reviewCount + rating * 100) /
            (account.reviewCount + 1) /
            100
          ).toFixed(2);

    const accountData = {
      reviewCount: {
        increment: 1,
      },
      rating: newAccountAvgRatings,
    };

    const shopperId = shopperAccount
      ? shopper.shopperId
      : shopper
      ? shopper.id
      : null;

    return {
      reviewData,
      accountId,
      productId,
      isProductDigital: product.productType == 0 ? false : true,
      customerId,
      productData,
      accountData,
      shopperId,
    };
  };

  const createReview = async (data) => {
    const api = "/api/public/storefront/review/create";
    const res = await fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const reviewData = await res.json();
    return reviewData;
  };

  const checkProductBought = async (accountId, customerId, productId) => {
    const api =
      product.productType == 0
        ? `/api/public/storefront/customer/retrieve-order?accountId=${accountId}&customerId=${customerId}&productId=${productId}`
        : `/api/public/storefront/customer/retrieve-digital-order?accountId=${accountId}&customerId=${customerId}&productId=${productId}`;
    const res = await fetch(api, { method: "GET" });
    const data = await res.json();
    const { success, order, error } = data;

    if (!success || error || !order || order.customerOrder.length < 1) {
      return false;
    }

    return true;
  };

  const retrieveCustomerId = async (email, accountId) => {
    const api = `/api/public/storefront/customer/retrieve/${email}?accountId=${accountId}`;
    const res = await fetch(api, { method: "GET" });
    const data = await res.json();
    const { success, customer, error } = data;

    if (!success || error || !customer) {
      return false;
    }

    return customer.id;
  };

  return (
    <div className="mt-8">
      <h3 className="text-center text-base">Customer Reviews</h3>
      <ReviewOverview product={productState} />
      {!isOwner && (
        <div className="mx-4 mb-4">
          <button
            onClick={handleOpenCreateReview}
            type="button"
            className="border rounded-full text-xs block w-full px-12 py-1 hover:cursor-pointer active:border-[color:var(--gray)] active:bg-[color:var(--gray-light)]"
          >
            Write a review
          </button>
          <Modal
            open={openCreateReview}
            onClose={handleCloseCreateReview}
            aria-labelledby="Review"
            aria-describedby="Leave a review"
          >
            <Box sx={style}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-12 h-12 aspect-square relative opacity-60">
                  <Image
                    src={review_icon}
                    alt="review_icon"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <h2 className="font-medium text-base">Write your review!</h2>
              </div>
              <button
                onClick={handleCloseCreateReview}
                type="button"
                className="text-right text-sm font-light text-gray-400 absolute top-4 right-4 active:text-black hover:cursor-pointer"
              >
                Close
              </button>

              <div className="flex flex-col gap-2">
                <div className="flex flex-col">
                  <label
                    htmlFor="email"
                    className="text-[color:var(--black-design-extralight)] text-sm"
                  >
                    Name:
                  </label>
                  <input
                    required
                    type="name"
                    name="name"
                    id="name"
                    className="border indent-2 py-1 focus:ring-black text-sm font-light"
                    value={name}
                    onChange={handleReviewValueChange}
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="email"
                    className="text-[color:var(--black-design-extralight)] text-sm"
                  >
                    Email:
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    id="email"
                    className="border indent-2 py-1 focus:ring-black text-sm font-light"
                    value={email}
                    onChange={handleReviewValueChange}
                  />
                </div>
                <div className="flex flex-col mt-2 pt-2 border-t">
                  <label
                    htmlFor="rating"
                    className="text-[color:var(--black-design-extralight)] text-sm"
                  >
                    Rating:
                  </label>

                  <StyledRating
                    id="rating"
                    // readOnly
                    value={rating}
                    onChange={handleRatingChange}
                    // sx={{ color: "yellow" }}
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="title"
                    className="text-[color:var(--black-design-extralight)] text-sm"
                  >
                    Title:
                  </label>
                  <input
                    required
                    type="title"
                    name="title"
                    id="title"
                    className="border indent-2 py-1 focus:ring-black text-sm font-light"
                    value={title}
                    onChange={handleReviewValueChange}
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="email"
                    className="text-[color:var(--black-design-extralight)] text-sm"
                  >
                    Review:
                  </label>
                  <textarea
                    required
                    name="review"
                    id="review"
                    cols="30"
                    rows="3"
                    className="border indent-2 py-1 focus:ring-black text-sm font-light"
                    value={review}
                    onChange={handleReviewValueChange}
                  ></textarea>
                </div>
              </div>
              <div className="mt-4 h-8">
                <ButtonPrimaryStorefront
                  disabled={isLoading}
                  handleClick={handleWriteReview}
                  type="button"
                  name={isLoading ? "Submitting..." : "Submit"}
                />
              </div>
            </Box>
          </Modal>
        </div>
      )}
      {reviews.length > 0 ? (
        reviews.map((review) => <Review key={review.id} review={review} />)
      ) : (
        <div className="opacity-25 flex flex-col items-center mt-12">
          <div className="w-16 h-16 aspect-square relative ">
            <Image
              src={review_icon}
              alt="review_icon"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <p className="text-sm">No reviews</p>
        </div>
      )}
    </div>
  );
}

export default ReviewComponent;
