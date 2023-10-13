import React, { useState, useEffect } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import DeliveryDiningRoundedIcon from "@mui/icons-material/DeliveryDiningRounded";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { TextField } from "@mui/material";
import delivery_truck_icon from "@/public/images/icons/fulfillment/delivery_truck_icon.png";
import Image from "next/image";
import { IOSSwitch } from "@/components/global/switches/IOSSwitch";
import FormGroup from "@mui/material/FormGroup";
import SaveCancelButtons from "@/components/app/design/SaveCancelButtons";
import { isAuth } from "@/helper/client/auth/isAuth";
import CurrencyInput from "react-currency-input-field";
import SignupFormDistance from "@/components/auth/signup/SignupFormDistance";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import ButtonThird from "@/components/global/buttons/ButtonThird";
import ButtonFourth from "@/components/global/buttons/ButtonFourth";
import AddressForm from "@/components/app/fulfillment/AddressForm";
import { upsertFulfillmentClient } from "@/helper/client/api/fulfillment/fulfillment-crud";
import { getLocalStorage } from "@/utils/clientStorage";
import {
  updateFulfillmentChecklistClient,
  updateIsChecklistComplete,
} from "@/helper/client/api/checklist";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAccountStore, useChecklistStore } from "@/lib/store";

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

function Fulfillment({ userSession, userAccount }) {
  const checklistStore = useChecklistStore((state) => state.checklist);
  const setChecklistStore = useChecklistStore((state) => state.setChecklist);

  // fulfillmenttypeInt: 0 = delivery, 1 = pickup, 2 = both
  const [initialUserAccount, setInitialUserAccount] = useState(userAccount);
  const {
    fulfillmentMethodInt,
    fulfillmentMethods,
    fullAddress,
    availability,
    isChecklistComplete,
  } = initialUserAccount || {};

  const deliveryMethod = fulfillmentMethods.find(
    (method) => method.methodInt === 0
  );
  const pickupMethod = fulfillmentMethods.find(
    (method) => method.methodInt === 1
  );

  const [showSaveCancelButtons, setShowSaveCancelButtons] = useState(false);
  const [isDeliveryChecked, setIsDeliveryChecked] = useState(
    fulfillmentMethodInt === 0 || fulfillmentMethodInt === 2 ? true : false
  );
  const [isPickupChecked, setIsPickupChecked] = useState(
    fulfillmentMethodInt === 1 || fulfillmentMethodInt === 2 ? true : false
  );
  const [deliveryType, setDeliveryType] = useState(
    deliveryMethod
      ? deliveryMethod.deliveryTypeStr
        ? deliveryMethod.deliveryTypeStr
        : "outsource"
      : "outsource"
  );
  const [deliveryFeeType, setDeliveryFeeType] = useState(
    deliveryMethod
      ? deliveryMethod.deliveryFeeType
        ? deliveryMethod.deliveryFeeType
        : "free"
      : "free"
  );
  const [localDeliveryValues, setLocalDeliveryValues] = useState({
    localDeliveryDistanceStr: deliveryMethod
      ? deliveryMethod.localDeliveryDistanceStr
        ? deliveryMethod.localDeliveryDistanceStr
        : "5mi/8km"
      : "5mi/8km",
    localDeliveryDistanceMi: deliveryMethod
      ? deliveryMethod.localDeliveryDistanceMi
        ? deliveryMethod.localDeliveryDistanceMi
        : 5
      : 5,
    localDeliveryDistanceKm: deliveryMethod
      ? deliveryMethod.localDeliveryDistanceKm
        ? deliveryMethod.localDeliveryDistanceKm
        : 8
      : 8,
  });
  const [deliveryFeeFlat, setDeliveryFeeFlat] = useState(
    deliveryMethod
      ? deliveryMethod.deliveryFeePriceIntPenny
        ? deliveryMethod.deliveryFeePriceIntPenny / 100
        : ""
      : ""
  );
  const [deliveryFeeByDistance, setDeliveryFeeByDistance] = useState(
    deliveryMethod
      ? deliveryMethod.deliveryFeeByDistanceIntPenny
        ? deliveryMethod.deliveryFeeByDistanceIntPenny / 100
        : ""
      : ""
  );
  const [deliveryFeeByPercent, setDeliveryFeeByPercent] = useState(
    deliveryMethod
      ? deliveryMethod.deliveryFeeByPercent
        ? deliveryMethod.deliveryFeeByPercent
        : ""
      : ""
  );
  const [delieveryByDistanceMetric, setDelieveryByDistanceMetric] = useState(
    deliveryMethod
      ? deliveryMethod.deliveryFeeDistanceMetric
        ? deliveryMethod.deliveryFeeDistanceMetric
        : "mi"
      : "mi"
  );

  const [pickupNote, setPickupNote] = useState(
    pickupMethod ? (pickupMethod.pickupNote ? pickupMethod.pickupNote : "") : ""
  );
  const [openSnackbar, setOpenSnackbar] = useState({
    snackbarOpen: false,
    snackbarMessage: "",
  });
  const [openAddressModalDesktop, setOpenAddressModalDesktop] = useState(false);
  const [openAddressModalMobile, setOpenAddressModalMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [removedFulfillmentIds, setRemovedFulfillmentIds] = useState([]);
  const [openSetAvailabilityModal, setOpenSetAvailabilityModal] =
    useState(false);
  const [availabilityModalMessage, setAvailabilityModalMessage] = useState("");

  const {
    localDeliveryDistanceStr,
    localDeliveryDistanceMi,
    localDeliveryDistanceKm,
  } = localDeliveryValues;
  const { snackbarMessage, snackbarOpen } = openSnackbar;

  const { push } = useRouter();

  useEffect(() => {
    // setShowSaveCancelButtons is true if each state is different from initial state
    checkIfValuesAreUpdated(initialUserAccount);
  }, [
    isDeliveryChecked,
    isPickupChecked,
    deliveryType,
    deliveryFeeType,
    localDeliveryDistanceStr,
    localDeliveryDistanceMi,
    localDeliveryDistanceKm,
    deliveryFeeFlat,
    deliveryFeeByDistance,
    deliveryFeeByPercent,
    delieveryByDistanceMetric,
    pickupNote,
    initialUserAccount,
  ]);

  const checkIfValuesAreUpdated = (initialUserAccount) => {
    const {
      fulfillmentMethodInt,
      fulfillmentMethods,
      fullAddress,
      availability,
      isChecklistComplete,
    } = initialUserAccount || {};

    const deliveryMethod = fulfillmentMethods.find(
      (method) => method.methodInt === 0
    );
    const pickupMethod = fulfillmentMethods.find(
      (method) => method.methodInt === 1
    );

    const deliveryCheckStateChange =
      ((fulfillmentMethodInt === 0 || fulfillmentMethodInt === 2) &&
        isDeliveryChecked !== true) ||
      (fulfillmentMethodInt === 1 && isDeliveryChecked !== false);
    const pickupCheckStateChange =
      ((fulfillmentMethodInt === 1 || fulfillmentMethodInt === 2) &&
        isPickupChecked !== true) ||
      (fulfillmentMethodInt === 0 && isPickupChecked !== false);
    const deliveryTypeStateChange = deliveryMethod
      ? deliveryMethod.deliveryTypeStr !== deliveryType
      : false;
    const deliveryFeeTypeStateChange = deliveryMethod
      ? deliveryMethod.deliveryFeeType !== deliveryFeeType
      : false;
    const localDeliveryDistanceStateChange = deliveryMethod
      ? deliveryMethod.localDeliveryDistanceStr !== localDeliveryDistanceStr
      : false || deliveryMethod
      ? deliveryMethod.localDeliveryDistanceMi !== localDeliveryDistanceMi
      : false || deliveryMethod
      ? deliveryMethod.localDeliveryDistanceKm !== localDeliveryDistanceKm
      : false;
    const deliveryFeeFlatStateChange = deliveryMethod
      ? deliveryMethod.deliveryFeePriceIntPenny !==
        (deliveryFeeFlat !== ""
          ? parseInt((deliveryFeeFlat * 100).toFixed(2))
          : null)
      : false;
    const deliveryFeeByDistanceStateChange = deliveryMethod
      ? deliveryMethod.deliveryFeeByDistanceIntPenny !==
        (deliveryFeeByDistance !== ""
          ? parseInt((deliveryFeeByDistance * 100).toFixed(2))
          : null)
      : false;
    const deliveryFeeByPercentStateChange = deliveryMethod
      ? deliveryMethod.deliveryFeeByPercent !==
        (deliveryFeeByPercent !== "" ? deliveryFeeByPercent : null)
      : false;
    const deliveryFeeDistanceMetricStateChange = deliveryMethod
      ? deliveryMethod.deliveryFeeDistanceMetric !== delieveryByDistanceMetric
      : false;
    const pickupNoteStateChange = pickupMethod
      ? pickupMethod.pickupNote !== pickupNote
      : false;

    if (
      deliveryCheckStateChange ||
      pickupCheckStateChange ||
      deliveryTypeStateChange ||
      deliveryFeeTypeStateChange ||
      localDeliveryDistanceStateChange ||
      deliveryFeeFlatStateChange ||
      deliveryFeeByDistanceStateChange ||
      deliveryFeeByPercentStateChange ||
      deliveryFeeDistanceMetricStateChange ||
      pickupNoteStateChange
    ) {
      setShowSaveCancelButtons(true);
      return;
    } else {
      setShowSaveCancelButtons(false);
      return;
    }
  };

  const handleOpenSnackbar = (message) => {
    setOpenSnackbar({
      snackbarOpen: true,
      snackbarMessage: message,
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const handleHasDeliveryChange = (e) => {
    const { value } = e.target;
    let snackMessage = "Must have at least one fulfillment option enabled.";

    if (value === "Delivery") {
      if (isDeliveryChecked && !isPickupChecked) {
        handleOpenSnackbar(snackMessage);
      }

      // Check if deliveryMethod exists, if it does add it to removedFulfillmentIds
      if (isDeliveryChecked && deliveryMethod) {
        const data = {
          id: deliveryMethod.id,
          method: deliveryMethod.method,
        };

        setRemovedFulfillmentIds((prev) => [...prev, data]);
      }

      // check if method "delivery" exists in removedFulfillmentIds, if it does, remove it
      if (!isDeliveryChecked) {
        const index = removedFulfillmentIds.findIndex(
          (method) => method.method === "delivery"
        );

        if (index !== -1) {
          const updatedRemovedFulfillmentIds = removedFulfillmentIds.filter(
            (method) => method.method !== "delivery"
          );

          setRemovedFulfillmentIds(updatedRemovedFulfillmentIds);
        }
      }
      setIsDeliveryChecked((prev) => !prev);
      return;
    }

    if (value === "Pickup") {
      if (isPickupChecked && !isDeliveryChecked) {
        handleOpenSnackbar(snackMessage);
      }

      // Check if pickupMethod exists, if it does add it to removedFulfillmentIds
      if (isPickupChecked && pickupMethod) {
        const data = {
          id: pickupMethod.id,
          method: pickupMethod.method,
        };

        setRemovedFulfillmentIds((prev) => [...prev, data]);
      }

      // check if method "pickup" exists in removedFulfillmentIds, if it does, remove it
      if (!isPickupChecked) {
        const index = removedFulfillmentIds.findIndex(
          (method) => method.method === "pickup"
        );

        if (index !== -1) {
          const updatedRemovedFulfillmentIds = removedFulfillmentIds.filter(
            (method) => method.method !== "pickup"
          );

          setRemovedFulfillmentIds(updatedRemovedFulfillmentIds);
        }
      }

      setIsPickupChecked((prev) => !prev);
      return;
    }
  };

  const handleDeliveryTypeChange = (e) => {
    const { value } = e.target;
    if (value === "outsource") {
      setLocalDeliveryValues({
        localDeliveryDistanceStr: deliveryMethod
          ? deliveryMethod.localDeliveryDistanceStr
            ? deliveryMethod.localDeliveryDistanceStr
            : "5mi/8km"
          : "5mi/8km",
        localDeliveryDistanceMi: deliveryMethod
          ? deliveryMethod.localDeliveryDistanceMi
            ? deliveryMethod.localDeliveryDistanceMi
            : 5
          : 5,
        localDeliveryDistanceKm: deliveryMethod
          ? deliveryMethod.localDeliveryDistanceKm
            ? deliveryMethod.localDeliveryDistanceKm
            : 8
          : 8,
      });
    }
    setDeliveryType(value);
  };

  const isLocalDistanceChecked = (name) => {
    if (localDeliveryDistanceStr === name) return true;
    return false;
  };

  const handleDeliveryDistanceChange = (e) => {
    const { name, value } = e.target;

    let miles;
    let kilometers;

    switch (name) {
      case "5mi/8km":
        miles = 5;
        kilometers = 8;
        break;
      case "10mi/16km":
        miles = 10;
        kilometers = 16;
        break;
      case "30mi/48km":
        miles = 30;
        kilometers = 48;
        break;
      case "50mi/80km":
        miles = 50;
        kilometers = 80;
        break;

      default:
        break;
    }

    setLocalDeliveryValues({
      localDeliveryDistanceStr: name,
      localDeliveryDistanceMi: miles,
      localDeliveryDistanceKm: kilometers,
    });
  };

  const handleDeliveryFeeTypeChange = (e) => {
    const { value } = e.target;
    setDeliveryFeeType(value);

    if (value === "free") {
      // set by percent and fee by distance to empty
      setDeliveryFeeFlat("");
      setDeliveryFeeByDistance("");
      setDeliveryFeeByPercent("");
      return;
    }

    if (value === "flat") {
      // set by percent and fee by distance to empty
      setDeliveryFeeByPercent("");
      setDeliveryFeeByDistance("");
      setDeliveryFeeFlat(
        deliveryMethod
          ? deliveryMethod.deliveryFeePriceIntPenny
            ? deliveryMethod.deliveryFeePriceIntPenny / 100
            : ""
          : ""
      );
      return;
    }

    if (value === "percentage") {
      // set by percent and fee by distance to empty
      setDeliveryFeeFlat("");
      setDeliveryFeeByDistance("");
      setDeliveryFeeByPercent(
        deliveryMethod
          ? deliveryMethod.deliveryFeeByPercent
            ? deliveryMethod.deliveryFeeByPercent
            : ""
          : ""
      );
      return;
    }

    if (value === "distance") {
      // set by percent and fee by distance to empty
      setDeliveryFeeFlat("");
      setDeliveryFeeByPercent("");
      setDeliveryFeeByDistance(
        deliveryMethod
          ? deliveryMethod.deliveryFeeByDistanceIntPenny
            ? deliveryMethod.deliveryFeeByDistanceIntPenny / 100
            : ""
          : ""
      );
      return;
    }
  };

  const handleDeliveryFeeChange = (value, name) => {
    if (name === "flat") {
      setDeliveryFeeFlat(value);
    }
    if (name === "percentage") {
      setDeliveryFeeByPercent(value);
    }
    if (name === "distance") {
      setDeliveryFeeByDistance(value);
    }
  };

  const handleChangeDeliveryFeeDistanceMetric = (e) => {
    const { value } = e.target;
    setDelieveryByDistanceMetric(value);
  };

  const handlePickupNoteChange = (e) => {
    const { value } = e.target;
    setPickupNote(value);
  };

  const handleCancel = (e) => {
    setIsCancelModalOpen(true);
  };

  const handleCancelAllUpdates = (initialUserAccount) => (e) => {
    const {
      fulfillmentMethodInt,
      fulfillmentMethods,
      fullAddress,
      availability,
      isChecklistComplete,
    } = initialUserAccount || {};

    const deliveryMethod = fulfillmentMethods.find(
      (method) => method.methodInt === 0
    );
    const pickupMethod = fulfillmentMethods.find(
      (method) => method.methodInt === 1
    );

    setIsCancelModalOpen(false);
    // reset all state values to original values
    setIsDeliveryChecked(
      fulfillmentMethodInt === 0 || fulfillmentMethodInt === 2 ? true : false
    );
    setIsPickupChecked(
      fulfillmentMethodInt === 1 || fulfillmentMethodInt === 2 ? true : false
    );
    setDeliveryType(
      deliveryMethod
        ? deliveryMethod.deliveryTypeStr
          ? deliveryMethod.deliveryTypeStr
          : "outsource"
        : "outsource"
    );
    setDeliveryFeeType(
      deliveryMethod
        ? deliveryMethod.deliveryFeeType
          ? deliveryMethod.deliveryFeeType
          : "free"
        : "free"
    );
    setLocalDeliveryValues({
      localDeliveryDistanceStr: deliveryMethod
        ? deliveryMethod.localDeliveryDistanceStr
          ? deliveryMethod.localDeliveryDistanceStr
          : "5mi/8km"
        : "5mi/8km",
      localDeliveryDistanceMi: deliveryMethod
        ? deliveryMethod.localDeliveryDistanceMi
          ? deliveryMethod.localDeliveryDistanceMi
          : 5
        : 5,
      localDeliveryDistanceKm: deliveryMethod
        ? deliveryMethod.localDeliveryDistanceKm
          ? deliveryMethod.localDeliveryDistanceKm
          : 8
        : 8,
    });
    setDeliveryFeeFlat(
      deliveryMethod
        ? deliveryMethod.deliveryFeePriceIntPenny
          ? deliveryMethod.deliveryFeePriceIntPenny / 100
          : ""
        : ""
    );
    setDeliveryFeeByDistance(
      deliveryMethod
        ? deliveryMethod.deliveryFeeByDistanceIntPenny
          ? deliveryMethod.deliveryFeeByDistanceIntPenny / 100
          : ""
        : ""
    );
    setDeliveryFeeByPercent(
      deliveryMethod
        ? deliveryMethod.deliveryFeeByPercent
          ? deliveryMethod.deliveryFeeByPercent
          : ""
        : ""
    );
    setDelieveryByDistanceMetric(
      deliveryMethod
        ? deliveryMethod.deliveryFeeDistanceMetric
          ? deliveryMethod.deliveryFeeDistanceMetric
          : "mi"
        : "mi"
    );

    setPickupNote(
      pickupMethod
        ? pickupMethod.pickupNote
          ? pickupMethod.pickupNote
          : ""
        : ""
    );
  };

  const closeCancelModal = () => {
    setIsCancelModalOpen(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let fulfillmentDeliveryData;
    let fulfillmentPickupData;
    let fulfillmentMethodInt;
    const data = [];

    if (isDeliveryChecked && !isPickupChecked) {
      fulfillmentDeliveryData = structureFulFillmentDelivery();
      data.push(fulfillmentDeliveryData);
      fulfillmentMethodInt = 0;
    }

    if (isPickupChecked && !isDeliveryChecked) {
      fulfillmentPickupData = structureFulFillmentPickup();
      data.push(fulfillmentPickupData);
      fulfillmentMethodInt = 1;
    }

    if (isDeliveryChecked && isPickupChecked) {
      fulfillmentDeliveryData = structureFulFillmentDelivery();
      fulfillmentPickupData = structureFulFillmentPickup();
      data.push(fulfillmentDeliveryData);
      data.push(fulfillmentPickupData);
      fulfillmentMethodInt = 2;
    }

    const fulfillmentData = {
      data,
      removedFulfillmentIds,
      accountId: userAccount.id,
      fulfillmentMethodInt,
    };

    const accoundId = userAccount.id;
    const checklistComplete = false;

    try {
      const { success, value } = await upsertFulfillmentClient(fulfillmentData);
      if (success) {
        if (isPickupChecked) {
          const { hasCustomAvailability } = availability;

          if (!hasCustomAvailability || !availability) {
            setOpenSetAvailabilityModal(true);
            const message = "You must set your shop hours to enable pickup.";
            setAvailabilityModalMessage(message);

            if (isChecklistComplete) {
              updateIsChecklistComplete(accoundId, checklistComplete);
              setChecklistStore({
                isChecklistComplete: checklistComplete,
                requireAvailability: true,
              });
            }
          }

          if (availability) {
            const {
              datesAvailability,
              datesRangedAvailability,
              daysOfWeekAvailability,
            } = availability;

            const datesAvailLen = datesAvailability.length;
            const datesRangedAvailLen = datesRangedAvailability.length;
            const daysOfWeekAvailLen = daysOfWeekAvailability.length;

            if (
              datesAvailLen == 0 &&
              datesRangedAvailLen == 0 &&
              daysOfWeekAvailLen == 0
            ) {
              setOpenSetAvailabilityModal(true);
              const message = "You must set your shop hours to enable pickup.";
              setAvailabilityModalMessage(message);

              if (isChecklistComplete) {
                updateIsChecklistComplete(accoundId, checklistComplete);
                setChecklistStore({
                  isChecklistComplete: checklistComplete,
                  requireAvailability: true,
                });
              }
            }
          }
        } else {
          setChecklistStore({
            requireAvailability: false,
          });
        }

        setInitialUserAccount(value);
        updateChecklist();
        handleOpenSnackbar("Settings saved.");
        setShowSaveCancelButtons(false);
        setIsLoading(false);
        return;
      }

      handleOpenSnackbar("Error saving fulfillment settings.");
    } catch (error) {
      console.log("handleSave error", error);
      handleOpenSnackbar("Error saving fulfillment settings.");
    }

    setIsLoading(false);
  };

  const updateChecklist = async () => {
    const {
      id,
      accountId,
      isProductsUploaded,
      isEmailVerified,
      isDeliverySet,
      isPaymentsSet,
      hasLogo,
      hasBanner,
      requireAvailability,
      isAvailabilitySet,
      isChecklistComplete,
    } = checklistStore;

    if (isChecklistComplete || isDeliverySet) return;

    setChecklistStore({ isDeliverySet: true });

    const { success, value, error } = await updateFulfillmentChecklistClient(
      accountId
    );

    if (!success) {
      console.log("error updating checklist for product:", error);
      //TODO: handle error for not being able to update checklist.
    }

    if (
      isEmailVerified &&
      isProductsUploaded &&
      isPaymentsSet &&
      ((requireAvailability && isAvailabilitySet) || !requireAvailability)
    ) {
      const checklistCompleted = true;
      updateIsChecklistComplete(accountId, checklistCompleted);
      setChecklistStore({ isChecklistComplete: checklistCompleted });
    }
  };

  const structureFulFillmentDelivery = () => {
    let deliveryFeePercentDisplay = null;

    if (deliveryFeeByPercent !== "") {
      const [numBeforeDecimal, numAfterDecimal] =
        deliveryFeeByPercent.split(".");

      if (numAfterDecimal === "00") {
        deliveryFeePercentDisplay = numBeforeDecimal + "%";
      } else {
        deliveryFeePercentDisplay = deliveryFeeByPercent + "%";
      }
    }

    const fulfillmentDeliveryData = {
      method: "delivery",
      methodInt: 0,
      deliveryTypeInt: deliveryType === "outsource" ? 0 : 1,
      deliveryTypeStr: deliveryType,
      localDeliveryDistanceStr,
      localDeliveryDistanceMi,
      localDeliveryDistanceKm,
      deliveryFeeType,
      deliveryFeePriceStr:
        deliveryFeeFlat !== "" ? `$` + deliveryFeeFlat.toString() : null,
      deliveryFeePriceIntPenny:
        deliveryFeeFlat !== ""
          ? parseFloat((deliveryFeeFlat * 100).toFixed(2))
          : null,
      deliveryFeeByDistanceStr:
        deliveryFeeByDistance !== ""
          ? `$` + deliveryFeeByDistance.toString()
          : null,
      deliveryFeeByDistanceIntPenny:
        deliveryFeeByDistance !== ""
          ? parseFloat((deliveryFeeByDistance * 100).toFixed(2))
          : null,
      deliveryFeeDistanceMetric: delieveryByDistanceMetric,
      deliveryFeeByPercentStr: deliveryFeePercentDisplay,
      deliveryFeeByPercent:
        deliveryFeeByPercent !== "" ? parseFloat(deliveryFeeByPercent) : null,
    };

    return fulfillmentDeliveryData;
  };

  const structureFulFillmentPickup = () => {
    const fulfillmentPickupData = {
      method: "pickup",
      methodInt: 1,
      pickupNote,
    };

    return fulfillmentPickupData;
  };

  const handleChangePickupAddress = () => {
    if (showSaveCancelButtons) {
      handleOpenSnackbar("Please save changes first, or changes will be lost.");
      return;
    }

    push("/account/my-shop/profile");
  };

  // Displays
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
    <div className="flex flex-col pb-40 md:pb-32 lg:flex-row lg:p-4 lg:pb-32 ">
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={action}
      />

      <div className="lg:w-2/5 ">
        <div className="p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)] m-4  rounded bg-white md:h-fit lg:mx-0 lg:mt-0">
          <h3>Fulfillment Type</h3>
          <div className="pt-2 mr-4">
            <FormGroup className="flex flex-col gap-2">
              <FormControlLabel
                value="Delivery"
                control={<IOSSwitch />}
                label={<p className="text-sm">Delivery</p>}
                onChange={handleHasDeliveryChange}
                checked={isDeliveryChecked}
                labelPlacement="start"
                className="flex justify-between"
              />
              <FormControlLabel
                value="Pickup"
                control={<IOSSwitch />}
                onChange={handleHasDeliveryChange}
                checked={isPickupChecked}
                label={<p className="text-sm">Pickup</p>}
                labelPlacement="start"
                className="flex justify-between"
              />
            </FormGroup>
          </div>
        </div>
        <div className="hidden lg:block">
          <Image
            priority
            src={delivery_truck_icon}
            alt="delivery truck icon"
            className=" opacity-50 mx-auto mt-16"
          />
          <p className="text-center text-gray-400">Where to next ...</p>
        </div>
      </div>
      <form onSubmit={handleSave} className="lg:w-3/5">
        <div
          className={`p-4  ${
            isDeliveryChecked ? "visible" : " hidden"
          } shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)] rounded bg-white  mb-4 mx-4 lg:mr-0`}
        >
          <div className={`flex justify-between items-center border-b pb-4`}>
            <h3>Delivery settings</h3>
            {isDeliveryChecked ? (
              <span className="border border-[color:var(--primary)] bg-[color:var(--primary-light)] text-[color:var(--primary-dark)] h-fit font-light text-xs rounded-full px-2 py-1">
                Enabled
              </span>
            ) : (
              <span className="rounded-full px-2 py-1 text-xs font-light border border-[color:var(--gray-text)] text-[color:var(--gray-text)] bg-[color:var(--gray-light)]">
                Disabled
              </span>
            )}
          </div>
          <div className="py-4 border-b ">
            <FormControl className="w-full">
              <FormLabel id="demo-radio-buttons-group-label" className="mb-2 ">
                <p className=" text-black ">Shipping method:</p>
              </FormLabel>
              <RadioGroup
                defaultValue="outsource"
                name="radio-buttons-group"
                className="flex flex-col gap-2 "
                value={deliveryType}
                onChange={handleDeliveryTypeChange}
              >
                <FormControlLabel
                  value="outsource"
                  control={<Radio />}
                  label={
                    <p className="text-black text-sm font-light">
                      Third party shipping
                    </p>
                  }
                />

                <FormControlLabel
                  value="inHouse"
                  control={<Radio />}
                  label={
                    <p className="text-black text-sm font-light">
                      Self delivery
                    </p>
                  }
                />
              </RadioGroup>
            </FormControl>
          </div>
          {deliveryType === "inHouse" && (
            <div className="py-4 border-b">
              <SignupFormDistance
                handleChange={handleDeliveryDistanceChange}
                isLocalDistanceChecked={isLocalDistanceChecked}
              />
            </div>
          )}
          <div className="py-4 border-b">
            <FormControl className="w-full">
              <FormLabel id="demo-radio-buttons-group-label" className="mb-2 ">
                <p className=" text-black ">Fee:</p>
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="free"
                name="radio-buttons-group"
                className="flex flex-col gap-2 "
                value={deliveryFeeType}
                onChange={handleDeliveryFeeTypeChange}
              >
                <FormControlLabel
                  value="free"
                  control={<Radio />}
                  label={<p className="text-black text-sm font-light">Free</p>}
                />
                <div className="flex justify-between items-center">
                  <FormControlLabel
                    value="flat"
                    control={<Radio />}
                    label={
                      <p className="text-black text-sm font-light">Flat fee</p>
                    }
                  />

                  <CurrencyInput
                    id="flat"
                    name="flat"
                    required
                    placeholder="$"
                    disabled={deliveryFeeType == "flat" ? false : true}
                    decimalsLimit={2}
                    decimalScale={2}
                    prefix="$"
                    value={deliveryFeeFlat}
                    onValueChange={handleDeliveryFeeChange}
                    className={`p-1 w-1/4 border rounded ${
                      deliveryFeeType == "flat" && "ring-1"
                    }`}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <FormControlLabel
                    value="percentage"
                    control={<Radio />}
                    label={
                      <p className="text-black text-sm font-light">
                        Percentage fee
                      </p>
                    }
                  />
                  <CurrencyInput
                    id="percentage"
                    name="percentage"
                    placeholder="%"
                    required
                    disabled={deliveryFeeType == "percentage" ? false : true}
                    decimalsLimit={2}
                    decimalScale={2}
                    suffix="%"
                    value={deliveryFeeByPercent}
                    onValueChange={handleDeliveryFeeChange}
                    className={`p-1 w-1/4 border rounded ${
                      deliveryFeeType == "percentage" && "ring-1"
                    }`}
                  />
                </div>
                <div className="flex justify-between items-center w-full">
                  <FormControlLabel
                    value="distance"
                    control={<Radio />}
                    label={
                      <p className="text-black text-sm font-light">
                        By distance
                      </p>
                    }
                  />
                  <div className="w-1/4 flex items-center justify-end gap-2">
                    <CurrencyInput
                      id="distance"
                      name="distance"
                      required
                      placeholder="$"
                      value={deliveryFeeByDistance}
                      disabled={deliveryFeeType == "distance" ? false : true}
                      prefix="$"
                      decimalScale={2}
                      decimalsLimit={2}
                      onValueChange={handleDeliveryFeeChange}
                      className={`p-1 w-20 border rounded ${
                        deliveryFeeType == "distance" && "ring-1"
                      }`}
                    />
                    <p>/</p>
                    <select
                      className={`border rounded p-1 ${
                        deliveryFeeType == "distance" && "ring-1"
                      }`}
                      disabled={deliveryFeeType == "distance" ? false : true}
                      value={delieveryByDistanceMetric}
                      onChange={handleChangeDeliveryFeeDistanceMetric}
                    >
                      <option value="mi">mi</option>
                      <option value="km">km</option>
                    </select>
                  </div>
                </div>
              </RadioGroup>
            </FormControl>
            <div className="flex mt-8 gap-2 items-center">
              <p className="text-gray-700 text-xs">
                Connect third party delivery.
              </p>
              <span className=" px-1 text-xs rounded-full bg-[color:var(--gray-light)] border border-[color:var(--gray-light-med)] text-[color:var(--gray-light-med)]">
                Coming soon
              </span>
            </div>
          </div>
        </div>
        <div
          className={`p-4  ${
            isPickupChecked ? "visible" : "hidden"
          } shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)] rounded bg-white mx-4 lg:mr-0`}
        >
          <div className={`flex justify-between items-center`}>
            <h3>Pickup settings</h3>
            {isPickupChecked ? (
              <span className="border border-[color:var(--primary)] bg-[color:var(--primary-light)] text-[color:var(--primary-dark)] h-fit font-light text-xs rounded-full px-2 py-1">
                Enabled
              </span>
            ) : (
              <span className="rounded-full px-2 py-1 text-xs font-light border border-[color:var(--gray)] text-[color:var(--gray-text)]">
                Disabled
              </span>
            )}
          </div>
          <div className="w-full py-4 flex justify-between items-end">
            <div>
              <h4 className="text-sm">Address:</h4>
              <p className="text-black font-light text-xs mt-1">
                {fullAddress}
              </p>
            </div>
            <div>
              <button
                className=" lg:block text-[color:var(--primary)] underline text-sm"
                disabled={isPickupChecked ? false : true}
                type="button"
                onClick={handleChangePickupAddress}
              >
                change in profile
              </button>
            </div>
          </div>
          <TextField
            id="custom-note"
            name="custom-note"
            label="Note to customer ..."
            multiline
            fullWidth
            color="warning"
            disabled={isPickupChecked ? false : true}
            placeholder="i.e. Arrive 10 minutes ahead of time and send me a text before ringing the doorbell."
            rows={4}
            onChange={handlePickupNoteChange}
            value={pickupNote}
          />
        </div>
        {(isPickupChecked || isDeliveryChecked) && showSaveCancelButtons && (
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
                  <ButtonFourth
                    type="button"
                    name="No"
                    handleClick={closeCancelModal}
                  />

                  <ButtonThird
                    name="Yes, cancel"
                    type="button"
                    handleClick={handleCancelAllUpdates(initialUserAccount)}
                  />
                </div>
              </Box>
            </Modal>
          </div>
        )}
      </form>
      <Modal
        open={openSetAvailabilityModal}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleMobile}>
          <div className="w-full">
            <h2>Set availability</h2>
            <p className="mt-4 mb-6 text-sm">{availabilityModalMessage}</p>
            <Link href="/account/my-shop/availability">
              <ButtonThird name="Set store hours" type="button" />
            </Link>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default Fulfillment;

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
          fulfillmentMethods: true,
          availability: {
            include: {
              datesAvailability: true,
              datesRangedAvailability: true,
              daysOfWeekAvailability: true,
            },
          },
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

Fulfillment.getLayout = function getLayout(
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

Fulfillment.pageTitle = "Fulfillment";
Fulfillment.pageIcon = <DeliveryDiningRoundedIcon />;
Fulfillment.pageRoute = "fulfillment";
Fulfillment.mobilePageRoute = "fulfillment";
