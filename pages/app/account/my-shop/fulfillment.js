import React, { useState } from "react";
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
import { updateFulfillmentChecklistClient } from "@/helper/client/api/checklist";

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

const styleDesktop = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  // border: "2px solid #000",
  borderRadius: 1,
  boxShadow: 24,
  p: 4,
};

function Fulfillment({ userSession, userAccount }) {
  // fulfillmenttypeInt: 0 = delivery, 1 = pickup, 2 = both
  const { fulfillmentMethodInt, fulfillmentMethods } = userAccount || {};

  const deliveryMethod = fulfillmentMethods.find(
    (method) => method.methodInt === 0
  );
  const pickupMethod = fulfillmentMethods.find(
    (method) => method.methodInt === 1
  );

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
      ? deliveryMethod.deliveryFeeByPercentIntHundred
        ? (deliveryMethod.deliveryFeeByPercentIntHundred / 100).toFixed(2)
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
  const [addressValues, setAddressValues] = useState({
    address_1: pickupMethod
      ? pickupMethod.address_1
        ? pickupMethod.address_1
        : ""
      : "",
    address_2: pickupMethod
      ? pickupMethod.address_2
        ? pickupMethod.address_2
        : ""
      : "",
    city: pickupMethod ? (pickupMethod.city ? pickupMethod.city : "") : "",
    state: pickupMethod ? (pickupMethod.state ? pickupMethod.state : "") : "",
    zip: pickupMethod ? (pickupMethod.zip ? pickupMethod.zip : "") : "",
    fullAddress: pickupMethod
      ? pickupMethod.fullAddress
        ? pickupMethod.fullAddress
        : ""
      : "",
  });
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

  const {
    localDeliveryDistanceStr,
    localDeliveryDistanceMi,
    localDeliveryDistanceKm,
  } = localDeliveryValues;
  const { snackbarMessage, snackbarOpen } = openSnackbar;
  const { address_1, address_2, city, state, zip, fullAddress } = addressValues;

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
        return;
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
        return;
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

    if (value === "flat") {
      // set by percent and fee by distance to empty
      setDeliveryFeeByPercent("");
      setDeliveryFeeByDistance("");
      return;
    }

    if (value === "percentage") {
      // set by percent and fee by distance to empty
      setDeliveryFeeFlat("");
      setDeliveryFeeByDistance("");
      return;
    }

    if (value === "distance") {
      // set by percent and fee by distance to empty
      setDeliveryFeeFlat("");
      setDeliveryFeeByPercent("");
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

  const handleOpenAddressModalDesktop = () => {
    setOpenAddressModalDesktop(true);
  };

  const handleCloseAddressModalDesktop = () => {
    setOpenAddressModalDesktop(false);
    setAddressValues({
      address_1: "",
      address_2: "",
      city: "",
      state: "",
      zip: "",
    });
  };

  const handleOpenAddressModalMobile = () => {
    setOpenAddressModalMobile(true);
  };

  const handleCloseAddressModalMobile = () => {
    setOpenAddressModalMobile(false);
    setAddressValues({
      address_1: "",
      address_2: "",
      city: "",
      state: "",
      zip: "",
    });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setAddressValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveAddress = () => {
    // check if addressValues are empty, if they are, open snackbar.
    if (address_1 == "" || city == "" || state == "" || zip == "") {
      handleOpenSnackbar("Missing address.");
      return;
    }

    let fullAddress;

    if (address_2 !== "") {
      fullAddress =
        address_1 + " " + address_2 + " " + city + " " + state + " " + zip;
    } else {
      fullAddress = address_1 + " " + city + " " + state + " " + zip;
    }

    setAddressValues((prev) => ({ ...prev, fullAddress }));

    setOpenAddressModalDesktop(false);
    setOpenAddressModalMobile(false);
  };

  const handlePickupNoteChange = (e) => {
    const { value } = e.target;
    setPickupNote(value);
  };

  const handleCancel = (e) => {
    setIsCancelModalOpen(true);
  };

  const handleCancelAllUpdates = () => {
    setIsCancelModalOpen(false);
    // reset all state values to original values
    setIsDeliveryChecked(
      fulfillmentMethodInt === 0 || fulfillmentMethodInt === 2 ? true : false
    );
    setIsPickupChecked(
      fulfillmentMethodInt === 1 || fulfillmentMethodInt === 2 ? true : false
    );
    setDeliveryType(
      deliveryMethod.deliveryTypeStr
        ? deliveryMethod.deliveryTypeStr
        : "outsource"
    );
    setDeliveryFeeType(
      deliveryMethod.deliveryFeeType ? deliveryMethod.deliveryFeeType : "free"
    );
    setLocalDeliveryValues({
      localDeliveryDistanceStr: deliveryMethod.localDeliveryDistanceStr
        ? deliveryMethod.localDeliveryDistanceStr
        : "5mi/8km",
      localDeliveryDistanceMi: deliveryMethod.localDeliveryDistanceMi
        ? deliveryMethod.localDeliveryDistanceMi
        : 5,
      localDeliveryDistanceKm: deliveryMethod.localDeliveryDistanceKm
        ? deliveryMethod.localDeliveryDistanceKm
        : 8,
    });
    setDeliveryFeeFlat(
      deliveryMethod.deliveryFeePriceIntPenny
        ? deliveryMethod.deliveryFeePriceIntPenny / 100
        : ""
    );
    setDeliveryFeeByDistance(
      deliveryMethod.deliveryFeeByDistanceIntPenny
        ? deliveryMethod.deliveryFeeByDistanceIntPenny / 100
        : ""
    );
    setDeliveryFeeByPercent(
      deliveryMethod.deliveryFeeByPercentIntHundred
        ? (deliveryMethod.deliveryFeeByPercentIntHundred / 100).toFixed(2)
        : ""
    );
    setDelieveryByDistanceMetric(
      deliveryMethod.deliveryFeeDistanceMetric
        ? deliveryMethod.deliveryFeeDistanceMetric
        : "mi"
    );
    setAddressValues({
      address_1: pickupMethod.address_1 ? pickupMethod.address_1 : "",
      address_2: pickupMethod.address_2 ? pickupMethod.address_2 : "",
      city: pickupMethod.city ? pickupMethod.city : "",
      state: pickupMethod.state ? pickupMethod.state : "",
      zip: pickupMethod.zip ? pickupMethod.zip : "",
      fullAddress: pickupMethod.fullAddress ? pickupMethod.fullAddress : "",
    });
    setPickupNote(pickupMethod.pickupNote ? pickupMethod.pickupNote : "");
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

    if (isDeliveryChecked) {
      fulfillmentDeliveryData = structureFulFillmentDelivery();
      fulfillmentMethodInt = 0;
    }

    if (isPickupChecked) {
      fulfillmentPickupData = structureFulFillmentPickup();
      fulfillmentMethodInt = 1;

      if (!fullAddress || fullAddress == "") {
        handleOpenSnackbar("Missing address for pickup.");
        setIsLoading(false);
        return;
      }
    }

    if (isDeliveryChecked && isPickupChecked) {
      fulfillmentDeliveryData = structureFulFillmentDelivery();
      fulfillmentPickupData = structureFulFillmentPickup();
      fulfillmentMethodInt = 2;
    }

    const fulfillmentData = {
      data: [fulfillmentDeliveryData, fulfillmentPickupData],
      removedFulfillmentIds,
      accountId: userAccount.id,
      fulfillmentMethodInt,
    };

    try {
      const { success, value } = await upsertFulfillmentClient(fulfillmentData);

      if (success) {
        updateChecklist();
        handleOpenSnackbar("Fulfillment settings saved.");
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
    const accountId = userAccount.id;
    const checklistLocalStorage = getLocalStorage("checklist");
    const checklistJson = JSON.parse(checklistLocalStorage);
    const { isDeliverySet } = checklistJson;

    if (isDeliverySet) return;

    checklistJson.isDeliverySet = true;
    const checklistString = JSON.stringify(checklistJson);
    localStorage.setItem("checklist", checklistString);

    const { success, value, error } = await updateFulfillmentChecklistClient(
      accountId
    );

    if (!success) {
      console.log("error updating checklist for product:", error);
      handleOpenSnackbar("Error updating checklist.");
    }
  };

  const structureFulFillmentDelivery = () => {
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
        deliveryFeeFlat !== "" ? parseInt(deliveryFeeFlat) * 100 : null,
      deliveryFeeByDistanceStr:
        deliveryFeeByDistance !== ""
          ? `$` + deliveryFeeByDistance.toString()
          : null,
      deliveryFeeByDistanceIntPenny:
        deliveryFeeByDistance !== ""
          ? parseInt(deliveryFeeByDistance) * 100
          : null,
      deliveryFeeDistanceMetric: delieveryByDistanceMetric,
      deliveryFeeByPercentStr:
        deliveryFeeByPercent !== ""
          ? deliveryFeeByPercent.toString() + "%"
          : null,
      deliveryFeeByPercentIntHundred:
        deliveryFeeByPercent !== ""
          ? parseInt(deliveryFeeByPercent) * 100
          : null,
    };

    return fulfillmentDeliveryData;
  };

  const structureFulFillmentPickup = () => {
    const fulfillmentPickupData = {
      method: "pickup",
      methodInt: 1,
      address_1,
      address_2,
      city,
      state,
      zip,
      fullAddress,
      pickupNote,
    };

    return fulfillmentPickupData;
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
          <div className="py-4 ">
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
                className="hidden lg:block text-[color:var(--primary)] underline text-sm"
                disabled={isPickupChecked ? false : true}
                type="button"
                onClick={handleOpenAddressModalDesktop}
              >
                change
              </button>
              <button
                className="lg:hidden text-[color:var(--primary)] underline text-sm"
                disabled={isPickupChecked ? false : true}
                type="button"
                onClick={handleOpenAddressModalMobile}
              >
                {fullAddress === "" ? "Add address" : "Update"}
              </button>
              <div className="lg:hidden">
                <Modal
                  open={openAddressModalMobile}
                  // onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={styleMobile}>
                    <div className="w-full">
                      <div>
                        <AddressForm
                          handleChange={handleAddressChange}
                          signupValues={addressValues}
                        />
                      </div>
                      <div className="flex justify-end mt-6 gap-4">
                        <ButtonFourth
                          name="close"
                          handleClick={handleCloseAddressModalMobile}
                        />

                        <ButtonThird
                          name="save"
                          handleClick={handleSaveAddress}
                        />
                      </div>
                    </div>
                  </Box>
                </Modal>
              </div>
              <div className="hidden lg:block">
                <Modal
                  open={openAddressModalDesktop}
                  // onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={styleDesktop}>
                    <div className="w-full ">
                      <div>
                        <AddressForm
                          handleChange={handleAddressChange}
                          signupValues={addressValues}
                        />
                      </div>
                      <div className="flex justify-end mt-6 gap-4">
                        <ButtonFourth
                          name="close"
                          handleClick={handleCloseAddressModalDesktop}
                        />

                        <ButtonThird
                          name="save"
                          handleClick={handleSaveAddress}
                        />
                      </div>
                    </div>
                  </Box>
                </Modal>
              </div>
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
        {(isPickupChecked || isDeliveryChecked) && (
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
        )}
      </form>
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
