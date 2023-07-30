import React, { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import calendar_icon from "@/public/images/icons/calendar_icon.png";
import Image from "next/image";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import SaveCancelButtons from "../../design/SaveCancelButtons";
import {
  createDatesAvailabilityClient,
  createDatesRangedAvailabilityClient,
  createDaysOfWeekAvailabilityClient,
  updateDatesAvailabilityClient,
  updateDatesRangedAvailabilityClient,
  updateDayOfWeekAvailabilityClient,
} from "@/helper/client/api/availability/availability-crud";

function EditScheduleDrawer({
  toggleDrawer,
  accountId,
  scheduleData,
  scheduleTypeEdit,
  handleOpenSnackbar,
  availability,
  getAvailabilities,
}) {
  const { id: scheduleId } = scheduleData;

  const [timeOptions, setTimeOptions] = useState([]);
  const [scheduleType, setScheduleType] = useState(scheduleTypeEdit);
  const [specificDateValues, setSpecificDateValues] = useState({
    specificDate:
      scheduleTypeEdit === "date" ? scheduleData.dateStrUnformat : "",
    specificDateStartTime:
      scheduleTypeEdit === "date" ? scheduleData.startTimeStr : "8:00 AM",
    specificDateEndTime:
      scheduleTypeEdit === "date" ? scheduleData.endTimeStr : "5:00 PM",
  });
  const [dateRangeValus, setDateRangeValues] = useState({
    startDateRange:
      scheduleTypeEdit === "range" ? scheduleData.startDateStrUnformat : "",
    endDateRange:
      scheduleTypeEdit === "range" ? scheduleData.endDateStrUnformat : "",
    startTimeRange:
      scheduleTypeEdit === "range" ? scheduleData.startTimeStr : "8:00 AM",
    endTimeRange:
      scheduleTypeEdit === "range" ? scheduleData.endTimeStr : "5:00 PM",
  });
  const [weekValues, setWeekValues] = useState({
    weekday: scheduleTypeEdit === "week" ? scheduleData.dayStr : "Monday",
    weekStartTime:
      scheduleTypeEdit === "week" ? scheduleData.startTimeStr : "8:00 AM",
    weekEndTime:
      scheduleTypeEdit === "week" ? scheduleData.endTimeStr : "5:00 PM",
    repeatOption:
      scheduleTypeEdit === "week"
        ? scheduleData.repeatOption
        : "Does not repeat",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Destructure
  const { specificDate, specificDateStartTime, specificDateEndTime } =
    specificDateValues;
  const { startDateRange, endDateRange, startTimeRange, endTimeRange } =
    dateRangeValus;
  const { weekday, weekStartTime, weekEndTime, repeatOption } = weekValues;

  useEffect(() => {
    generateTimeOptions();
  }, []);

  // Helper
  const generateTimeOptions = () => {
    const options = [];
    for (let hours = 0; hours < 24; hours++) {
      for (let minutes = 0; minutes < 60; minutes += 15) {
        const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");
        // Check if formattedHours has 0 as its first character and if it does, remove it
        const reFormatHours = formattedHours.replace(/^0+/, "");
        const formattedMinutes = minutes.toString().padStart(2, "0");
        const amPm = hours < 12 ? "AM" : "PM";
        const timeValue = `${reFormatHours}:${formattedMinutes} ${amPm}`;
        options.push(timeValue);
      }
    }

    setTimeOptions(options);
  };

  // onChange values
  const handleChangeSpecificDate = (event) => {
    const { name, value } = event.target;

    setSpecificDateValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRangeDateChange = (event) => {
    const { name, value } = event.target;

    setDateRangeValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDayOfWeekChange = (event) => {
    const { name, value } = event.target;

    setWeekValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeScheduleType = (event) => {
    const { value } = event.target;
    setScheduleType(value);
  };

  const handleCloseDrawer = (e) => {
    if (scheduleType === "date") {
      setSpecificDateValues({
        specificDate: "",
        specificDateStartTime: "8:00 AM",
        specificDateEndTime: "5:00 PM",
      });
    }

    if (scheduleType === "range") {
      setDateRangeValues({
        startDateRange: "",
        endDateRange: "",
        startTimeRange: "8:00 AM",
        endTimeRange: "5:00 PM",
      });
    }

    if (scheduleType === "week") {
      setWeekValues({
        weekday: "",
        weekStartTime: "",
        weekEndTime: "",
        repeatOption: "",
      });
    }

    setIsLoading(false);
    toggleDrawer(e);
  };

  const handleSave = async (e) => {
    setIsLoading(true);
    if (scheduleType === "date") {
      // check if all fields are filled if not, return
      if (
        specificDate === "" ||
        specificDateStartTime === "" ||
        specificDateEndTime === ""
      ) {
        handleOpenSnackbar("Please fill in all fields.");
        setIsLoading(false);
        return;
      }

      // check if startime is greater than endtime if not, return
      const isStartTimeGreaterThanEndTime = checkStartTimeGreaterThanEndTime(
        specificDateStartTime,
        specificDateEndTime
      );

      if (isStartTimeGreaterThanEndTime) {
        handleOpenSnackbar("Your start time is after your end time.");
        setIsLoading(false);
        return;
      }

      // check if starttime is equal to endtime if not, return
      if (specificDateStartTime === specificDateEndTime) {
        handleOpenSnackbar("Start time cannot be equal to end time.");
        setIsLoading(false);
        return;
      }

      const { success, value, error } = await updateSpecificDate();

      if (success) {
        const { availabilityId } = value;
        handleOpenSnackbar("Schedule updated.");
        getAvailabilities(availabilityId);
        setIsLoading(false);
        toggleDrawer(e);
        return;
      }

      handleOpenSnackbar("Something went wrong. Please try again.");
      setIsLoading(false);
      return;
    }

    if (scheduleType === "range") {
      // Check if all fields are filled if not, return
      if (
        startDateRange === "" ||
        endDateRange === "" ||
        startTimeRange === "" ||
        endTimeRange === ""
      ) {
        handleOpenSnackbar("Please fill in all fields.");
        setIsLoading(false);
        return;
      }

      // check if startDate is greater than endDate if not, return
      const isStartDateGreaterThanEndDate = checkStartDateGreaterThanEndDate(
        startDateRange,
        endDateRange
      );

      if (isStartDateGreaterThanEndDate) {
        handleOpenSnackbar("Your start date is after your end date.");
        setIsLoading(false);
        return;
      }

      // check if startime is greater than endtime if not, return
      const isStartTimeGreaterThanEndTime = checkStartTimeGreaterThanEndTime(
        startTimeRange,
        endTimeRange
      );

      if (isStartTimeGreaterThanEndTime) {
        handleOpenSnackbar("Your start time is after your end time.");
        setIsLoading(false);
        return;
      }

      // check if starttime is equal to endtime if not, return
      if (startTimeRange === endTimeRange) {
        handleOpenSnackbar("Start time cannot be equal to end time.");
        setIsLoading(false);
        return;
      }

      const { success, value, error } = await updateRangeDate();

      if (success) {
        const { availabilityId } = value;
        handleOpenSnackbar("Schedule updated.");
        getAvailabilities(availabilityId);
        setIsLoading(false);
        toggleDrawer(e);
        return;
      }

      handleOpenSnackbar("Something went wrong. Please try again.");
      setIsLoading(false);
      return;
    }

    if (scheduleType === "week") {
      // check if all fields are filled if not, return
      if (
        weekday === "" ||
        weekStartTime === "" ||
        weekEndTime === "" ||
        repeatOption === ""
      ) {
        handleOpenSnackbar("Please fill in all fields.");
        setIsLoading(false);
        return;
      }

      // check if startime is greater than endtime if not, return
      const isStartTimeGreaterThanEndTime = checkStartTimeGreaterThanEndTime(
        weekStartTime,
        weekEndTime
      );

      if (isStartTimeGreaterThanEndTime) {
        handleOpenSnackbar("Your start time is after your end time.");
        setIsLoading(false);
        return;
      }

      // check if starttime is equal to endtime if not, return
      if (weekStartTime === weekEndTime) {
        handleOpenSnackbar("Start time cannot be equal to end time.");
        setIsLoading(false);
        return;
      }

      const { success, value, error } = await updateWeekDate();

      if (success) {
        const { availabilityId } = value;
        handleOpenSnackbar("Schedule created successfully.");
        getAvailabilities(availabilityId);
        setIsLoading(false);
        toggleDrawer(e);
        return;
      }

      handleOpenSnackbar("Something went wrong. Please try again.");
      setIsLoading(false);
      return;
    }
  };

  const checkStartDateGreaterThanEndDate = (startDateArg, endDateArg) => {
    const [startYear, startMonth, startDay] = startDateArg.split("-");
    const [endYear, endMonth, endDay] = endDateArg.split("-");

    const startDate = new Date(startYear, startMonth, startDay);
    const endDate = new Date(endYear, endMonth, endDay);

    if (startDate > endDate) {
      return true;
    }

    return false;
  };

  const checkStartTimeGreaterThanEndTime = (startTimeArg, endTimeArg) => {
    const [starTime, startPeriod] = startTimeArg.split(" ");
    const [startHour, startMinute] = starTime.split(":");
    const [endTime, endPeriod] = endTimeArg.split(" ");
    const [endHour, endMinute] = endTime.split(":");

    const startHourIn24FormatMinutes =
      startPeriod === "AM"
        ? parseInt(startHour, 10) * 60 + parseInt(startMinute, 10)
        : (parseInt(startHour, 10) + 12) * 60 + parseInt(startMinute, 10);
    const endHourIn24FormatMinutes =
      endPeriod === "AM"
        ? parseInt(endHour, 10) * 60 + parseInt(endMinute, 10)
        : (parseInt(endHour, 10) + 12) * 60 + parseInt(endMinute, 10);

    if (startHourIn24FormatMinutes > endHourIn24FormatMinutes) {
      return true;
    }

    return false;
  };

  const updateSpecificDate = async () => {
    const {
      reFormattedStartDate,
      formattedStartDate,
      formattedStartTime,
      formattedEndTime,
    } = dateAndTimeFormatter(
      scheduleType,
      specificDate,
      null,
      specificDateStartTime,
      specificDateEndTime
    );
    const epochDate = formattedStartDate.getTime().toString();
    const epochStartTime = formattedStartTime.getTime().toString();
    const epochEndTime = formattedEndTime.getTime().toString();

    const datesAvailability = {
      id: scheduleId,
      dateStrUnformat: specificDate,
      dateStr: reFormattedStartDate,
      dateEpochStr: epochDate,
      startTimeStr: specificDateStartTime,
      startTimeEpochStr: epochStartTime,
      endTimeStr: specificDateEndTime,
      endTimeEpochStr: epochEndTime,
    };

    try {
      const { success, value } = await updateDatesAvailabilityClient(
        datesAvailability
      );

      return { success, value };
    } catch (error) {
      console.log(
        "helper/client/api/availability createDatesAvailability error:",
        error
      );

      return { success: false, error };
    }
  };

  const updateRangeDate = async () => {
    const {
      reFormattedStartDate, // mm/dd/yyyy
      formattedStartDate,
      reFormattedEndDate,
      formattedEndDate,
    } = dateAndTimeFormatter(
      scheduleType,
      startDateRange,
      endDateRange,
      null,
      null
    );
    const epochStartDate = formattedStartDate.getTime().toString();

    const datesRagnedAvailability = {
      id: scheduleId,
      startDateStrUnformat: startDateRange,
      startDateStr: reFormattedStartDate,
      startDateEpochStr: epochStartDate,
      endDateStrUnformat: endDateRange,
      endDateStr: reFormattedEndDate,
      endDateEpochStr: formattedEndDate,
      startTimeStr: startTimeRange,
      endTimeStr: endTimeRange,
    };

    try {
      const { success, value } = await updateDatesRangedAvailabilityClient(
        datesRagnedAvailability
      );

      return { success, value };
    } catch (error) {
      console.log(
        "helper/client/api/availability createDatesAvailability error:",
        error
      );

      return { success: false, error };
    }
  };

  const updateWeekDate = async () => {
    const dayInt = convertWeekdayToInt(weekday);
    const repeatOptionInt = convertRepeatOptionToInt(repeatOption);

    const daysOfWeekAvailability = {
      id: scheduleId,
      dayStr: weekday,
      dayInt,
      startTimeStr: weekStartTime,
      endTimeStr: weekEndTime,
      repeatOption,
      repeatOptionInt,
    };

    try {
      const { success, value } = await updateDayOfWeekAvailabilityClient(
        daysOfWeekAvailability
      );

      return { success, value };
    } catch (error) {
      console.log(
        "helper/client/api/availability createDatesAvailability error:",
        error
      );

      return { success: false, error };
    }
  };

  const convertWeekdayToInt = (weekday) => {
    // Sunday is 0, Monday is 1, and so on.
    if (weekday === "Sunday") return 0;
    if (weekday === "Monday") return 1;
    if (weekday === "Tuesday") return 2;
    if (weekday === "Wednesday") return 3;
    if (weekday === "Thursday") return 4;
    if (weekday === "Friday") return 5;
    if (weekday === "Saturday") return 6;
  };

  const convertRepeatOptionToInt = (repeatOption) => {
    if (repeatOption === "Does not repeat") return 0;
    if (repeatOption === "Daily") return 1;
    if (repeatOption === "Weekly") return 2;
    if (repeatOption === "Monthly") return 3;
  };

  const dateFormatter = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    // if month has a zero as its first character, remove it
    const reFormatMonth = month.replace(/^0+/, "");
    // If day has a zero as its first character, remove it
    const reFormatDay = day.replace(/^0+/, "");

    const monthIndex = parseInt(month, 10) - 1;
    const reFormattedDate = `${reFormatMonth}/${reFormatDay}`;
    const formattedDate = new Date(year, monthIndex, day);

    return {
      reFormattedDate,
      formattedDate,
      year,
      monthIndex,
      day,
    };
  };

  const timeFormatter = (timeString, year, monthIndex, day) => {
    const [time, period] = timeString.split(" ");
    const [hour, min] = time.split(":");

    const hourIn24Format =
      period === "AM" ? parseInt(hour, 10) : parseInt(hour, 10) + 12;
    const minuteInt = parseInt(min, 10);

    // Create a new Date object using the extracted values
    const formattedTime = new Date(
      year,
      monthIndex,
      day,
      hourIn24Format,
      minuteInt
    );

    return formattedTime;
  };

  const dateAndTimeFormatter = (
    scheduleType,
    dateStringStart,
    dateStringEnd,
    startTimeString,
    endTimeString
  ) => {
    if (scheduleType === "date") {
      const { reFormattedDate, formattedDate, year, monthIndex, day } =
        dateFormatter(dateStringStart);
      const formattedStartTime = timeFormatter(
        startTimeString,
        year,
        monthIndex,
        day
      );
      const formattedEndTime = timeFormatter(
        endTimeString,
        year,
        monthIndex,
        day
      );

      return {
        reFormattedStartDate: reFormattedDate,
        formattedStartDate: formattedDate,
        formattedStartTime,
        formattedEndTime,
      };
    }

    if (scheduleType === "range") {
      const {
        reFormattedDate: reFormattedStartDate,
        formattedDate: formattedStartDate,
      } = dateFormatter(dateStringStart);
      const {
        reFormattedDate: reFormattedEndDate,
        formattedDate: formattedEndDate,
      } = dateFormatter(dateStringEnd);

      return {
        reFormattedStartDate,
        formattedStartDate,
        reFormattedEndDate,
        formattedEndDate,
      };
    }
  };

  // Display
  function displayscheduleType(schedulingOption) {
    if (schedulingOption === "date")
      return (
        <React.Fragment>
          <h3 className="mb-4 text-[color:var(--third-dark-med)]">By Date</h3>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 border-b pb-4">
              <h4 className="text-[color:var(--third-dark-med)] ">Date:</h4>
              <div className="flex justify-between items-center mx-4">
                <p className="font-light text-sm">Select date:</p>
                <input
                  type="date"
                  name="specificDate"
                  id="specificDate"
                  value={specificDate}
                  onChange={handleChangeSpecificDate}
                  className="border px-2 py-1 text-xs"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-[color:var(--third-dark-med)] ">Hours:</h4>
              <div className="flex justify-between items-center mx-4">
                <p className="font-light text-sm">Start time:</p>
                <select
                  id="specificDateStartTime"
                  name="specificDateStartTime"
                  value={specificDateStartTime}
                  onChange={handleChangeSpecificDate}
                  className="border px-2 py-1 text-xs"
                >
                  {timeOptions.map((time, index) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between items-center mx-4">
                <p className="font-light text-sm">End time:</p>
                <select
                  id="specificDateEndTime"
                  name="specificDateEndTime"
                  value={specificDateEndTime}
                  onChange={handleChangeSpecificDate}
                  className="border px-2 py-1 text-xs"
                >
                  {timeOptions.map((time, index) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    if (schedulingOption === "range")
      return (
        <React.Fragment>
          <h3 className="mb-4 text-[color:var(--third-dark-med)]">
            By Date Range
          </h3>
          <div className="flex flex-col gap-4 ">
            <div className="flex flex-col gap-2 border-b pb-4">
              <h4 className="text-[color:var(--third-dark-med)] ">Dates:</h4>
              <div className="flex justify-between items-center mx-4">
                <p className="font-light text-sm">Start date:</p>
                <input
                  type="date"
                  name="startDateRange"
                  id="startDateRange"
                  value={startDateRange}
                  onChange={handleRangeDateChange}
                  className="border px-2 py-1 text-xs"
                />
              </div>
              <div className="flex justify-between items-center mx-4">
                <p className="font-light text-sm">End date:</p>
                <input
                  type="date"
                  name="endDateRange"
                  id="endDateRange"
                  value={endDateRange}
                  onChange={handleRangeDateChange}
                  className="border px-2 py-1 text-xs"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 ">
              <h4 className="text-[color:var(--third-dark-med)] ">Hours:</h4>
              <div className="flex justify-between items-center mx-4">
                <p className="font-light text-sm">Start time:</p>
                <select
                  id="startTimeRange"
                  name="startTimeRange"
                  value={startTimeRange}
                  onChange={handleRangeDateChange}
                  className="border px-2 py-1 text-xs"
                >
                  {timeOptions.map((time, index) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between items-center mx-4">
                <p className="font-light text-sm">End time:</p>
                <select
                  id="endTimeRange"
                  name="endTimeRange"
                  value={endTimeRange}
                  onChange={handleRangeDateChange}
                  className="border px-2 py-1 text-xs"
                >
                  {timeOptions.map((time, index) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    if (schedulingOption === "week")
      return (
        <React.Fragment>
          <h3 className="mb-4 text-[color:var(--third-dark-med)] ">
            By Day of Week
          </h3>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 border-b pb-4">
              <h4 className="text-[color:var(--third-dark-med)] ">
                Day of week:
              </h4>
              <div className="flex justify-between items-center mx-4">
                <p className="font-light text-sm">Select weekday:</p>
                <select
                  id="weekday"
                  name="weekday"
                  value={weekday}
                  onChange={handleDayOfWeekChange}
                  className="border px-2 py-1 text-xs"
                >
                  <option value="Sunday">Sunday</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-2  border-b pb-4">
              <h4 className="text-[color:var(--third-dark-med)] ">Hours:</h4>
              <div className="flex justify-between items-center mx-4">
                <p className="font-light text-sm">Start time:</p>
                <select
                  id="weekStartTime"
                  name="weekStartTime"
                  value={weekStartTime}
                  onChange={handleDayOfWeekChange}
                  className="border px-2 py-1 text-xs"
                >
                  {timeOptions.map((time, index) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between items-center mx-4">
                <p className="font-light text-sm">End time:</p>
                <select
                  id="weekEndTime"
                  name="weekEndTime"
                  value={weekEndTime}
                  onChange={handleDayOfWeekChange}
                  className="border px-2 py-1 text-xs"
                >
                  {timeOptions.map((time, index) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-[color:var(--third-dark-med)] ">
                Repetition:
              </h4>
              <div className="flex justify-between items-center mx-4">
                <p className="font-light text-sm">Select frequency:</p>
                <select
                  id="repeatOption"
                  name="repeatOption"
                  value={repeatOption}
                  onChange={handleDayOfWeekChange}
                  className="border px-2 py-1 text-xs"
                >
                  <option value="Does not repeat">Does not repeat</option>
                  <option value="Once per week">Once per week</option>
                  <option value="Repeat daily">Repeat daily</option>
                  <option value="Weekdays (Mon - Fri)">
                    Weekdays (Mon - Fri)
                  </option>
                </select>
              </div>
            </div>
          </div>
        </React.Fragment>
      );
  }

  return (
    <div className="w-screen md:w-[60vw] lg:w-[45vw] xl:w-[35vw]">
      <div className="flex justify-between p-4 border-b">
        <span className="flex gap-2 items-center">
          <Image
            src={calendar_icon}
            alt="calendar icon"
            className=" opacity-50 mx-auto w-8 h-8"
          />
          <h4>Create Schedule</h4>
        </span>
        <IconButton onClick={toggleDrawer}>
          <CloseIcon />
        </IconButton>
      </div>
      <div className="border-b">
        <FormControl
          sx={{
            width: "100%",
            padding: "16px",
          }}
        >
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="date"
            name="radio-buttons-group"
            value={scheduleType}
            onChange={handleChangeScheduleType}
            sx={{ width: "100%" }}
          >
            <FormControlLabel
              value="date"
              control={<Radio color="warning" />}
              label="By date"
              labelPlacement="start"
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                paddingRight: "20px",
              }}
            />
            <FormControlLabel
              value="range"
              control={<Radio color="warning" />}
              label="By date range"
              labelPlacement="start"
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                paddingRight: "20px",
              }}
            />
            <FormControlLabel
              value="week"
              control={<Radio color="warning" />}
              label="By day of week"
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
      <div className="p-4">{displayscheduleType(scheduleType)}</div>
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

export default EditScheduleDrawer;