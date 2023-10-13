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
import { updateTimeBlockTimeClient } from "@/helper/client/api/availability/availability-crud";

function TimeBlockDrawer({
  toggleDrawer,
  accountId,
  timeBlock,
  handleOpenSnackbar,
  updateTimeBlockCurrValue,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [timeBlockValue, setTimeBlockValue] = useState(
    timeBlock ? timeBlock : "15 min"
  );

  const handleCloseDrawer = (e) => {
    setTimeBlockValue(timeBlock ? timeBlock : "15 min");

    toggleDrawer(e);
    setIsLoading(false);
  };

  const handleChangeTimeBlock = (e) => {
    setTimeBlockValue(e.target.value);
  };

  const handleSave = async (e) => {
    setIsLoading(true);

    const timeBlockDigitsOnly = timeBlockValue.split(" ")[0];
    const timeBlockTimeStr = timeBlockValue.split(" ")[1];
    let timeBlockSeconds;
    if (timeBlockTimeStr === "hour") {
      timeBlockSeconds = parseInt(timeBlockDigitsOnly) * 60 * 60;
    }

    if (timeBlockTimeStr === "min") {
      timeBlockSeconds = parseInt(timeBlockDigitsOnly) * 60;
    }

    const timeBlockData = {
      timeBlock: timeBlockValue,
      timeBlockSeconds,
    };

    try {
      const { success, error, value } = await updateTimeBlockTimeClient(
        timeBlockData,
        accountId
      );

      if (success) {
        updateTimeBlockCurrValue(timeBlockValue);
        handleOpenSnackbar("Time block udpated.");
        toggleDrawer(e);
      } else {
        console.log("error", error);
        handleOpenSnackbar("Error updating time block.");
      }
    } catch (error) {
      console.log("error", error);
      handleOpenSnackbar("Error updating time block.");
    }

    setIsLoading(false);
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
          <h4>Time Block</h4>
        </span>
        <IconButton onClick={toggleDrawer}>
          <CloseIcon />
        </IconButton>
      </div>
      <div className="p-4">
        <h4 className="">Set order intervals.</h4>
        <p className="font-light text-sm">
          This will allow your customers to place orders within the set time
          interval. <br /> (e.g. customers can place orders or pickup every{" "}
          <b>{timeBlockValue}</b>
          .)
        </p>
        <div className="border-b">
          <FormControl
            sx={{
              width: "100%",
              marginTop: "1rem",
            }}
          >
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="date"
              name="radio-buttons-group"
              value={timeBlockValue}
              onChange={handleChangeTimeBlock}
              sx={{ width: "100%" }}
            >
              <FormControlLabel
                value="15 min"
                control={<Radio color="warning" />}
                label="15 min"
                labelPlacement="start"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  paddingRight: "20px",
                }}
              />
              <FormControlLabel
                value="30 min"
                control={<Radio color="warning" />}
                label="30 min"
                labelPlacement="start"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  paddingRight: "20px",
                }}
              />
              <FormControlLabel
                value="1 hour"
                control={<Radio color="warning" />}
                label="1 hour"
                labelPlacement="start"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  paddingRight: "20px",
                }}
              />
            </RadioGroup>
          </FormControl>
        </div>
      </div>
      <div className="absolute left-0 bottom-0 w-full bg-white p-4 shadow-inner md:w-[60vw] lg:w-[45vw] xl:w-[35vw]">
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

export default TimeBlockDrawer;
