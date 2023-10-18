import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { isAuth } from "@/helper/client/auth/isAuth";
import AppLayout from "@/components/layouts/AppLayout";
import styles from "@/styles/app/account/checklist.module.css";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ClearIcon from "@mui/icons-material/Clear";
import ChecklistIcon from "@mui/icons-material/Checklist";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import paper_plan_icon from "@/public/images/icons/paper_plane.png";
import Image from "next/image";
import { updateAccountFirstLoginClient } from "@/helper/client/api/account/account-schema";
import { sendVerificationEmail } from "@/helper/client/api/sendgrid/email";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { setLocalStorage } from "@/utils/clientStorage";
import { useChecklistStore } from "@/lib/store";
import ButtonSecondary from "@/components/global/buttons/ButtonSecondary";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "max-content",
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
  const [isResendEmail, setIsResendEmail] = useState(false);
  const [resendEmailErrorMessage, setResendEmailErrorMessage] = useState("");
  const [loaders, setLoaders] = useState({
    isSendEmailLoading: false,
  });

  // * DOB States
  const { isSendEmailLoading } = loaders;

  // * Instantiate
  const router = useRouter();

  // UseEffects
  useEffect(() => {
    setChecklistStore(checklist);
    setChecklistStore(isChecklistComplete);
    setChecklistStore(isNonMandatoryChecklistComplete);
  }, [checklist]);

  // * action functions
  const handleClose = () => {
    setIsFirstLoginModalOpen(false);
  };

  const handleConfirmEmailModalClick = () => {
    handleClose();

    if (isResendEmail) return;
    updateAccountFirstLoginClient(id);
  };

  const handleSendVerifyEmail = async () => {
    setLoaders((prev) => ({ ...prev, isSendEmailLoading: true }));
    const userId = user.id;
    const accountId = id;

    const resSendEmail = await sendVerificationEmail(userId, accountId, email);
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

  return (
    <div className={`${styles.checklist_page} ${styles.flexCol}`}>
      <Modal
        open={isFirstLoginModalOpen}
        onClose={handleConfirmEmailModalClick}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
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
      <p className=" mt-4 mb-8 text-center md:text-base">
        Complete the following tasks to launch your store!
      </p>
      <div className="px-4 md:bg-white md:p-8 md:mx-8 md:rounded md:shadow lg:mx-52">
        <h3 className="mb-4">Mandatory</h3>
        <div className="flex flex-col gap-2">
          <div className={`${styles.checklist}`}>
            <div className={`${styles.task_group} ${styles.flex}`}>
              <div
                className={`${styles.task} ${styles.flex} ${
                  isEmailVerified && "line-through"
                }`}
              >
                {isEmailVerified ? (
                  <CheckCircleOutlineIcon fontSize="small" color="success" />
                ) : (
                  <ClearIcon fontSize="small" color="disabled" />
                )}
                <p className="text-sm">Verify your email.</p>
              </div>
              <div>
                {isEmailVerified ? (
                  <p className="text-sm font-light">Done</p>
                ) : (
                  <ButtonPrimary
                    handleClick={handleSendVerifyEmail}
                    name="Send"
                  />
                )}
              </div>
            </div>
          </div>
          <div className={`${styles.checklist}`}>
            <div className={`${styles.task_group} ${styles.flex}`}>
              <div
                className={`${styles.task} ${styles.flex} ${
                  isProductsUploaded && "line-through"
                } `}
              >
                {isProductsUploaded ? (
                  <CheckCircleOutlineIcon fontSize="small" color="success" />
                ) : (
                  <ClearIcon fontSize="small" color="disabled" />
                )}
                <p className="text-sm">Upload your products.</p>
              </div>
              <div>
                {isProductsUploaded ? (
                  <p className="text-sm font-light">Done</p>
                ) : (
                  <Link href="/account/inventory/products" className="mt-4 h-8">
                    <ButtonPrimary name="Go" />
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className={`${styles.checklist}`}>
            <div className={`${styles.task_group} ${styles.flex}`}>
              <div
                className={`${styles.task} ${styles.flex} ${
                  isDeliverySet && "line-through"
                }`}
              >
                {isDeliverySet ? (
                  <CheckCircleOutlineIcon fontSize="small" color="success" />
                ) : (
                  <ClearIcon fontSize="small" color="disabled" />
                )}
                <p className="text-sm">Set up your delivery details.</p>
              </div>
              <div>
                {/* //create a link to set delivery details */}
                {isDeliverySet ? (
                  <p className="text-sm font-light">Done</p>
                ) : (
                  <Link
                    href="/account/my-shop/fulfillment"
                    className="mt-4 h-8"
                  >
                    <ButtonPrimary name="Go" />
                  </Link>
                )}
              </div>
            </div>
          </div>
          {requireAvailability && (
            <div className={`${styles.checklist}`}>
              <div className={`${styles.task_group} ${styles.flex}`}>
                <div
                  className={`${styles.task} ${styles.flex} ${
                    isAvailabilitySet && "line-through"
                  }`}
                >
                  {isAvailabilitySet ? (
                    <CheckCircleOutlineIcon fontSize="small" color="success" />
                  ) : (
                    <ClearIcon fontSize="small" color="disabled" />
                  )}
                  <p className="text-sm">Set your availabilites.</p>
                </div>
                <div>
                  {/* //create a link to set delivery details */}
                  {isAvailabilitySet ? (
                    <p className="text-sm font-light">Done</p>
                  ) : (
                    <Link
                      href="/account/my-shop/availability"
                      className="mt-4 h-8"
                    >
                      <ButtonPrimary name="Go" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className={`${styles.checklist}`}>
            <div className={`${styles.task_group} ${styles.flex}`}>
              <div
                className={`${styles.task} ${styles.flex} ${
                  isPaymentsSet && "line-through"
                }`}
              >
                {isPaymentsSet ? (
                  <CheckCircleOutlineIcon fontSize="small" color="success" />
                ) : (
                  <ClearIcon fontSize="small" color="disabled" />
                )}
                <p className="text-sm">Set up your payments.</p>
              </div>
              <div>
                {/* //create a link to set payment details */}
                {isPaymentsSet ? (
                  <p className="text-sm font-light">Done</p>
                ) : (
                  <Link href="/account/my-shop/payments" className="mt-4 h-8">
                    <ButtonPrimary name="Go" />
                  </Link>
                )}
              </div>
            </div>
          </div>
          {/* <div className={`${styles.checklist}`}>
            <div className={`${styles.task_group} ${styles.flex}`}>
              <div
                className={`${styles.task} ${styles.flex} ${
                  hasViewedSupportChannels && "line-through"
                }`}
              >
                {hasViewedSupportChannels ? (
                  <CheckCircleOutlineIcon fontSize="small" color="success" />
                ) : (
                  <ClearIcon fontSize="small" color="disabled" />
                )}
                <p className="text-sm">See how to get support.</p>
              </div>
              <div>
                {hasViewedSupportChannels ? (
                  <p className="text-sm font-light">Done</p>
                ) : (
                  <Link href="/account/support" className="mt-4 h-8">
                    <ButtonPrimary name="Go" />
                  </Link>
                )}
              </div>
            </div>
          </div> */}
        </div>
      </div>

      <div className="px-4 mt-8 md:bg-white md:p-8 md:mx-8 md:rounded md:shadow lg:mx-52">
        <h3 className="mb-4">Suggested</h3>
        <div className="flex flex-col gap-2">
          <div className={`${styles.checklist}`}>
            <div className={`${styles.task_group} ${styles.flex}`}>
              <div
                className={`${styles.task} ${styles.flex} ${
                  hasLogo && hasBanner && "line-through"
                }`}
              >
                {hasLogo && hasBanner ? (
                  <CheckCircleOutlineIcon fontSize="small" color="success" />
                ) : (
                  <ClearIcon fontSize="small" color="disabled" />
                )}
                <p className="text-sm">Update profile banner &amp; logo.</p>
              </div>
              <div>
                {hasLogo && hasBanner ? (
                  <p className="text-sm font-light">Done</p>
                ) : (
                  <Link href="/account/my-shop/profile" className="mt-4 h-8">
                    <ButtonSecondary name="Go" />
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className={`${styles.checklist}`}>
            <div className={`${styles.task_group} ${styles.flex}`}>
              <div
                className={`${styles.task} ${styles.flex} ${
                  hasViewedShareStore && "line-through"
                }`}
              >
                {hasViewedShareStore ? (
                  <CheckCircleOutlineIcon fontSize="small" color="success" />
                ) : (
                  <ClearIcon fontSize="small" color="disabled" />
                )}
                <p className="text-sm">View live shop & share store.</p>
              </div>
              <div>
                {hasViewedShareStore ? (
                  <p className="text-sm font-light">Done</p>
                ) : (
                  <Link href="/account/my-shop/share" className="mt-4 h-8">
                    <ButtonSecondary name="Go" />
                  </Link>
                )}
              </div>
            </div>
          </div>
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
