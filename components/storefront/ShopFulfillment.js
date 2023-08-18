import React, { useState, useRef, useEffect } from "react";
import { ShopSwitch } from "../global/switches/ShopSwitch";
import DeliveryDiningOutlinedIcon from "@mui/icons-material/DeliveryDiningOutlined";
import TakeoutDiningOutlinedIcon from "@mui/icons-material/TakeoutDiningOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import Accordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import dayjs from "dayjs";
import Badge from "@mui/material/Badge";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  // border: "2px solid #000",
  boxShadow: 24,
  borderRadius: "4px",
  p: 4,
};

function ServerDay(props) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const isSelected =
    !props.outsideCurrentMonth &&
    highlightedDays.indexOf(props.day.date()) >= 0;

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={isSelected ? "🦍" : undefined}
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
      />
    </Badge>
  );
}

let stagedDeliveryDate = "Select date";
let stagedDeliveryTime = "time";

function ShopFulfillment({ isOwner, userAccount, handleOpenSnackbar }) {
  const {
    fulfillmentMethodInt,
    hasCustomAvailability,
    isTimeBlockEnabled,
    timeBlock,
    timeBlockSeconds,
    availability,
    id: accountId,
  } = userAccount ? userAccount : {};

  const { datesAvailability, datesRangedAvailability, daysOfWeekAvailability } =
    availability ? availability : {};

  const [fulfillmentType, setFulfillmentType] = useState("pickup");
  const [expanded, setExpanded] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");

  // Delivery states
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");

  // Calendar availability states
  const [openAvailabilityModalOwner, setOpenAvailabilityModalOwner] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDateValues, setSelectedDateValues] = useState({
    selectedDate: new Date().toLocaleDateString(),
    selectedDateHourDisplay: "Closed",
  });
  const [highlightedDays, setHighlightedDays] = useState([1, 2, 3]);
  const [timeBlockTimes, setTimeBlockTimes] = useState([]);
  const [calendarMonth, setCalendarMonth] = useState(dayjs());
  const [calendarDate, setCalendarDate] = useState(dayjs());

  const { selectedDate, selectedDateHourDisplay } = selectedDateValues;

  const requestAbortControllerMonth = useRef(null);
  const requestAbortControllerDay = useRef(null);
  const { push } = useRouter();

  const handleOpenAvailabilityModalOwner = () => {
    let date = dayjs();

    if (deliveryDate !== "" && deliveryDate !== "Select date") {
      date = dayjs(deliveryDate);
      setCalendarDate(date);
      setCalendarMonth(date);
    }

    const selectedDateValues = fetchShopHours(
      date,
      datesAvailability,
      datesRangedAvailability,
      daysOfWeekAvailability
    );

    fetchHighlightedDays(
      date,
      datesAvailability,
      datesRangedAvailability,
      daysOfWeekAvailability
    );

    if (isTimeBlockEnabled && selectedDateValues) {
      formatTimeBlockTimes(selectedDateValues);
    }

    setOpenAvailabilityModalOwner(true);
  };

  const formatTimeBlockTimes = (selectedDateValues) => {
    const { currentDate, hoursDisplay } = selectedDateValues;

    if (hoursDisplay === "Closed") return [];

    const startTime = hoursDisplay.split("-")[0];
    const endTime = hoursDisplay.split("-")[1];

    const startTimeEpoch = convertToEpoch(currentDate, startTime);
    const endTimeEpoch = convertToEpoch(currentDate, endTime);

    const intervals = generateTimeIntervals(
      startTimeEpoch,
      endTimeEpoch,
      timeBlock
    );

    setTimeBlockTimes(intervals);
  };

  const convertToEpoch = (date, time) => {
    const dateTimeString = `${date} ${time}`;
    const dateTime = new Date(dateTimeString);

    return dateTime.getTime();
  };

  const generateTimeIntervals = (startTimeEpoch, endTimeEpoch, interval) => {
    const intervalValue = parseInt(interval.split(" ")[0]);
    const intervalUnit = interval.split(" ")[1];

    const interValueInMs = convertToMs(intervalValue, intervalUnit);
    let plusInterval = startTimeEpoch;

    const intervals = [];

    do {
      intervals.push(plusInterval);
      plusInterval += interValueInMs;
    } while (plusInterval <= endTimeEpoch);

    const lastInterval = intervals[intervals.length - 1];

    if (lastInterval + interValueInMs > endTimeEpoch) {
      intervals.pop();
    }

    // convert interval epoch times to 12hr time strings
    const intervalsIn12Hr = convertToIntervalsIn12Hr(intervals);
    return intervalsIn12Hr;
  };

  const convertToIntervalsIn12Hr = (intervals) => {
    const intervalsIn12Hr = intervals.map((interval) => {
      const date = new Date(interval); // Convert to milliseconds
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";

      const hours12 = hours % 12 || 12; // Convert to 12-hour format

      const hoursStr = hours12.toString();
      const minutesStr = minutes < 10 ? `0${minutes}` : minutes;

      const timeStr = `${hoursStr}:${minutesStr} ${ampm}`;

      return timeStr;
    });

    return intervalsIn12Hr;
  };

  const convertToMs = (value, unit) => {
    if (unit === "min") {
      return value * 60 * 1000;
    }

    if (unit === "hour") {
      return value * 60 * 60 * 1000;
    }
  };

  const fetchShopHours = (
    date,
    datesAvailability,
    datesRangedAvailability,
    daysOfWeekAvailability
  ) => {
    const controlloer = new AbortController();

    const datesAvailabilitySchedules = getDatesAvailabilitySchedules(
      datesAvailability,
      date
    );

    if (datesAvailabilitySchedules) {
      const { currentDate, hoursDisplay } = datesAvailabilitySchedules;
      setSelectedDateValues({
        selectedDate: currentDate,
        selectedDateHourDisplay: hoursDisplay,
      });
      requestAbortControllerDay.current = controlloer;
      return datesAvailabilitySchedules;
    }

    const datesRangedAvailabilitySchedules = getDatesRangedSchedules(
      datesRangedAvailability,
      date
    );

    if (datesRangedAvailabilitySchedules) {
      const { currentDate, hoursDisplay } = datesRangedAvailabilitySchedules;
      setSelectedDateValues({
        selectedDate: currentDate,
        selectedDateHourDisplay: hoursDisplay,
      });
      requestAbortControllerDay.current = controlloer;
      return datesRangedAvailabilitySchedules;
    }

    const getWeekDaysSchedule = getWeekDaysSchedules(
      daysOfWeekAvailability,
      date
    );

    if (getWeekDaysSchedule) {
      const { currentDate, hoursDisplay } = getWeekDaysSchedule;
      setSelectedDateValues({
        selectedDate: currentDate,
        selectedDateHourDisplay: hoursDisplay,
      });
      requestAbortControllerDay.current = controlloer;
      return getWeekDaysSchedule;
    }

    const { $y: year, $M: month, $D: day, $d: fullDate, $W: dayIndex } = date;
    const currDate = `${month + 1}/${day}/${year}`;

    setSelectedDateValues({
      selectedDate: currDate,
      selectedDateHourDisplay: "Closed",
    });
  };

  const getWeekDaysSchedules = (daysOfWeekAvailability, date) => {
    const { $y: year, $M: month, $D: day, $d: fullDate, $W: dayIndex } = date;
    const actualMonthByNumber = month + 1;

    const dateFormatted = `${actualMonthByNumber}/${day}`;
    const dayIndexStr = dayIndex.toString();

    let scheduleToday = null;

    if (!daysOfWeekAvailability) return scheduleToday;
    if (daysOfWeekAvailability.length === 0) return scheduleToday;

    for (let i = 0; i < daysOfWeekAvailability.length; i++) {
      const currSchedule = daysOfWeekAvailability[i];
      const { days, hoursDisplay, isEnabled } = currSchedule;
      const daysArr = days.split(",");

      if (!isEnabled) continue;

      if (!daysArr.includes(dayIndexStr)) continue;

      const currentDate = dateFormatted + "/" + year;
      scheduleToday = {
        currentDate,
        hoursDisplay,
      };
    }

    return scheduleToday;
  };

  const getDatesAvailabilitySchedules = (datesAvailability, date) => {
    const { $y: year, $M: month, $D: day, $d: fullDate } = date;
    const actualMonthByNumber = month + 1;

    const dateFormatted = `${actualMonthByNumber}/${day}`;

    let scheduleToday = null;

    if (!datesAvailability) return scheduleToday;
    if (datesAvailability.length === 0) return scheduleToday;

    for (let i = 0; i < datesAvailability.length; i++) {
      const currSchedule = datesAvailability[i];
      const { dateStr, hoursDisplay, isEnabled } = currSchedule;

      if (!isEnabled) continue;

      if (dateStr === dateFormatted) {
        const currentDate = dateStr + "/" + year;
        scheduleToday = {
          currentDate,
          hoursDisplay,
        };
        break;
      }
    }

    return scheduleToday;
  };

  const getDatesRangedSchedules = (datesRangedAvailability, date) => {
    const { $y: year, $M: month, $D: day, $d: fullDate } = date;
    const actualMonthByNumber = month + 1;

    const dateFormatted = `${actualMonthByNumber}/${day}`;

    let scheduleToday = null;

    if (!datesRangedAvailability) return scheduleToday;
    if (datesRangedAvailability.length === 0) return scheduleToday;

    for (let i = 0; i < datesRangedAvailability.length; i++) {
      const currSchedule = datesRangedAvailability[i];
      const {
        startDateStr,
        endDateStr,
        startDateStrUnformat,
        endDateStrUnformat,
        hoursDisplay,
        isEnabled,
      } = currSchedule;

      const startDateYear = startDateStrUnformat.split("-")[0];
      const endDateYear = endDateStrUnformat.split("-")[0];

      const startDateMonth = startDateStr.split("/")[0];
      const startDateDay = startDateStr.split("/")[1];

      const endDateMonth = endDateStr.split("/")[0];
      const endDateDay = endDateStr.split("/")[1];

      if (!isEnabled) continue;

      if (startDateYear > year) continue;
      if (endDateYear < year) continue;
      if (startDateMonth > actualMonthByNumber) continue;
      if (endDateMonth < actualMonthByNumber) continue;

      if (
        startDateMonth <= actualMonthByNumber &&
        endDateMonth >= actualMonthByNumber
      ) {
        if (startDateDay > day) continue;
        if (endDateDay < day) continue;

        const currentDate = dateFormatted + "/" + year;
        scheduleToday = {
          currentDate,
          hoursDisplay,
        };
      }
    }

    return scheduleToday;
  };

  const fetchHighlightedDays = (
    date,
    datesAvailability,
    datesRagnedAvailability,
    daysOfWeekAvailability
  ) => {
    const controller = new AbortController();
    const allDaysWithSchedule = [];
    const daysOfSpecificDatesScheduled = getDaysFromDatesAvailability(
      date,
      datesAvailability
    );
    const daysOfSpecificDatesRangedScheduled =
      getDaysFromDatesRangedAvailability(date, datesRagnedAvailability);
    const daysOfWeekScheduled = getDaysFromDaysOfWeekAvailability(
      date,
      daysOfWeekAvailability
    );

    allDaysWithSchedule.push(...daysOfSpecificDatesScheduled);
    allDaysWithSchedule.push(...daysOfSpecificDatesRangedScheduled);
    allDaysWithSchedule.push(...daysOfWeekScheduled);

    // make sure there are no duplicates in the array of all days with schedule
    const uniqueDaysWithSchedule = [...new Set(allDaysWithSchedule)];

    setHighlightedDays(uniqueDaysWithSchedule);
    setIsLoading(false);

    requestAbortControllerMonth.current = controller;
  };

  const getDaysFromDatesAvailability = (date, datesAvailability) => {
    // For month: 0 = January, 11 = December.
    const { $y: year, $M: month, $D: day, $d: fullDate } = date;
    const actualMonthByNumber = month + 1;

    const days = [];

    if (!datesAvailability) return days;
    if (datesAvailability.length === 0) return days;

    datesAvailability.forEach((date) => {
      const { dateStr, dateStrUnformat, isEnabled } = date;

      if (!isEnabled) return;

      const dateYear = dateStrUnformat.split("-")[0];
      const monthDate = dateStrUnformat.split("-")[1];
      // Remove 0 in front of month if there's one.
      const monthRemoveZeroPrefixAndIndexed =
        monthDate.split("")[0] === "0"
          ? monthDate.split("")[1]
          : monthDate.split("")[0];

      if (
        year == dateYear &&
        actualMonthByNumber == monthRemoveZeroPrefixAndIndexed
      ) {
        const day = parseInt(dateStr.split("/")[1]);
        days.push(day);
      }
    });

    return days;
  };

  const getDaysFromDatesRangedAvailability = (
    date,
    datesRangedAvailability
  ) => {
    const days = [];

    if (!datesRangedAvailability) return days;
    if (datesRangedAvailability.length === 0) return days;

    const { $y: year, $M: month, $D: day, $d: fullDate } = date;
    const actualMonthByNumber = month + 1;

    datesRangedAvailability.forEach((date) => {
      const {
        startDateStr,
        startDateStrUnformat,
        endDateStr,
        endDateStrUnformat,
        isEnabled,
      } = date;

      if (!isEnabled) return;

      const startYear = parseInt(startDateStrUnformat.split("-")[0]);
      const endYear = parseInt(endDateStrUnformat.split("-")[0]);

      const startMonth = parseInt(startDateStr.split("/")[0]);
      const endMonth = parseInt(endDateStr.split("/")[0]);

      const startDay = parseInt(startDateStr.split("/")[1]);
      const endDay = parseInt(endDateStr.split("/")[1]);

      if (startYear > year || year > endYear) return;
      if (startMonth > actualMonthByNumber || actualMonthByNumber > endMonth)
        return;

      if (startMonth === endMonth) {
        for (let i = startDay; i <= endDay; i++) {
          days.push(i);
        }
      } else {
        let lastDayOfMonth = 31;

        if (startMonth === 2) {
          lastDayOfMonth = 28;
        } else if (
          startMonth === 4 ||
          startMonth === 6 ||
          startMonth === 9 ||
          startMonth === 11
        ) {
          lastDayOfMonth = 30;
        } else {
          lastDayOfMonth = 31;
        }

        if (startMonth === actualMonthByNumber) {
          for (let i = startDay; i <= lastDayOfMonth; i++) {
            days.push(i);
          }
        }

        if (endMonth === actualMonthByNumber) {
          for (let i = 1; i <= endDay; i++) {
            days.push(i);
          }
        }
      }
    });

    return days;
  };

  const getDaysFromDaysOfWeekAvailability = (date, daysOfWeekAvailability) => {
    const daysArr = [];
    const { $y: year, $M: month, $D: day, $d: fullDate } = date;
    const actualMonthByNumber = month + 1;

    if (!daysOfWeekAvailability) return daysArr;
    if (daysOfWeekAvailability.length === 0) return daysArr;

    daysOfWeekAvailability.forEach((schedule) => {
      const { days, isEnabled } = schedule;

      if (!isEnabled) return;

      const daysScheduleArr = days.split(",");

      daysScheduleArr.forEach((day) => {
        const dayInt = parseInt(day);
        const weekdays = findWeekdays(year, actualMonthByNumber, dayInt);

        daysArr.push(...weekdays);
      });
    });

    return daysArr;
  };

  const findWeekdays = (year, month, targetWeekday) => {
    const firstDay = new Date(year, month - 1, 1);
    const weekdays = [];

    for (let day = 1; day <= 31; day++) {
      const date = new Date(year, month - 1, day);
      if (date.getDay() === targetWeekday) {
        weekdays.push(date.getDate());
      }
    }

    return weekdays;
  };

  const handleCloseAvailabilityModalOwner = () =>
    setOpenAvailabilityModalOwner(false);

  const handleMonthChange = (date) => {
    if (requestAbortControllerMonth.current) {
      // make sure that you are aborting useless requests
      // because it is possible to switch between months pretty quickly
      requestAbortControllerMonth.current.abort();
    }

    setIsLoading(true);
    // setCurrentMonth(date);
    fetchShopHours(
      date,
      datesAvailability,
      datesRangedAvailability,
      daysOfWeekAvailability
    );

    fetchHighlightedDays(
      date,
      datesAvailability,
      datesRangedAvailability,
      daysOfWeekAvailability
    );
  };

  const handleDateClick = (date) => {
    const selectedDateValues = fetchShopHours(
      date,
      datesAvailability,
      datesRangedAvailability,
      daysOfWeekAvailability
    );

    const selectedDate = new Date(date).toLocaleDateString();
    setDeliveryDate(selectedDate);

    if (isTimeBlockEnabled && selectedDateValues) {
      // TODO: stageDeliveryTime
      formatTimeBlockTimes(selectedDateValues);
      return;
    }

    setTimeBlockTimes([]);
  };

  const handleCancelDeliveryChange = () => {
    setOpenAvailabilityModalOwner(false);
    setTimeBlockTimes([]);
    setDeliveryTime(stagedDeliveryTime);
    setDeliveryDate(stagedDeliveryDate);
  };

  const handleSetDeliveryChange = () => {
    if (selectedDateHourDisplay === "Closed") {
      handleOpenSnackbar("Store is closed on this day.");
      return;
    }
    stagedDeliveryDate = deliveryDate;
    setDeliveryDate(stagedDeliveryDate);
    setOpenAvailabilityModalOwner(false);
    setTimeBlockTimes([]);

    if (!isTimeBlockEnabled) return;
    stagedDeliveryTime = deliveryTime;
  };

  const handleSelectTime = (e) => {
    const { name } = e.target;
    setDeliveryTime(name);
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleSwitch = () => {
    if (fulfillmentType === "delivery") {
      setFulfillmentType("pickup");
      return;
    }

    handleChange("panel1");
    setFulfillmentType("delivery");
    return;
  };

  const handleChangeDeliveryClick = () => {
    push("/account/my-shop/fulfillment");
  };

  const handleChangeAvailabilityClick = () => {
    push("/account/my-shop/availability");
  };

  const handleDeliveryAddressChange = (e) => {
    const { value } = e.target;
    setDeliveryAddress(value);
  };

  return (
    <div className="p-4 w-full flex flex-col md:flex-col-reverse ">
      {!isOwner ? (
        fulfillmentMethodInt === 2 ? (
          <Accordion
            onChange={handleSwitch}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
            sx={{
              backgroundColor: "var(--brown-bg)",
              boxShadow: "none",
              width: "100%",
              borderRadius: "8px",
            }}
          >
            <AccordionSummary
              expandIcon={
                <ShopSwitch
                  checked={fulfillmentType === "delivery"}
                  onClick={handleSwitch}
                />
              }
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              {/* <div className=""> */}
              {fulfillmentType === "delivery" ? (
                <span className="flex gap-1 items-center">
                  <DeliveryDiningOutlinedIcon
                    fontSize="small"
                    sx={{ color: "var(--brown-text)" }}
                  />
                  <p className="text-sm text-[color:var(--brown-text)]  ">
                    delivery
                  </p>
                </span>
              ) : (
                <span className="flex gap-1 items-center">
                  <TakeoutDiningOutlinedIcon
                    fontSize="small"
                    sx={{ color: "var(--brown-text)" }}
                  />
                  <p className="text-sm text-[color:var(--brown-text)]">
                    pickup
                  </p>
                </span>
              )}
              {/* </div> */}
            </AccordionSummary>
            <AccordionDetails>
              <div className="relative flex-grow">
                <label
                  htmlFor="deliveryAddress"
                  className="absolute flex items-center gap-2 top-[12px] left-4 text-[color:var(--brown-text)] font-light text-sm"
                >
                  <LocationOnOutlinedIcon fontSize="small" />
                </label>
                <input
                  type="text"
                  name="deliveryAddress"
                  id="deliveryAddress"
                  value={deliveryAddress}
                  onChange={handleDeliveryAddressChange}
                  placeholder="deliver to: address"
                  className="border border-[color:var(--brown-bg)] rounded w-full py-3 placeholder:text-[color:var(--brown-text)] placeholder:text-sm  font-light text-sm indent-10"
                />
              </div>
            </AccordionDetails>
          </Accordion>
        ) : fulfillmentMethodInt === 1 ? (
          <div className="flex justify-between items-center bg-[color:var(--brown-bg)] p-4 rounded">
            <div className="flex gap-1 items-center">
              <TakeoutDiningOutlinedIcon
                fontSize="small"
                sx={{ color: "var(--brown-text)" }}
              />
              <p className="text-sm text-[color:var(--brown-text)]">
                pickup only
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center bg-[color:var(--brown-bg)] p-4 rounded">
            <div className="flex gap-1 items-center">
              <LocationOnOutlinedIcon
                fontSize="small"
                sx={{ color: "var(--brown-text)" }}
              />
              <p className="text-sm text-[color:var(--brown-text)]">
                delivery only
              </p>
            </div>
          </div>
        )
      ) : (
        <div className="flex justify-between items-center bg-[color:var(--brown-bg)] p-4 rounded">
          {fulfillmentMethodInt == 0 && (
            <div className="flex items-center gap-2">
              <p className="text-sm text-[color:var(--brown-text)]">Enabled:</p>
              <div className="flex gap-1 items-center">
                <LocationOnOutlinedIcon
                  fontSize="small"
                  sx={{ color: "var(--brown-text)" }}
                />
                <p className="text-sm text-[color:var(--brown-text)]">
                  delivery
                </p>
              </div>
            </div>
          )}
          {fulfillmentMethodInt == 1 && (
            <div className="flex items-center gap-2">
              <p className="text-sm text-[color:var(--brown-text)]">Enabled:</p>
              <div className="flex gap-1 items-center">
                <TakeoutDiningOutlinedIcon
                  fontSize="small"
                  sx={{ color: "var(--brown-text)" }}
                />
                <p className="text-sm text-[color:var(--brown-text)]">pickup</p>
              </div>
            </div>
          )}
          {fulfillmentMethodInt == 2 && (
            <div className="flex items-center gap-2">
              <p className="text-sm text-[color:var(--brown-text)]">Enabled:</p>
              <div className="flex gap-1 items-center">
                <LocationOnOutlinedIcon
                  fontSize="small"
                  sx={{ color: "var(--brown-text)" }}
                />
                <p className="text-sm text-[color:var(--brown-text)]">
                  delivery
                </p>
              </div>
              <p className="text-sm text-[color:var(--brown-text)]">+</p>
              <div className="flex gap-1 items-center">
                <TakeoutDiningOutlinedIcon
                  fontSize="small"
                  sx={{ color: "var(--brown-text)" }}
                />
                <p className="text-sm text-[color:var(--brown-text)]">pickup</p>
              </div>
            </div>
          )}
          <button
            onClick={handleChangeDeliveryClick}
            className="underline font-light text-sm"
          >
            edit
          </button>
        </div>
      )}

      {hasCustomAvailability && isOwner ? (
        <div className="px-4 py-2 mt-2 flex justify-between items-center border border-[color:var(--gray-light-med)] rounded md:mb-4 ">
          <span className="flex items-center gap-2">
            <p className="font-extralight text-sm text-[color:var(--gray-text)] ">
              Store hours:
            </p>
            <button
              onClick={handleOpenAvailabilityModalOwner}
              className="font-extralight text-xs border border-[color:var(--black-design-extralight)] rounded px-2 py-1"
            >
              View availabilities
            </button>
          </span>
          <span className="border border-[color:var(--gray-light-med)] h-4 "></span>
          <button
            onClick={handleChangeAvailabilityClick}
            className="text-sm underline text-[color:var(--black-design-extralight)] font-light "
          >
            edit
          </button>
        </div>
      ) : (
        availability && (
          <div className="px-4 py-2 mt-2 flex justify-between items-center border border-[color:var(--gray-light-med)] rounded md:mb-4 ">
            <span className="flex flex-col">
              <p className="font-extralight text-[color:var(--gray-text)] ">
                Get it by
              </p>
              <div className="flex gap-2">
                <p className="text-[color:var(--black-design-extralight)] text-sm font-light ">
                  {deliveryDate === "" ? "Select a date" : deliveryDate}
                </p>

                {isTimeBlockEnabled && (
                  <p className="text-[color:var(--black-design-extralight)] text-sm font-light ">
                    {deliveryTime === "" ? "& time" : `@ ${deliveryTime}`}
                  </p>
                )}
              </div>
            </span>
            <span className="border border-[color:var(--gray-light-med)] h-4 "></span>
            <button
              onClick={handleOpenAvailabilityModalOwner}
              className="text-sm underline text-[color:var(--black-design-extralight)] font-light "
            >
              change
            </button>
          </div>
        )
      )}
      <Modal
        open={openAvailabilityModalOwner}
        onClose={handleCloseAvailabilityModalOwner}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="max-h-[36rem] overflow-y-scroll">
            <div className="mb-4 border-b pb-4">
              <h3 className="mb-2 ml-4 underline">Availability:</h3>
              <div className="flex gap-4 items-center px-8 mt-4  text-[color:var(--black-design-extralight)]">
                <p>Date:</p>
                <p>{selectedDate}</p>
              </div>
              <div className="flex gap-4 items-center px-8  text-[color:var(--black-design-extralight)]">
                <p>Store hours:</p>
                <p>{selectedDateHourDisplay}</p>
              </div>
            </div>
            <div>
              {/* <h3 className="mb-2 ml-4 underline">Availability:</h3> */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                  disablePast
                  defaultValue={calendarDate}
                  defaultCalendarMonth={calendarMonth}
                  loading={isLoading}
                  onMonthChange={handleMonthChange}
                  onChange={handleDateClick}
                  renderLoading={() => <DayCalendarSkeleton />}
                  slots={{
                    day: ServerDay,
                  }}
                  slotProps={{
                    day: {
                      highlightedDays,
                    },
                  }}
                />
              </LocalizationProvider>
            </div>
            {isTimeBlockEnabled && timeBlockTimes.length !== 0 && (
              <div className="border-t pt-4 pb-16 flex flex-col gap-4 px-4 text-[color:var(--black-design-extralight)]">
                <div className="flex items-center gap-2">
                  <p className=" whitespace-nowrap">Available times:</p>
                  {isOwner && <p className="font-light text-xs">(View only)</p>}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {timeBlockTimes.map((time, i) => {
                    return isOwner ? (
                      <p
                        key={i}
                        className="whitespace-nowrap border rounded px-2 py-1 text-[color:var(--gray-text)] w-fit"
                      >
                        {time}
                      </p>
                    ) : (
                      <button
                        name={time}
                        onClick={handleSelectTime}
                        key={i}
                        className={`whitespace-nowrap border rounded px-2 py-1 text-[color:var(--gray-text)] w-fit hover:bg-[color:var(--gray)] hover:text-white focus:bg-[color:var(--black-design-extralight)] focus:text-white
                        ${
                          deliveryTime == time
                            ? "bg-[color:var(--black-design-extralight)] text-white"
                            : ""
                        }
                        
                        `}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {!isOwner && (
              <div className="flex gap-4 fixed bottom-0 w-full left-0 p-4 bg-white border-t">
                <button
                  onClick={handleCancelDeliveryChange}
                  className="w-1/2 border border-[color:var(--black-design-extralight)] rounded text-[color:var(--black-design-extralight)] py-1 active:bg-[color:var(--black-design-extralight)] active:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSetDeliveryChange}
                  className="w-1/2 text-white bg-[color:var(--black-design-extralight)] rounded py-1 active:bg-white active:border active:border-[color:var(--black-design-extralight) active:text-[color:var(--black-design-extralight)]"
                >
                  Set
                </button>
              </div>
            )}
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default ShopFulfillment;

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const AccordionSummary = styled((props) => <MuiAccordionSummary {...props} />)(
  ({ theme }) => ({
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
      transform: "rotate(0deg)",
    },
  })
);
