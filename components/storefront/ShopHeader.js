import React, { useState } from "react";
import candle_banner_temp from "@/public/images/temp/candle_banner.jpeg";
import candle_logo_temp from "@/public/images/temp/candle_logo_temp.jpeg";
import boxcart_logo from "@/public/images/logos/boxcart_logo_full.png";
import Image from "next/image";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ShareIcon from "@mui/icons-material/Share";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import ButtonPrimaryStorefront from "../global/buttons/ButtonPrimaryStorefront";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  // borderRadius: "4px",
  boxShadow: 24,
  p: 4,
};

function ShopHeader({ isOwner, accountId, handleOpenSnackbar }) {
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

  // Is Owner
  const handleEditProfile = () => {
    push("/account/my-shop/profile");
  };

  const handleShareStore = () => {
    push("/account/my-shop/share");
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
    setCustomerEmail("");
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

    // TODO: send Email - open snackbar on success & close drawer
    saveContact();
    handleCloseDrawer(e);
    setIsLoading(false);
  };

  const saveContact = async () => {
    const apiUrl = "/api/public/storefront/message";

    const payload = {
      contact: {
        fName,
        lName,
        email,
      },
      accountId,
    };

    const contact = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const { errorCode } = await contact.json();

    if (errorCode === "P2002") {
      // Contact already added, don't need to handle error
    }
  };

  return (
    <React.Fragment>
      <Image
        src={candle_banner_temp}
        alt="business banner image"
        className="w-full object-contain xl:h-[20rem] xl:object-cover border-b"
      />
      <div className="relative">
        <Image
          src={boxcart_logo}
          alt="business logo"
          className="border border-[color:var(--gray-light-med)] bg-white rounded-full w-24 h-24 absolute -top-12 left-4 md:w-32 md:h-32 md:-top-16 md:left-8 "
        />
        <div className="flex h-10 gap-2 absolute right-4 -top-5 md:top-4 md:right-8">
          <button
            type="button"
            onClick={isOwner ? handleEditProfile : handleOpenSubscribe}
            className="text-white font-light text-sm py-1 px-6 bg-[color:var(--black-design-extralight)] active:bg-black"
          >
            {isOwner ? "Edit Profile" : "Subscribe"}
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
                    <button
                      onClick={handleSubscriptionSubmitted}
                      type="button"
                      className="text-right text-sm font-light mb-2 "
                    >
                      Close
                    </button>
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
                    <div className="mt-4 h-8">
                      <ButtonPrimaryStorefront
                        disabled={isLoading}
                        type="submit"
                        name={isLoading ? "Subscribing..." : "Subscribe"}
                      />
                    </div>
                    <h5 className="mt-4 font-light text-[color:var(--black-design-extralight)]">
                      Updates, discounts, &amp; more!
                    </h5>
                  </>
                ) : (
                  <>
                    <h4 className="font-light text-center">
                      Thank&apos;s for the sub!
                    </h4>
                    <p className="text-center font-light mt-1">
                      Look out for updates &amp; deals in your email.
                    </p>
                    <div className="mt-4 h-8">
                      <ButtonPrimaryStorefront
                        handleClick={handleSubscriptionSubmitted}
                        type="button"
                        name="OK 😊"
                      />
                    </div>
                  </>
                )}
              </form>
            </Box>
          </Modal>
          <button
            type="button"
            onClick={isOwner ? handleShareStore : handleMessage}
            className="md:block bg-white font-light text-sm py-2 px-6 border border-[color:var(--black-design-extralight)] active:bg-gray-400"
          >
            {isOwner ? "Share Store" : "Message"}
          </button>
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
                  {/* <Image
                    src={product_tag_icon}
                    alt="bardcode icon"
                    className="w-[3rem] h-[3rem]"
                  /> */}
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
