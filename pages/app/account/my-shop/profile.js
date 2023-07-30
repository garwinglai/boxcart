import React, { useRef, useState, useEffect } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import TextField from "@mui/material/TextField";
import candle_logo_temp from "@/public/images/temp/candle_logo_temp.jpeg";
import candle_banner_temp from "@/public/images/temp/candle_banner.jpeg";
import Image from "next/image";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import group_icon from "@/public/images/icons/group_icon.png";
import ShopPreview from "@/components/app/my-shop/ShopPreview";
import { Alert, Switch } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import SaveCancelButtons from "@/components/app/design/SaveCancelButtons";
import { isAuth } from "@/helper/client/auth/isAuth";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import ButtonFourth from "@/components/global/buttons/ButtonFourth";
import ButtonThird from "@/components/global/buttons/ButtonThird";
import facebook_icon from "@/public/images/icons/socials/facebook_icon.png";
import instagram_icon from "@/public/images/icons/socials/instagram_icon.png";
import youtube_icon from "@/public/images/icons/socials/youtube_icon.png";
import tiktok_icon from "@/public/images/icons/socials/tiktok_icon.png";
import link_icon from "@/public/images/icons/socials/link_icon.png";
import { updateAccountSettingsClient } from "@/helper/client/api/account/account-schema";
import prisma from "@/lib/prisma";

const styleMobile = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  // border: "2px solid #000",
  borderRadius: 1,
  boxShadow: 24,
  p: 4,
};

function Profile({ userAccount }) {
  const { id: accountId } = userAccount || {};

  const [subscriberCount, setSubscriberCount] = useState(0);
  const [businessInfo, setBusinessInfo] = useState({
    businessName: userAccount.businessName ? userAccount.businessName : "",
    email: userAccount.email ? userAccount.email : "",
    businessBio: userAccount.businessBio ? userAccount.businessBio : "",
  });
  const [addressValues, setAddressValues] = useState({
    address_1: userAccount.address_1 ? userAccount.address_1 : "",
    address_2: userAccount.address_2 ? userAccount.address_2 : "",
    city: userAccount.city ? userAccount.city : "",
    state: userAccount.state ? userAccount.state : "",
    zip: userAccount.zip ? userAccount.zip : "",
  });
  const [socialLinkInput, setSocialLinkInput] = useState({
    platform: "",
    socialLink: "",
  });
  const [socialLinks, setSocialLinks] = useState(
    userAccount.socials ? userAccount.socials : []
  );
  const [removedSocialLinks, setRemovedSocialLinks] = useState([]);
  const [alert, setAlert] = useState({
    showAlert: false,
    alertMsg: "",
  });
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { businessName, email, businessBio } = businessInfo;
  const { address_1, address_2, city, state, zip } = addressValues;
  const { platform, socialLink } = socialLinkInput;
  const { showAlert, alertMsg } = alert;

  const uploadLogoRef = useRef(null);
  const uploadBannerRef = useRef(null);

  const handleEditLogoClick = (imageType) => () => {
    if (imageType === "banner") {
      uploadBannerRef.current.click();
    }

    if (imageType === "logo") {
      uploadLogoRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const [name, files] = e.target;
    const logoFile = files[0];

    if (name === "banner") {
    }

    if (name === "logo") {
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "businessBio") {
      const bioLength = value.length;

      if (bioLength > 300) {
        setAlert({
          showAlert: true,
          alertMsg: "Bio length reached.",
        });
        return;
      }
    }

    setBusinessInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeAddress = (e) => {
    const { name, value } = e.target;

    setAddressValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialLinkChange = (e) => {
    const { name, value } = e.target;
    const lowerCaseValue = value.toLowerCase();

    setSocialLinkInput((prev) => ({ ...prev, [name]: lowerCaseValue }));
  };

  const handleAddSocialLink = async () => {
    if (platform === "" || socialLink === "") {
      setAlert({
        showAlert: true,
        alertMsg: "Missing socials information.",
      });
      return;
    }

    // check if socialLink already exists in socialLinks, if yes, return
    const isSocialLinkAlreadyAdded = socialLinks.find(
      (social) => social.socialLink === socialLink
    );

    if (isSocialLinkAlreadyAdded) {
      setAlert({
        showAlert: true,
        alertMsg: "Duplicate link.",
      });
      return;
    }

    // Check if url is a proper url
    const urlRegex = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i" // fragment locator
    );

    if (!urlRegex.test(socialLink)) {
      setAlert({
        showAlert: true,
        alertMsg: "Invalid url.",
      });
      return;
    }

    getSocialFollowingCount(socialLink);

    const data = {
      platform,
      socialLink,
    };

    setSocialLinks((prev) => [...prev, data]);
    setSocialLinkInput({ platform: "", socialLink: "" });
  };

  const closeAlert = () => {
    setAlert({ showAlert: false, alertMsg: "" });
  };

  const handleCancel = (e) => {
    setIsCancelModalOpen(true);
  };

  const closeCancelModal = () => {
    setIsCancelModalOpen(false);
  };

  const handleRemoveSocialLink = (socialLink) => () => {
    // check if url is in orginal social links prop from userAccount. If yes, add the original social link to removedSocialLinks
    const isSocialLinkInOriginal = userAccount.socials.find(
      (social) => social.socialLink === socialLink
    );

    if (isSocialLinkInOriginal) {
      setRemovedSocialLinks((prev) => [...prev, isSocialLinkInOriginal]);
    }

    // if url is in social links, remove it
    const newSocialLinks = socialLinks.filter(
      (social) => social.socialLink !== socialLink
    );

    setSocialLinks(newSocialLinks);
  };

  const handleCancelAllUpdates = () => {
    setIsCancelModalOpen(false);

    // reset all values
    setBusinessInfo({
      businessName: userAccount.businessName ? userAccount.businessName : "",
      email: userAccount.email ? userAccount.email : "",
      businessBio: userAccount.businessBio ? userAccount.businessBio : "",
    });

    setAddressValues({
      address_1: userAccount.address_1 ? userAccount.address_1 : "",
      address_2: userAccount.address_2 ? userAccount.address_2 : "",
      city: userAccount.city ? userAccount.city : "",
      state: userAccount.state ? userAccount.state : "",
      zip: userAccount.zip ? userAccount.zip : "",
    });

    setSocialLinks(userAccount.socials ? userAccount.socials : []);
    setSocialLinkInput({
      platform: "",
      socialLink: "",
    });

    setIsLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const updatedSettings = {
      businessName,
      email,
      businessBio,
      address_1,
      address_2,
      city,
      state,
      zip,
    };

    const data = {
      accountId,
      updatedSettings,
      socialLinks,
      removedSocialLinks,
    };

    try {
      const { success, value, error } = await updateAccountSettingsClient(data);

      if (success) {
        setAlert({
          showAlert: true,
          alertMsg: "Saved.",
        });
      } else {
        setAlert({
          showAlert: true,
          alertMsg: "Error saving.",
        });
      }
    } catch (error) {
      console.log("error", error);
      setAlert({
        showAlert: true,
        alertMsg: "Error saving.",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className=" pb-32 lg:flex  lg:justify-center  ">
      <Snackbar
        open={showAlert}
        autoHideDuration={3000}
        onClose={closeAlert}
        message={alertMsg}
      />

      <form onSubmit={handleSave} className="lg:w-1/2 p-4 flex flex-col gap-4 ">
        <div className="p-4 rounded flex flex-col gap-2 relative  bg-white   shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)]">
          <h3>Business Info</h3>
          <div className="absolute mt-11 pr-4">
            <Image
              src={candle_banner_temp}
              alt="banner image"
              className="rounded w-screen h-32 block  object-cover"
            />
            <button
              onClick={handleEditLogoClick("banner")}
              className="flex border border-gray-300 w-fit py-1 px-2 gap-1 rounded-full absolute -bottom-4 ml-auto right-3 bg-gray-100"
            >
              <CameraAltIcon fontSize="small" color="disabled" />
              <p className="text-gray-600 font-light text-sm">Edit</p>
            </button>
            <input
              type="file"
              id="banner"
              name="banner"
              ref={uploadBannerRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <div className="flex flex-col items-center mt-16 pt-2 z-10">
            <Image
              src={candle_logo_temp}
              alt="logo icon"
              className="w-28 h-28 object-contain rounded-full border border-gray-300 shadow-md"
            />
            <button
              onClick={handleEditLogoClick("logo")}
              className="flex border border-gray-300 w-fit py-1 px-2 gap-1 rounded-full relative bottom-3 bg-gray-100"
            >
              <CameraAltIcon fontSize="small" color="disabled" />
              <p className="text-gray-600 font-light text-sm">Edit</p>
            </button>
            <input
              type="file"
              id="logo"
              name="logo"
              ref={uploadLogoRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <div className="flex flex-col gap-3">
            <div>
              <label htmlFor="business-name " className="font-light text-sm">
                Business name: *
              </label>
              <TextField
                fullWidth
                required
                id="business-name"
                variant="outlined"
                size="small"
                name="businessName"
                value={businessName}
                onChange={handleChange}
                color="warning"
              />
            </div>
            <div>
              <label htmlFor="email" className="font-light text-sm">
                Email: *
              </label>
              <TextField
                fullWidth
                required
                id="email"
                variant="outlined"
                size="small"
                name="email"
                value={email}
                type={"email"}
                onChange={handleChange}
                color="warning"
              />
            </div>
            <div>
              <label htmlFor="businessBio" className="font-light text-sm">
                Bio:
              </label>
              <TextField
                multiline
                rows={4}
                fullWidth
                id="businessBio"
                name="businessBio"
                variant="outlined"
                size="small"
                value={businessBio}
                onChange={handleChange}
                color="warning"
              />
              <p className="text-gray-500 text-sm font-light text-right">
                {businessBio.length}/300
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 flex flex-col gap-2 bg-white rounded  shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)]">
          <h3>Address</h3>
          <div className="flex flex-col gap-3">
            <div>
              <label htmlFor="address_1" className="font-light text-sm">
                Address 1: *
              </label>
              <TextField
                fullWidth
                required
                id="address_1"
                variant="outlined"
                size="small"
                name="address_1"
                value={address_1}
                onChange={handleChangeAddress}
                color="warning"
              />
            </div>
            <div>
              <label htmlFor="address_2" className="font-light text-sm">
                Address 2: *
              </label>
              <TextField
                fullWidth
                id="address_2"
                variant="outlined"
                size="small"
                name="address_2"
                value={address_2}
                onChange={handleChangeAddress}
                color="warning"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col">
                <label htmlFor="city" className="font-light text-sm">
                  City: *
                </label>
                <TextField
                  // fullWidth
                  required
                  id="city"
                  variant="outlined"
                  size="small"
                  name="city"
                  value={city}
                  onChange={handleChangeAddress}
                  color="warning"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="state" className="font-light text-sm">
                  State: *
                </label>
                <TextField
                  // fullWidth
                  required
                  id="state"
                  variant="outlined"
                  size="small"
                  name="state"
                  inputProps={{ maxLength: 2 }}
                  value={state}
                  onChange={handleChangeAddress}
                  color="warning"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="zip" className="font-light text-sm">
                  Zip: *
                </label>
                <TextField
                  fullWidth
                  required
                  id="zip"
                  variant="outlined"
                  size="small"
                  name="zip"
                  value={zip}
                  type={"number"}
                  onChange={handleChangeAddress}
                  color="warning"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 flex flex-col gap-4 bg-white rounded  shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)]">
          <h3>Social links</h3>
          <div>
            <label htmlFor="platform" className="font-light text-sm">
              Platform name:
            </label>
            <TextField
              fullWidth
              id="platform"
              variant="outlined"
              size="small"
              color="warning"
              name="platform"
              onChange={handleSocialLinkChange}
              value={platform}
            />
          </div>
          <div>
            <label htmlFor="socialLink" className="font-light text-sm">
              Social link:
            </label>
            <TextField
              fullWidth
              id="socialLink"
              variant="outlined"
              size="small"
              color="warning"
              name="socialLink"
              onChange={handleSocialLinkChange}
              value={socialLink}
              className="placeholder:text-sm"
            />
          </div>
          <div className="w-fit ml-auto">
            <ButtonPrimary
              type="button"
              name="Add"
              handleClick={handleAddSocialLink}
            />
          </div>
          <h3>Added socials:</h3>
          {socialLinks.length === 0 ? (
            <div className="flex flex-col items-center mb-8">
              <Image
                src={group_icon}
                alt="group icon"
                className="mt-4 opacity-50 w-12 h-12"
              />
              <p className="text-gray-400 font-light">No socials connected.</p>
            </div>
          ) : (
            socialLinks.map((social, index) => {
              const { platform, socialLink } = social;

              const platformIcon = (platform) => {
                switch (platform) {
                  case "facebook":
                    return facebook_icon;
                  case "instagram":
                    return instagram_icon;
                  case "youtube":
                    return youtube_icon;
                  case "tiktok":
                    return tiktok_icon;
                  default:
                    return link_icon;
                }
              };

              return (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <Image
                      src={platformIcon(platform)}
                      alt="instagram icon"
                      className="w-12 opacity-70"
                    />
                    <p className="text-gray-400 font-light">{socialLink}</p>
                  </div>
                  <IconButton onClick={handleRemoveSocialLink(socialLink)}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </div>
              );
            })
          )}
        </div>
        <div className="fixed bottom-[3.3rem] z-10 border-b w-full bg-white border-t p-4 md:w-[calc(100%-225px)] md:bottom-0 lg:left-0 lg:ml-[225px]">
          <div className="lg:w-2/5 lg:ml-auto">
            <SaveCancelButtons
              handleCancel={handleCancel}
              cancelButtonType="button"
              isLoading={isLoading}
              saveButtonType="submit"
            />
          </div>
          <Modal
            open={isCancelModalOpen}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={styleMobile}>
              {/* <h4>Cancel</h4> */}
              <p>Cancel all updates?</p>
              <div className="flex justify-end mt-6 gap-4">
                <ButtonFourth name="No" handleClick={closeCancelModal} />
                <ButtonThird
                  name="Yes, cancel"
                  handleClick={handleCancelAllUpdates}
                />
              </div>
            </Box>
          </Modal>
        </div>
      </form>
      <div className="hidden lg:block lg:w-1/2 lg:mt-4 ">
        <div className="sticky top-[2rem]">
          <h4>Shop Preview</h4>
          <ShopPreview
            businessName={businessName}
            businessBio={businessBio}
            city={city}
            socialLinks={socialLinks}
          />
        </div>
      </div>
    </div>
  );
}

export default Profile;

export async function getServerSideProps(context) {
  return isAuth(context, async (userSession) => {
    const { user } = userSession;
    const { name, email, id } = user;
    let serializedAccount;

    try {
      const userAccount = await prisma.account.findUnique({
        where: {
          email,
        },
        include: {
          socials: true,
        },
      });

      serializedAccount = JSON.parse(JSON.stringify(userAccount));
    } catch (error) {
      console.log("serversideprops checklist error:", error);
      serializedAccount = null;
    }

    return {
      props: {
        userSession,
        userAccount: serializedAccount,
      },
    };
  });
}

Profile.getLayout = function getLayout(
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

Profile.pageTitle = "Profile";
Profile.pageIcon = <EditRoundedIcon />;
Profile.pageRoute = "profile";
Profile.mobilePageRoute = "profile";
