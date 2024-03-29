import React, { useRef, useState, useEffect } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import TextField from "@mui/material/TextField";
import Image from "next/image";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import group_icon from "@/public/images/icons/group_icon.png";
import ShopPreview from "@/components/app/my-shop/ShopPreview";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import SaveCancelButtons from "@/components/app/design/SaveCancelButtons";
import { isAuth } from "@/helper/server/auth/isAuth";
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
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage, createGeoHash } from "@/firebase/fireConfig";
import Geocode from "react-geocode";
import { useAccountStore, useChecklistStore } from "@/lib/store";
import { checkSubdomainTakenAccount } from "@/helper/client/api/account/subdomain";
import { checkEmailAvailableAccount } from "@/helper/client/api/account/email";
import Pill from "@/components/global/identities/Pill";
import ButtonSecondary from "@/components/global/buttons/ButtonSecondary";
import IdentityModal from "@/components/app/business-identities/IdentityModal";

Geocode.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_GEO_API_KEY);
Geocode.setLanguage("en");

const styleMobile = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  borderRadius: 1,
  boxShadow: 24,
  p: 4,
};

function Profile({ userAccount }) {
  const {
    id: accountId,
    logoImage: logoImg,
    bannerImage: bannerImg,
    logoImageFileName,
    bannerImageFileName,
  } = userAccount || {};

  const account = useAccountStore((state) => state.account);
  const setAccount = useAccountStore((state) => state.setAccount);
  const checklistStore = useChecklistStore((state) => state.checklist);
  const setChecklistStore = useChecklistStore((state) => state.setChecklist);

  const [openBusinessIdentity, setOpenBusinessIdentity] = useState(false);
  const [isBusinessIdentityLoading, setIsBusinessIdentityLoading] =
    useState(false);
  const [businessIdentities, setBusinessIdentities] = useState(
    userAccount.businessIdentities
      ? userAccount.businessIdentities.split(", ")
      : []
  );
  const [noIdentitySelectedError, setNoIdentitySelectedError] = useState(false);
  const [tooManyIdentitiesError, setTooManyIdentitiesError] = useState(false);

  const [initialUserAccount, setInitialUserAccount] = useState(userAccount);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [businessInfo, setBusinessInfo] = useState({
    businessName: userAccount.businessName ? userAccount.businessName : "",
    email: userAccount.email ? userAccount.email : "",
    businessBio: userAccount.businessBio ? userAccount.businessBio : "",
  });
  const [fullSubdomain, setFullSubdomain] = useState(userAccount.fullDomain);
  const [subdomain, setSubdomain] = useState(userAccount.subdomain);
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
  const [fetchedBannerFileName, setFetchedBannerFileName] = useState(
    bannerImageFileName ? bannerImageFileName : null
  );
  const [bannerImage, setBannerImage] = useState(bannerImg ? bannerImg : null);
  const [bannerImageValues, setBannerImageValues] = useState({
    bannerFile: null,
    bannerFileName: "",
  });
  const [fetchedLogoFileName, setFetchedLogoFileName] = useState(
    logoImageFileName ? logoImageFileName : null
  );
  const [logoImage, setLogoImage] = useState(logoImg ? logoImg : null);
  const [logoImageValues, setLogoImageValues] = useState({
    logoFile: null,
    logoFileName: "",
  });
  const [isBannerImageUploading, setIsBannerImageUploading] = useState(false);
  const [bannerUploadPercent, setBannerUploadPercent] = useState("0%");
  const [isLogoImageUploading, setIsLogoImageUploading] = useState(false);
  const [logoUploadPercent, setLogoUploadPercent] = useState("0%");
  const [showCancelSaveButtons, setShowCancelSaveButtons] = useState(false);

  const { businessName, email, businessBio } = businessInfo;
  const { address_1, address_2, city, state, zip } = addressValues;
  const { platform, socialLink } = socialLinkInput;
  const { showAlert, alertMsg } = alert;
  const { bannerFile, bannerFileName } = bannerImageValues;
  const { logoFile, logoFileName } = logoImageValues;

  const uploadLogoRef = useRef(null);
  const uploadBannerRef = useRef(null);

  // Check if any changes - show save cancel buttons.
  useEffect(() => {
    checkIfChangesWereMade(initialUserAccount);
  }, [
    businessName,
    email,
    businessBio,
    address_1,
    address_2,
    city,
    state,
    zip,
    platform,
    socialLink,
    logoFileName,
    bannerFileName,
    socialLinks,
    subdomain,
    initialUserAccount,
  ]);

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

    setIsBusinessIdentityLoading(true);
    const identities = businessIdentities.join(", ");

    const data = { id: accountId, businessIdentities: identities };

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
    setIsBusinessIdentityLoading(false);
  };

  const handleChangeBusinessIdentities = (e) => {
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
  };

  const isBusinessIdentityChecked = (name) => {
    if (businessIdentities.length !== 0) {
      const isChecked = businessIdentities.includes(name);

      if (isChecked) {
        return true;
      }
      return false;
    }
    return false;
  };

  const checkIfChangesWereMade = (userAccount) => {
    const {
      businessName,
      email,
      businessBio,
      fullAddress,
      socials,
      address_1,
      address_2,
      city,
      state,
      zip,
      bannerImageFileName,
      logoImageFileName,
    } = userAccount;

    const businessNameChanged = businessName !== businessInfo.businessName;
    const emailChanged = email !== businessInfo.email;
    const businessBioChanged = businessBio !== businessInfo.businessBio;
    const subDomainChanged = subdomain !== userAccount.subdomain;

    const addy1Changed = address_1 !== addressValues.address_1;
    const addy2Changed = address_2 !== addressValues.address_2;
    const cityChanged = city !== addressValues.city;
    const stateChanged = state !== addressValues.state;
    const zipChanged = zip !== addressValues.zip;

    const logoImageChanged = logoFileName !== "";
    const bannerImageChanged = bannerFileName !== "";
    // const newSocials = socialLink !== "";
    // const newPlatform = platform !== "";
    const socialsChanged = socials.length !== socialLinks.length;

    const socialsAreDifferent = socials.some((social) => {
      const isSocialLinkInSocials = socialLinks.find(
        (link) => link.socialLink === social.socialLink
      );

      if (!isSocialLinkInSocials) {
        return true;
      }
      return false;
    });

    // check if any of the values are different from the original, if so, show the save/cancel buttons
    if (
      businessNameChanged ||
      emailChanged ||
      businessBioChanged ||
      subDomainChanged ||
      logoImageChanged ||
      bannerImageChanged ||
      socialsChanged ||
      socialsAreDifferent ||
      addy1Changed ||
      addy2Changed ||
      cityChanged ||
      stateChanged ||
      zipChanged
    ) {
      setShowCancelSaveButtons(true);
    } else {
      setShowCancelSaveButtons(false);
    }
  };

  const handleEditBannerClick = (e) => {
    uploadBannerRef.current.click();
  };

  const handleEditLogoClick = (e) => {
    uploadLogoRef.current.click();
  };

  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (!file) return;
    const fileName = file.name;
    const imgUrl = URL.createObjectURL(file);

    if (name === "banner") {
      setBannerImage(imgUrl);
      setBannerImageValues({ bannerFile: file, bannerFileName: fileName });
    }

    if (name === "logo") {
      setLogoImage(imgUrl);
      setLogoImageValues({ logoFile: file, logoFileName: fileName });
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

    // getSocialFollowingCount(socialLink);

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

  const handleChangeSubdomain = (e) => {
    const { value } = e.target;

    setSubdomain(value);
  };

  const handleCancelAllUpdates = (initialUserAccount) => (e) => {
    setIsCancelModalOpen(false);
    setShowCancelSaveButtons(false);

    setLogoImage(logoImg ? logoImg : null);
    setBannerImage(bannerImg ? bannerImg : null);
    setBannerImageValues({
      bannerFile: null,
      bannerFileName: "",
    });
    setLogoImageValues({
      logoFile: null,
      logoFileName: "",
    });
    setSubdomain(initialUserAccount.subdomain);

    // reset all values
    setBusinessInfo({
      businessName: initialUserAccount.businessName
        ? initialUserAccount.businessName
        : "",
      email: initialUserAccount.email ? initialUserAccount.email : "",
      businessBio: initialUserAccount.businessBio
        ? initialUserAccount.businessBio
        : "",
    });

    setAddressValues({
      address_1: initialUserAccount.address_1
        ? initialUserAccount.address_1
        : "",
      address_2: initialUserAccount.address_2
        ? initialUserAccount.address_2
        : "",
      city: initialUserAccount.city ? initialUserAccount.city : "",
      state: initialUserAccount.state ? initialUserAccount.state : "",
      zip: initialUserAccount.zip ? initialUserAccount.zip : "",
    });

    setSocialLinks(
      initialUserAccount.socials ? initialUserAccount.socials : []
    );
    setSocialLinkInput({
      platform: "",
      socialLink: "",
    });

    setIsLoading(false);
  };

  const checkSubdomainValidEntry = (subdomain) => {
    const subdomainRegex = /^[A-Za-z0-9]+([-][A-Za-z0-9]+)*$/;
    const subdomainMatchRegex = subdomainRegex.test(subdomain);
    if (!subdomainMatchRegex) {
      setAlert({
        showAlert: true,
        alertMsg:
          "Please enter a proper subdomain. (No spaces or symbols). Hyphens allowed.",
      });
      return false;
    }
    return true;
  };

  const checkEmailRegex = (email) => {
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const emailMatchRegex = emailRegex.test(email);
    if (!emailMatchRegex) {
      setAlert({
        showAlert: true,
        alertMsg: "Please enter a valid email address.",
      });
      return false;
    }
    return true;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let updatedAccount;
    let bannerImageStorage = bannerImage;
    let logoImageStorage = logoImage;
    let bannerError = false;
    let logoError = false;
    let geohash = "";
    let lat = "";
    let lng = "";
    let fullAddress = address_2
      ? address_1 + " " + address_2 + " " + city + " " + state + " " + zip
      : address_1 + " " + city + " " + state + " " + zip;

    const subDomainChanged = subdomain !== initialUserAccount.subdomain;
    const emailChanged = email !== initialUserAccount.email;

    if (emailChanged) {
      const isEmailValid = checkEmailRegex(email);
      if (!isEmailValid) return;

      const emailAvailable = await checkEmailAvailableAccount(email);

      if (!emailAvailable.success) {
        setAlert({
          showAlert: true,
          alertMsg: "Unknown error.",
        });
        setIsLoading(false);
        return;
      }

      if (emailAvailable.value) {
        setAlert({
          showAlert: true,
          alertMsg: "Email in use.",
        });
        setIsLoading(false);
        return;
      }
    }

    if (subDomainChanged) {
      const isValid = checkSubdomainValidEntry(subdomain);
      if (!isValid) return;

      const { success, value } = await checkSubdomainTakenAccount(subdomain);

      if (!success) {
        setAlert({
          showAlert: true,
          alertMsg: "Unknown error.",
        });
        setIsLoading(false);
        return;
      }

      if (value) {
        setAlert({
          showAlert: true,
          alertMsg: "Subdomain already taken.",
        });
        setIsLoading(false);
        return;
      }
    }

    // TODO: stop each action if failed
    if (bannerFile) {
      // Delete if bannerImageFileName was fetched from storage
      if (fetchedBannerFileName && fetchedBannerFileName != bannerFileName) {
        const { success } = await deleteImageFromFirebaseStorage(
          fetchedBannerFileName,
          subdomain,
          "banner"
        );
      }

      const { url, error } = await updateImageToFirebaseStorage(
        bannerFile,
        bannerFileName,
        subdomain,
        "banner"
      );

      if (error) {
        bannerError = true;
      } else {
        bannerImageStorage = url;
        setFetchedBannerFileName(bannerFileName);
        setChecklistStore({ hasBanner: true });
      }
    }

    if (logoFile) {
      // Delete if logoImageFileName was fetched from storage
      if (fetchedLogoFileName && fetchedLogoFileName != logoFileName) {
        const { success } = await deleteImageFromFirebaseStorage(
          fetchedLogoFileName,
          subdomain,
          "logo"
        );
      }

      const { url, error } = await updateImageToFirebaseStorage(
        logoFile,
        logoFileName,
        subdomain,
        "logo"
      );

      if (error) {
        logoError = true;
      } else {
        logoImageStorage = url;
        setFetchedLogoFileName(logoFileName);
        setChecklistStore({ hasLogo: true });
      }
    }

    let nonMandatoryChecklistComplete = false;

    if (logoImageStorage && bannerImageStorage) {
      const { hasViewedShareStore, isNonMandatoryChecklistComplete } =
        checklistStore;

      if (isNonMandatoryChecklistComplete) nonMandatoryChecklistComplete = true;

      if (!isNonMandatoryChecklistComplete && hasViewedShareStore) {
        setChecklistStore({ isNonMandatoryChecklistComplete: true });
        nonMandatoryChecklistComplete = true;
      }
    }

    if (address_1 !== "" && city !== "" && state !== "" && zip !== "") {
      try {
        const { lat: latitude, lng: longitude } = await getLatLngFromAddress(
          fullAddress
        );
        lat = latitude;
        lng = longitude;
      } catch (error) {
        console.log("getAddylatlng", error);
      }
    }

    // create geoHash with lat lng
    if (lat !== "" && lng !== "") {
      try {
        const geoHash = await createGeoHash(lat, lng);
        geohash = geoHash;
      } catch (error) {
        console.log("geohash error", error);
        // todo: handle geohash error
      }
    }

    const fullDomain = "boxcart.shop/" + subdomain;

    const updatedSettings = {
      businessName,
      email,
      businessBio,
      address_1,
      address_2,
      city,
      state,
      zip,
      lat,
      lng,
      geohash,
      logoImage: logoImageStorage,
      bannerImage: bannerImageStorage,
      logoImageFileName: logoFileName ? logoFileName : logoImageFileName,
      bannerImageFileName: bannerFileName
        ? bannerFileName
        : bannerImageFileName,
      isNonMandatoryChecklistComplete: nonMandatoryChecklistComplete,
      subdomain,
      fullDomain,
    };

    const data = {
      accountId,
      updatedSettings,
      socialLinks,
      removedSocialLinks,
    };

    try {
      const { success, value, error } = await updateAccountSettingsClient(data);

      if (!success) {
        setAlert({
          showAlert: true,
          alertMsg: "Error saving.",
        });
        setIsLoading(false);
        return;
      }

      updatedAccount = value;
      setInitialUserAccount(updatedAccount);
    } catch (error) {
      console.log("error", error);
      setAlert({
        showAlert: true,
        alertMsg: "Error saving.",
      });
    }

    if (
      lat !== userAccount.lat ||
      lng !== userAccount.lng ||
      geohash !== userAccount.geohash
    ) {
      await updateProductsLatLngGeohash(lat, lng, geohash, accountId);
    }

    if (bannerError) {
      setAlert({
        showAlert: true,
        alertMsg: "Error saving banner image.",
      });
      setIsLoading(false);
      setAccountStore(updatedAccount, logoImg, bannerImg);
      return;
    }

    if (logoError) {
      setAlert({
        showAlert: true,
        alertMsg: "Error saving logo image.",
      });
      setAccountStore(updatedAccount, logoImg, bannerImg);
      setIsLoading(false);
      return;
    }

    setAlert({
      showAlert: true,
      alertMsg: "Saved.",
    });
    setAccountStore(updatedAccount, logoImageStorage, bannerImageStorage);
    setIsLoading(false);
    setBannerImageValues({
      bannerFile: null,
      bannerFileName: "",
    });
    setLogoImageValues({
      logoFile: null,
      logoFileName: "",
    });

    // setShowCancelSaveButtons(false);
    checkIfChangesWereMade(updatedAccount);
  };

  const updateProductsLatLngGeohash = async (lat, lng, geohash, accountId) => {
    const api = "/api/private/inventory/updateProductLocation";
    const body = JSON.stringify({ lat, lng, geohash, accountId });

    const response = await fetch(api, {
      method: "PATCH",
      body,
    });
    const result = await response.json();
    console.log("result", result);
  };

  const getLatLngFromAddress = (address) => {
    return Geocode.fromAddress(address).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;

        return { lat, lng };
      },
      (error) => {
        console.error(error);
        // return { error };
      }
    );
  };

  const editBusinessIdentity = (e) => {
    setOpenBusinessIdentity(true);
  };

  const setAccountStore = async (
    updatedAccount,
    logoImageStorage,
    bannerImageStorage
  ) => {
    const {
      id: accountId,
      businessName,
      businessBio,
      city,
      firstName,
      lastName,
      subdomain,
      fullDomain,
      lat,
      lng,
      geohash,
    } = updatedAccount;

    const storedAccount = {
      accountId,
      logoImg: logoImageStorage,
      bannerImage: bannerImageStorage,
      businessName,
      businessBio,
      city,
      firstName,
      lastName,
      subdomain,
      fullDomain,
      lat,
      lng,
      geohash,
    };

    setAccount(storedAccount);
  };

  const deleteImageFromFirebaseStorage = async (
    fileName,
    subdomain,
    folderName
  ) => {
    const storageRef = ref(
      storage,
      `account/${subdomain}/profile/${folderName}/${fileName}`
    );
    return deleteObject(storageRef)
      .then(() => {
        return { success: true };
      })
      .catch((error) => {
        console.log("error deleting image", error);
        return { success: false };
      });
  };

  const updateImageToFirebaseStorage = async (
    file,
    fileName,
    subdomain,
    folderName
  ) => {
    const storageRef = ref(
      storage,
      `account/${subdomain}/profile/${folderName}/${fileName}`
    );

    await uploadBytes(storageRef, file).catch((error) => {
      console.log("error uploading image", error);
      return { error };
    });
    const url = await getDownloadURL(storageRef).catch((error) => {
      console.log("error getting image url", error);
      return { error };
    });

    return { url };
  };

  // * Display
  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={closeAlert}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div className="pb-32 lg:flex  lg:justify-center">
      <Snackbar
        open={showAlert}
        autoHideDuration={3000}
        onClose={closeAlert}
        message={alertMsg}
        action={action}
      />

      <form
        onSubmit={handleSave}
        className="lg:w-1/2 py-4 flex flex-col gap-4 "
      >
        <div className="p-4 mx-4 rounded flex flex-col gap-2 relative  bg-white   shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)]">
          <div className="flex justify-between items-start">
            <h3>Business Info</h3>
            <div>
              <p className="text-xs font-light text-right">
                Supported files: jpeg, png
              </p>
              <p className="text-xs font-extralight text-right">
                Banner: 720px x 1280px
              </p>
              <p className="text-xs font-extralight text-right">
                Logo: 100px x 100px
              </p>
            </div>
          </div>
          <div className=" relative">
            {bannerImage ? (
              <div className="w-full h-36 relative">
                <Image
                  src={bannerImage}
                  alt="banner image"
                  fill
                  priority
                  className=" object-cover rounded"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            ) : (
              <div className="rounded w-full h-36 bg-[color:var(--gray-light)] flex justify-center items-center text-[color:var(--gray-text)] border">
                {isBannerImageUploading
                  ? `Uploading ... ${bannerUploadPercent}`
                  : " Banner_image"}
              </div>
            )}
            <button
              type="button"
              onClick={handleEditBannerClick}
              className="flex border z-50 border-gray-300 w-fit py-1 px-2 gap-1 rounded-full absolute -bottom-4 ml-auto right-1 bg-gray-100"
            >
              <CameraAltIcon fontSize="small" color="disabled" />
              <p className="text-gray-600 font-light text-sm">Edit</p>
            </button>
            <input
              type="file"
              id="banner"
              name="banner"
              value=""
              ref={uploadBannerRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <div className="flex flex-col items-center z-10 ">
            <div className="-mt-14 relative">
              {logoImage ? (
                <div className="w-28 h-28 relative">
                  <Image
                    src={logoImage}
                    alt="logo icon"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    fill
                    className="bg-white object-contain rounded-full border border-gray-300 shadow-md "
                  />
                </div>
              ) : (
                <div className="rounded-full w-28 h-28 bg-[color:var(--gray-light)] flex justify-center items-center border text-[color:var(--gray-text)] text-center">
                  {isLogoImageUploading
                    ? `Uploading ... ${logoUploadPercent}`
                    : "Logo"}
                </div>
              )}
              <button
                type="button"
                onClick={handleEditLogoClick}
                className="flex border border-gray-300 w-fit py-1 px-2 gap-1 rounded-full relative bottom-3 left-[20%] bg-gray-100"
              >
                <CameraAltIcon fontSize="small" color="disabled" />
                <p className="text-gray-600 font-light text-sm">Edit</p>
              </button>
              <input
                type="file"
                id="logo"
                name="logo"
                value=""
                ref={uploadLogoRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
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
              <label htmlFor="subdomain" className="font-light text-sm">
                URL: *
              </label>
              <div className="flex items-center gap-1">
                <p>boxcart.shop/</p>
                <TextField
                  fullWidth
                  required
                  id="subdomain"
                  variant="outlined"
                  size="small"
                  name="subdomain"
                  value={subdomain}
                  type={"text"}
                  onChange={handleChangeSubdomain}
                  color="warning"
                />
              </div>
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
        <div className="p-4 mx-4 flex flex-col gap-4 bg-white rounded  shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)]">
          <div className="flex justify-between items-center">
            <h3>Business identities</h3>
            <div>
              <ButtonPrimary
                type="button"
                name="Edit"
                handleClick={editBusinessIdentity}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {businessIdentities.length === 0 ? (
              <p className="text-sm font-light">
                No identity selected. Select your business identities if you
                wish to showcase to the public.
              </p>
            ) : (
              businessIdentities.map((identity, index) => (
                <Pill key={index} name={identity} />
              ))
            )}
          </div>
          <IdentityModal
            openBusinessIdentity={openBusinessIdentity}
            isBusinessIdentityChecked={isBusinessIdentityChecked}
            isBusinessIdentityLoading={isBusinessIdentityLoading}
            noIdentitySelectedError={noIdentitySelectedError}
            handleChange={handleChangeBusinessIdentities}
            saveBusinessIdentity={saveBusinessIdentity}
            tooManyIdentitiesError={tooManyIdentitiesError}
          />
        </div>
        <div className="p-4 mx-4 flex flex-col gap-2 bg-white rounded  shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)]">
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

        <div className="p-4 mx-4 flex flex-col gap-4 bg-white rounded  shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)]">
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
              placeholder="Instagram, Tiktok, etc."
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

        {showCancelSaveButtons && (
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
                    handleClick={handleCancelAllUpdates(initialUserAccount)}
                  />
                </div>
              </Box>
            </Modal>
          </div>
        )}
      </form>
      <div className="hidden lg:block lg:w-1/2 lg:mt-4 ">
        <div className="sticky top-[2rem]">
          <h4>Shop Preview</h4>
          <ShopPreview
            bannerImage={bannerImage}
            logoImage={logoImage}
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
