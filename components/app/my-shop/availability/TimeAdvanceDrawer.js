import React, { useState } from "react";
import Image from "next/image";
import clock_icon from "@/public/images/icons/clock_icon.png";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import SaveCancelButtons from "../../design/SaveCancelButtons";
import {
  updateOrderInAdvanceTimeClient,
  updateTimeBlockTimeClient,
} from "@/helper/client/api/availability/availability-crud";

function TimeAdvanceDrawer({
  toggleDrawer,
  accountId,
  handleOpenSnackbar,
  updateOrderInAdvanceTimeDisplay,
  orderTimeInAdvance,
  orderTimeInAdvanceMetric,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [orderTimeAdvance, setOrderTimeAdvance] = useState(
    orderTimeInAdvance ? orderTimeInAdvance : "24"
  );
  const [orderTimeAdvanceMetric, setOrderTimeAdvanceMetric] = useState(
    orderTimeInAdvanceMetric ? orderTimeInAdvanceMetric : "hour"
  );

  const handleCloseDrawer = (e) => {
    setOrderTimeAdvance(orderTimeInAdvance ? orderTimeInAdvance : "24");

    setOrderTimeAdvanceMetric(
      orderTimeInAdvanceMetric ? orderTimeInAdvanceMetric : "hour"
    );

    toggleDrawer(e);
    setIsLoading(false);
  };

  const handleOrderTimeAdvanceChange = (e) => {
    const { value } = e.target;
    if (value.includes(".")) return;
    setOrderTimeAdvance(value);
  };

  const handleChangeOrderTimeAdvanceMetric = (e) => {
    const { value } = e.target;
    setOrderTimeAdvanceMetric(value);
  };

  const handleSave = async (e) => {
    setIsLoading(true);

    // Write a function ot change orderTimeMetric to plural or singular
    const orderInAdvanceValue = parseInt(orderTimeAdvance);
    const orderInAdvanceMetricGrammar =
      orderInAdvanceValue > 1
        ? orderTimeAdvanceMetric + "s"
        : orderTimeAdvanceMetric;

    const orderInAdvanceDisplay =
      orderTimeAdvance + " " + orderInAdvanceMetricGrammar;

    const orderInAdvanceInSeconds =
      orderTimeAdvanceMetric === "hour"
        ? orderInAdvanceValue * 60 * 60
        : orderTimeAdvanceMetric === "day"
        ? orderInAdvanceValue * 24 * 60 * 60
        : orderTimeAdvanceMetric === "week"
        ? orderInAdvanceValue * 7 * 24 * 60 * 60
        : orderInAdvanceValue * 30 * 24 * 60 * 60;

    const orderInAdvanceData = {
      orderInAdvanceValue,
      orderInAdvanceDisplay,
      orderInAdvanceMetric: orderTimeAdvanceMetric,
      orderInAdvanceInSeconds,
    };

    try {
      const { success, error, value } = await updateOrderInAdvanceTimeClient(
        orderInAdvanceData,
        accountId
      );

      if (success) {
        updateOrderInAdvanceTimeDisplay(
          orderInAdvanceDisplay,
          orderTimeAdvanceMetric,
          orderInAdvanceValue
        );
        handleOpenSnackbar("Saved.");
        setOrderTimeAdvanceMetric(orderTimeAdvanceMetric);
        setOrderTimeAdvance(orderTimeAdvance);

        toggleDrawer(e);
      }
    } catch (error) {
      console.log("error", error);
      handleOpenSnackbar("Error updating time.");
    }
    setIsLoading(false);
    return;
  };

  return (
    <div className="w-screen md:w-[60vw] lg:w-[45vw] xl:w-[35vw]">
      <div className="flex justify-between p-4 border-b">
        <span className="flex gap-2 items-center">
          <Image
            src={clock_icon}
            alt="clock icon"
            className=" opacity-50 mx-auto w-8 h-8"
          />
          <h3>Order in Advance</h3>
        </span>
        <IconButton onClick={toggleDrawer}>
          <CloseIcon />
        </IconButton>
      </div>
      <div className="p-4">
        <h4 className="">Set order in advance time:</h4>
        <p className="font-light text-sm">
          Set a time that customers must order ahead of. <br /> (e.g. customer
          must order 24 hours in advance.)
        </p>
        <div className="border-b py-6">
          <div className="flex justify-between items-center w-full">
            <p className="font-light text-sm">Time in advance</p>
            <div className="w-1/4 flex items-center justify-end gap-2">
              <input
                type="number"
                name="orderTimeAhead"
                id="orderTimeAhead"
                min="1"
                step="1"
                value={orderTimeAdvance}
                onChange={handleOrderTimeAdvanceChange}
                className={`p-1 w-20 border rounded `}
              />
              <p>/</p>
              <select
                className={`border rounded p-1`}
                value={orderTimeAdvanceMetric}
                onChange={handleChangeOrderTimeAdvanceMetric}
              >
                <option value="hour">hour</option>
                <option value="day">day</option>
                <option value="week">week</option>
                <option value="month">month</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed  bottom-0 w-full bg-white p-4 shadow-inner md:w-[60vw] lg:w-[45vw] xl:w-[35vw]">
        <SaveCancelButtons
          handleCancel={handleCloseDrawer}
          saveButtonType="button"
          handleSave={handleSave}
          cancelButtonType="button"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default TimeAdvanceDrawer;
