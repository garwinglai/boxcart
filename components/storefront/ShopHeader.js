import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import ButtonPrimaryStorefront from "../global/buttons/ButtonPrimaryStorefront";
import Drawer from "@mui/material/Drawer";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useAccountStore, useShopperStore } from "@/lib/store";
import { saveContact } from "@/helper/client/api/contacts";
import ButtonSecondaryStorefront from "../global/buttons/ButtonSecondaryStorefront";
import CredentialsModal from "../user/auth/CredentialsModal";
import { useSession } from "next-auth/react";

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
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
};

function ShopHeader({
  isOwner,
  handleOpenSnackbar,
  userAccount,
  handleOpenSignupModal,
  handleCloseSignupModal,
  isSignUpModalOpen,
}) {
  const { data: session, status } = useSession();

  const {
    id: accountId,
    logoImage,
    bannerImage,
    businessName,
  } = userAccount ? userAccount : {};

  const account = useAccountStore((state) => state.account);
  const shopperAccount = useShopperStore((state) => state.shopperAccount);
  const { subdomain } = account;

  const [openMessage, setOpenMessage] = useState({
    right: false,
  });
  const [openSubScribe, setOpenSubscribe] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerEmailSubmitted, setCustomerEmailSubmitted] = useState(false);
  const [messageValues, setMessageValues] = useState({
    fName: "",
    lName: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { fName, lName, email, message } = messageValues;

  const { push } = useRouter();

  useEffect(() => {
    if (status === "unauthenticated" || !session) return;

    const { email } = session.user;

    setCustomerEmail(email);
  }, [status]);

  // Is Owner
  const handleEditProfile = () => {
    push("/app/account/my-shop/profile");
  };

  const handleShareStore = () => {
    push("/app/account/my-shop/share");
  };

  // Is Customer
  const handleOpenSubscribe = () => setOpenSubscribe(true);
  const handleCloseSubscribe = () => setOpenSubscribe(false);

  const handleMessage = (e) => {
    toggleDrawer("right", true)(e);
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setOpenMessage({ ...openMessage, [anchor]: open });
  };

  const handleCloseDrawer = (e) => {
    toggleDrawer("right", false)(e);
    unsetAllStates();
  };

  const handleMessageChange = (e) => {
    const { name, value } = e.target;
    setMessageValues({ ...messageValues, [name]: value });
  };

  const unsetAllStates = () => {
    setMessageValues({
      fName: "",
      lName: "",
      email: "",
      message: "",
    });
  };

  const handleCustomerEmailChange = (e) => {
    const { value } = e.target;
    setCustomerEmail(value);
  };

  const submitCustomerEmail = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    if (!customerEmail)
      return handleOpenSnackbar("Please enter an email address.");

    setIsLoading(true);

    const apiUrl = "/api/public/storefront/subscribe";
    const payload = {
      customerEmail,
      accountId,
      shopperId:
        shopperAccount && shopperAccount.shopperId
          ? shopperAccount.shopperId
          : null,
    };

    const subscribed = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const { errorCode } = await subscribed.json();

    if (errorCode === "P2002") {
      setIsLoading(false);
      return handleOpenSnackbar("You are already subscribed!");
    }

    setIsLoading(false);
    setCustomerEmailSubmitted(true);
    // TODO: send email to customer
  };

  const handleSubscriptionSubmitted = () => {
    handleCloseSubscribe();
    setCustomerEmailSubmitted(false);
    setCustomerEmail("");
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const contactData = {
      fName,
      lName,
      email,
      accountId,
    };

    saveContact(contactData);
    await sendEmailToBusiness(messageValues);
    handleCloseDrawer(e);
    setIsLoading(false);
  };

  const sendEmailToBusiness = async (messageValues) => {
    const emailAPI = "/api/public/storefront/send-email";
    const payload = {
      ...messageValues,
      businessName,
      businessEmail: userAccount.email,
    };

    const email = await fetch(emailAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const { success } = await email.json();

    if (success) {
      handleOpenSnackbar("Message sent");
    } else {
      handleOpenSnackbar("Message failed");
    }
  };

  const connectSubscriberToShopperAccount = async (shopperAccountId) => {
    console.log("customerEmail", customerEmail);
    const apiRoute = "/api/public/storefront/connect-sub-to-shopper";
    const payload = {
      customerEmail,
      shopperId: shopperAccountId,
    };

    const response = await fetch(apiRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const { errorCode, message } = await response.json();
  };

  return (
    <React.Fragment>
      {bannerImage ? (
        <div className="w-full h-36 sm:h-44 md:h-60 lg:h-72 relative border-b">
          <Image
            src={bannerImage}
            alt="business banner"
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="h-40 bg-gray-100 flex justify-center items-center">
          banner.img
        </div>
      )}
      <div className={`relative ${isOwner ? "" : "lg:mx-28"}`}>
        {logoImage ? (
          <div className="w-20 h-20 absolute -top-10 md:-top-12  left-4 md:w-24 md:h-24 lg:left-4">
            <Image
              src={logoImage}
              alt="business logo"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="border border-[color:var(--gray-light-med)] bg-white rounded-full object-contain"
            />
          </div>
        ) : (
          <div className="absolute -top-10 left-4 rounded-full w-20 h-20 bg-[color:var(--gray-light)] flex justify-center items-center border text-[color:var(--gray-text)] text-center">
            Logo
          </div>
        )}
        <div className="gap-2 -top-4 flex absolute right-4">
          <button
            type="button"
            onClick={isOwner ? handleEditProfile : handleOpenSubscribe}
            className="text-white font-light text-xs h-8 px-4 bg-[color:var(--black-design-extralight)] active:bg-black rounded md:text-sm md:px-6"
          >
            {isOwner ? "Edit Profile" : "Subscribe"}
          </button>
          <button
            type="button"
            onClick={isOwner ? handleShareStore : handleMessage}
            className="md:block rounded bg-white font-light text-xs h-8 px-4 border border-[color:var(--black-design-extralight)] active:bg-gray-400 md:text-sm md:px-6"
          >
            {isOwner ? "Share Store" : "Message"}
          </button>
          <Modal
            open={openSubScribe}
            onClose={handleSubscriptionSubmitted}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <form onSubmit={submitCustomerEmail} className="flex flex-col">
                {!customerEmailSubmitted ? (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-light">Stay connected!</h3>
                      <button
                        onClick={handleSubscriptionSubmitted}
                        type="button"
                        className="text-right text-sm font-ligh "
                      >
                        Close
                      </button>
                    </div>
                    <label
                      htmlFor="customerEmail"
                      className="text-[color:var(--black-design-extralight)]"
                    >
                      Email:
                    </label>
                    <input
                      // required
                      type="email"
                      name="customerEmail"
                      id="customerEmail"
                      className="border indent-2 py-1 focus:ring-black"
                      value={customerEmail}
                      onChange={handleCustomerEmailChange}
                    />
                    <div className="mt-4 h-10">
                      <ButtonPrimaryStorefront
                        disabled={isLoading}
                        type="submit"
                        name={isLoading ? "Subscribing..." : "Subscribe"}
                      />
                    </div>
                    <h5 className="mt-4 font-light text-sm text-[color:var(--black-design-extralight)]">
                      Receive updates, discounts, &amp; more!
                    </h5>
                  </>
                ) : (
                  <>
                    <h3 className="font-medium text-center">
                      Thank&apos;s for the sub! 😊
                    </h3>
                    {!session && status === "unauthenticated" && (
                      <p className="text-center my-2 text-sm border-b pb-4">
                        Create an account to keep track of your subs, orders,
                        deals, and more!
                      </p>
                    )}
                    <p className="text-xs text-center font-light mt-2">
                      Look out for updates &amp; deals in your email.
                    </p>
                    <div className="flex gap-4 mt-4">
                      {!session && status === "unauthenticated" && (
                        <div className="h-10 flex-grow">
                          <ButtonPrimaryStorefront
                            handleClick={handleOpenSignupModal}
                            type="button"
                            name="Signup"
                          />
                        </div>
                      )}
                      <div className="h-10 flex-grow">
                        <ButtonSecondaryStorefront
                          handleClick={handleSubscriptionSubmitted}
                          type="button"
                          name="Close"
                        />
                      </div>
                    </div>
                  </>
                )}
              </form>
            </Box>
          </Modal>
          <CredentialsModal
            isModalOpen={isSignUpModalOpen}
            handleClose={handleCloseSignupModal}
            isSubscribing={true}
            customerEmail={customerEmail}
            connectSubscriberToShopperAccount={
              connectSubscriberToShopperAccount
            }
          />
          <Drawer
            anchor={"right"}
            open={openMessage["right"]}
            onClose={toggleDrawer("right", false)}
          >
            <form
              onSubmit={handleSendMessage}
              className=" w-screen bg-[color:var(--gray-light)] min-h-screen p-4 flex flex-col gap-4 overflow-y-scroll pb-28 md:w-[60vw] lg:w-[45vw] xl:w-[35vw]"
            >
              <div className="flex justify-between items-center border-b pb-4">
                <span className="flex gap-4 items-center">
                  <h2>Message:</h2>
                </span>
                <button
                  className="flex text-[color:var(--third-dark)] "
                  onClick={handleCloseDrawer}
                  type="button"
                >
                  <ChevronLeftIcon />
                  <p>close</p>
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <p className="mb-4 mt-2">Leave us a message!</p>
                <div className="flex gap-4">
                  <div className="flex flex-col flex-grow">
                    <label
                      htmlFor="fName"
                      className="text-[color:var(--black-design-extralight)]"
                    >
                      First Name:*
                    </label>
                    <input
                      required
                      type="text"
                      name="fName"
                      id="fName"
                      className="border indent-2 py-1 focus:ring-black"
                      value={fName}
                      onChange={handleMessageChange}
                    />
                  </div>
                  <div className="flex flex-col flex-grow">
                    <label
                      htmlFor="lName"
                      className="text-[color:var(--black-design-extralight)]"
                    >
                      Last Name:*
                    </label>
                    <input
                      required
                      type="lName"
                      name="lName"
                      id="lName"
                      className="border indent-2 py-1 focus:ring-black"
                      value={lName}
                      onChange={handleMessageChange}
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="email"
                    className="text-[color:var(--black-design-extralight)]"
                  >
                    Email*
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    id="email"
                    className="border indent-2 py-1 focus:ring-black"
                    value={email}
                    onChange={handleMessageChange}
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="message"
                    className="text-[color:var(--black-design-extralight)]"
                  >
                    Message:*
                  </label>
                  <textarea
                    required
                    name="message"
                    id="message"
                    className="border indent-2 py-1 focus:ring-black"
                    value={message}
                    onChange={handleMessageChange}
                  />
                </div>
              </div>
              <div className="mt-4 h-8">
                <ButtonPrimaryStorefront
                  disabled={isLoading}
                  type="submit"
                  name={isLoading ? "Sending..." : "Send"}
                />
              </div>
            </form>
          </Drawer>
        </div>
      </div>
    </React.Fragment>
  );
}

export default ShopHeader;
