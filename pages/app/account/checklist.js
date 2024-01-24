import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { isAuth } from "@/helper/server/auth/isAuth";
import AppLayout from "@/components/layouts/AppLayout";
import styles from "@/styles/app/account/checklist.module.css";
import ChecklistIcon from "@mui/icons-material/Checklist";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import paper_plan_icon from "@/public/images/icons/paper_plane.png";
import Image from "next/image";
import { updateAccountFirstLoginClient } from "@/helper/client/api/account/account-schema";
import { sendBusinessVerificationEmail } from "@/helper/client/api/sendgrid/email";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { useChecklistStore } from "@/lib/store";
import ButtonSecondary from "@/components/global/buttons/ButtonSecondary";
import { Divider } from "@mui/material";
import IdentityModal from "@/components/app/business-identities/IdentityModal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  "@media (min-width: 426px)": {
    width: "50%",
  },
  "@media (min-width: 769px)": {
    width: "40%",
  },
  "@media (min-width: 1025px)": {
    width: "30%",
  },
  bgcolor: "background.paper",
  // border: "2px solid #000",
  boxShadow: 24,
};

function Checklist({ userSession, userAccount, pageTitle }) {
  const checklistStore = useChecklistStore((state) => state.checklist);
  const setChecklistStore = useChecklistStore((state) => state.setChecklist);

  // * Props
  const { user } = userSession;
  const {
    isFirstLogin,
    email,
    id,
    checklist,
    isChecklistComplete,
    isNonMandatoryChecklistComplete,
    fulfillmentMethods,
    availability,
  } = userAccount;

  const {
    isEmailVerified,
    isProductsUploaded,
    isDeliverySet,
    isPaymentsSet,
    hasViewedSupportChannels,
    hasViewedShareStore,
    requireAvailability,
    isAvailabilitySet,
    hasLogo,
    hasBanner,
  } = checklist;

  // * States
  const [isFirstLoginModalOpen, setIsFirstLoginModalOpen] =
    useState(isFirstLogin);
  const [openBusinessIdentity, setOpenBusinessIdentity] = useState(false);
  const [isResendEmail, setIsResendEmail] = useState(false);
  const [resendEmailErrorMessage, setResendEmailErrorMessage] = useState("");
  const [loaders, setLoaders] = useState({
    isSendEmailLoading: false,
    isBusinessIdentityLoading: false,
  });
  const [businessIdentities, setBusinessIdentities] = useState([]);
  const [noIdentitySelectedError, setNoIdentitySelectedError] = useState(false);
  const [tooManyIdentitiesError, setTooManyIdentitiesError] = useState(false);

  // * DOB States
  const { isSendEmailLoading, isBusinessIdentityLoading } = loaders;

  // * Instantiate
  const router = useRouter();

  // UseEffects
  useEffect(() => {
    setChecklistStore(checklist);
    setChecklistStore({ isChecklistComplete });
    setChecklistStore({ isNonMandatoryChecklistComplete });
  }, [checklist, isChecklistComplete, isNonMandatoryChecklistComplete]);

  // * action functions
  const handleClose = () => {
    setIsFirstLoginModalOpen(false);
  };

  const closeBusinessIdentityModal = () => {
    setOpenBusinessIdentity(false);
  };

  const saveBusinessIdentity = async () => {
    if (businessIdentities.length === 0) {
      setNoIdentitySelectedError(true);
      return;
    }

    if (businessIdentities.length > 3) {
      setTooManyIdentitiesError(true);
      return;
    }

    setLoaders((prev) => ({ ...prev, isBusinessIdentityLoading: true }));
    const identities = businessIdentities.join(", ");

    const data = { id, businessIdentities: identities };

    const api = "/api/private/account/businessIdentity";

    const response = await fetch(api, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    const result = await response.json();
    const { success, error } = result;

    if (!success) {
      // TODO: Error logs (why they couldn't save business identity)
    }

    closeBusinessIdentityModal();
    setLoaders((prev) => ({ ...prev, isBusinessIdentityLoading: false }));
  };

  const handleConfirmEmailModalClick = () => {
    handleClose();

    if (isFirstLogin) {
      setOpenBusinessIdentity(true);
    }

    if (isResendEmail) return;
    updateAccountFirstLoginClient(id);
  };

  const handleSendVerifyEmail = async () => {
    setLoaders((prev) => ({ ...prev, isSendEmailLoading: true }));
    const userId = user.id;
    const accountId = id;

    const resSendEmail = await sendBusinessVerificationEmail(
      userId,
      accountId,
      email
    );
    const { success, error } = resSendEmail;

    if (success) {
      setIsResendEmail(true);
      setIsFirstLoginModalOpen(true);
      setLoaders((prev) => ({ ...prev, isSendEmailLoading: false }));
    } else {
      setIsResendEmail(true);
      setIsFirstLoginModalOpen(true);
      setResendEmailErrorMessage(
        "Error sending email. Contact hello@boxcart.shop."
      );
    }
  };

  function isBusinessIdentityChecked(name) {
    if (businessIdentities.length !== 0) {
      const isChecked = businessIdentities.includes(name);

      if (isChecked) {
        return true;
      }
      return false;
    }
    return false;
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    if (noIdentitySelectedError) setNoIdentitySelectedError(false);
    if (tooManyIdentitiesError) setTooManyIdentitiesError(false);

    if (checked) {
      setBusinessIdentities((prev) => [...prev, name]);
    } else {
      const removeBusinessIdentities = businessIdentities.filter(
        (identity) => identity !== name
      );

      setBusinessIdentities(removeBusinessIdentities);
    }
  }

  return (
    <div className={`${styles.checklist_page} ${styles.flexCol}`}>
      <Modal
        open={isFirstLoginModalOpen}
        onClose={handleConfirmEmailModalClick}
        aria-labelledby="Send Email Verification"
        aria-describedby="Modal to send email verification"
      >
        <Box sx={style}>
          <div className="flex flex-col items-center py-4 px-8 lg:px-16 lg:py-8">
            <Image
              src={paper_plan_icon}
              alt="paper plane icon"
              className="w-16 h-16 md:w-24 md:h-24"
            />
            {resendEmailErrorMessage !== "" ? (
              <p className="text-center text-sm my-4 md:text-base">
                resendEmailErrorMessage
              </p>
            ) : (
              <p className="text-center text-sm my-4 md:text-base">
                Verification email as been sent to <br /> {email}
              </p>
            )}
            <ButtonPrimary
              type="button"
              name="OK"
              handleClick={handleConfirmEmailModalClick}
            />
          </div>
        </Box>
      </Modal>
      <IdentityModal
        openBusinessIdentity={openBusinessIdentity}
        isBusinessIdentityChecked={isBusinessIdentityChecked}
        isBusinessIdentityLoading={isBusinessIdentityLoading}
        noIdentitySelectedError={noIdentitySelectedError}
        handleChange={handleChange}
        saveBusinessIdentity={saveBusinessIdentity}
        tooManyIdentitiesError={tooManyIdentitiesError}
      />
      <div className="px-4 mt-4">
        <h3 className="mb-6">Required steps to launch your shop.</h3>
        <div className="px-6">
          <ol className="relative border-s border-gray-200 dark:border-gray-700">
            <li className="mb-10 ms-6">
              <span
                className={`absolute flex items-center justify-center w-6 h-6 ${
                  isEmailVerified ? "bg-gray-300" : "bg-purple-300"
                } rounded-full -start-3 ring-2 ring-gray-900`}
              >
                <p>1</p>
              </span>
              <div
                className={`${styles.task} ${styles.flex} ${
                  isEmailVerified && "line-through"
                }`}
              >
                <h3 class="flex items-center mb-1 text-lg font-semibold text-gray-900 ">
                  Verify email
                </h3>
              </div>

              <p className="mb-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                A verification email has been sent. Please check your inbox or
                spam to verify your email, or resend the verification email.
              </p>
              <div className="w-fit mt-2">
                {!isEmailVerified && (
                  <ButtonPrimary
                    handleClick={handleSendVerifyEmail}
                    name="Send"
                  />
                )}
              </div>
            </li>
            <li className="mb-10 ms-6">
              <span
                className={`absolute flex items-center justify-center w-6 h-6 ${
                  isProductsUploaded ? "bg-gray-300" : "bg-purple-300"
                } rounded-full -start-3 ring-2 ring-gray-900`}
              >
                <p>2</p>
              </span>
              <div
                className={`${styles.task} ${styles.flex} ${
                  isProductsUploaded && "line-through"
                }`}
              >
                <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 ">
                  Upload products
                </h3>
              </div>

              <p className="mb-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                Create products or import products from your Etsy or Shopify
                store.
              </p>
              <div className="w-fit mt-2">
                {!isProductsUploaded && (
                  <Link
                    href="/app/account/inventory/products"
                    className="mt-4 h-8"
                  >
                    <ButtonPrimary name="Go" />
                  </Link>
                )}
              </div>
            </li>
            <li className="mb-10 ms-6">
              <span
                className={`absolute flex items-center justify-center w-6 h-6 ${
                  isDeliverySet ? "bg-gray-300" : "bg-purple-300"
                } rounded-full -start-3 ring-2 ring-gray-900`}
              >
                <p>3</p>
              </span>
              <div
                className={`${styles.task} ${styles.flex} ${
                  isDeliverySet && "line-through"
                }`}
              >
                <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 ">
                  Set up delivery details
                </h3>
              </div>

              <p className="mb-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                Offer delivery, pickup, or both? Set up your delivery settings.
              </p>
              <div className="w-fit mt-2">
                {!isDeliverySet && (
                  <Link
                    href="/app/account/my-shop/fulfillment"
                    className="mt-4 h-8"
                  >
                    <ButtonPrimary name="Go" />
                  </Link>
                )}
              </div>
            </li>
            <li className="mb-10 ms-6">
              <span
                className={`absolute flex items-center justify-center w-6 h-6 ${
                  isPaymentsSet ? "bg-gray-300" : "bg-purple-300"
                } rounded-full -start-3 ring-2 ring-gray-900`}
              >
                <p>4</p>
              </span>
              <div
                className={`${styles.task} ${styles.flex} ${
                  isPaymentsSet && "line-through"
                }`}
              >
                <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 ">
                  Set up payments
                </h3>
              </div>

              <p className="mb-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                Credit, cash, venmo, zelle, afterpay, etc. Set up your payment.
              </p>
              <div className="w-fit mt-2">
                {!isPaymentsSet && (
                  <Link
                    href="/app/account/my-shop/payments"
                    className="mt-4 h-8"
                  >
                    <ButtonPrimary name="Go" />
                  </Link>
                )}
              </div>
            </li>
            {requireAvailability && (
              <li className="mb-10 ms-6">
                <span
                  className={`absolute flex items-center justify-center w-6 h-6 ${
                    isAvailabilitySet ? "bg-gray-300" : "bg-purple-300"
                  } rounded-full -start-3 ring-2 ring-gray-900`}
                >
                  <p>5</p>
                </span>
                <div
                  className={`${styles.task} ${styles.flex} ${
                    isAvailabilitySet && "line-through"
                  }`}
                >
                  <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 ">
                    Set your availabilities
                  </h3>
                </div>

                <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  Set your availabilities to allow customers to select a pickup
                  date or delivery date. Specific times can also be set.
                </p>

                <div className="w-fit mt-2">
                  {!isAvailabilitySet && (
                    <Link
                      href="/app/account/my-shop/availability"
                      className="mt-4 h-8"
                    >
                      <ButtonPrimary name="Go" />
                    </Link>
                  )}
                </div>
              </li>
            )}
          </ol>
        </div>
      </div>

      <Divider />
      <div className="px-4 mt-8 pb-20">
        <h3 className="mb-6">Suggested steps</h3>
        <div className="px-6">
          <ol className="relative border-s border-gray-200 dark:border-gray-700">
            <li className="mb-10 ms-6">
              <span
                className={`absolute flex items-center justify-center w-6 h-6 ${
                  hasLogo && hasBanner ? "bg-gray-300" : "bg-purple-300"
                } rounded-full -start-3 ring-2 ring-gray-900`}
              >
                <p>1</p>
              </span>
              <div
                className={`${styles.task} ${styles.flex} ${
                  hasLogo && hasBanner && "line-through"
                }`}
              >
                <h3 class="flex items-center mb-1 text-lg font-semibold text-gray-900 ">
                  Update profile banner &amp; logo
                </h3>
              </div>

              <p className="mb-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                Upload a banner and logo image to your shop.
              </p>
              <div className="w-fit">
                {!hasLogo && !hasBanner && (
                  <Link
                    href="/app/account/my-shop/profile"
                    className="mt-4 h-8"
                  >
                    <ButtonSecondary name="Go" />
                  </Link>
                )}
              </div>
            </li>
            <li className="mb-10 ms-6">
              <span
                className={`absolute flex items-center justify-center w-6 h-6 ${
                  hasViewedShareStore ? "bg-gray-300" : "bg-purple-300"
                } rounded-full -start-3 ring-2 ring-gray-900`}
              >
                <p>2</p>
              </span>
              <div
                className={`${styles.task} ${styles.flex} ${
                  hasViewedShareStore && "line-through"
                }`}
              >
                <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 ">
                  View &amp; share shop
                </h3>
              </div>

              <p className="mb-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                Share your shop link or QR code to your customers.
              </p>
              <div className="w-fit">
                {!hasViewedShareStore && (
                  <Link href="/app/account/my-shop/share" className="mt-4 h-8">
                    <ButtonSecondary name="Go" />
                  </Link>
                )}
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default Checklist;

export async function getServerSideProps(context) {
  return isAuth(context, async (userSession) => {
    const { user, expires } = userSession;
    const { name, email, id } = user;
    let serisalizedAccount;

    try {
      const userAccount = await prisma.account.findUnique({
        where: {
          email,
        },
        include: {
          checklist: true,
          fulfillmentMethods: true,
          availability: true,
        },
      });

      if (!userAccount) {
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

      serisalizedAccount = JSON.parse(JSON.stringify(userAccount));
    } catch (error) {
      console.log("serversideprops checklist error:", error);
      serisalizedAccount = null;
    }

    return {
      props: {
        userSession,
        userAccount: serisalizedAccount,
      },
    };
  });
}

Checklist.getLayout = function getLayout(
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

Checklist.pageTitle = "Checklist";
Checklist.pageIcon = <ChecklistIcon color="var(--primary-dark-med)" />;
Checklist.pageRoute = "checklist";
Checklist.mobilePageRoute = "checklist";
