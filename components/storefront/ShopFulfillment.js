import React, { useState, useRef, useMemo, useEffect } from "react";
import { ShopSwitch } from "../global/switches/ShopSwitch";
import DeliveryDiningOutlinedIcon from "@mui/icons-material/DeliveryDiningOutlined";
import TakeoutDiningOutlinedIcon from "@mui/icons-material/TakeoutDiningOutlined";
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
import PlacesAutoComplete from "./PlacesAutoComplete";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import { useLoadScript } from "@react-google-maps/api";
import { useCartStore } from "@/lib/store";
import { useHasHydrated } from "@/utils/useHasHydrated";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "min-content",
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
  const hydrated = useHasHydrated();
  const cartDetails = useCartStore((state) => state.cartDetails);
  const setCartDetails = useCartStore((state) => state.setCartDetails);

  const {
    fulfillmentDisplay,
    fulfillmentType,
    deliveryAddress,
    orderForDateDisplay,
    orderForTimeDisplay,
  } = cartDetails;

  const {
    fulfillmentMethodInt,
    fulfillmentMethods,
    availability,
    lat: bizLat,
    lng: bizLng,
    id: accountId,
  } = userAccount ? userAccount : {};

  const {
    timeBlock,
    isTimeBlockEnabled,
    orderInAdvanceInSeconds,
    requireOrderInAdvance,
    orderInAdvanceDisplay,
  } = availability ? availability : {};

  const {
    datesAvailability,
    datesRangedAvailability,
    daysOfWeekAvailability,
    hasCustomAvailability,
  } = availability ? availability : {};

  // const libraries = useMemo(() => ["places"], []);
  const [libraries] = useState(["places"]);

  // Store lat, lng as State Variables
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  // const [fulfillmentType, setFulfillmentType] = useState("pickup");
  const [expanded, setExpanded] = useState(false);

  const [deliveryDistanceInMi, setDeliveryDistanceInMi] = useState("");
  const [deliveryDistanceInKm, setDeliveryDistanceInKm] = useState("");
  const [isDeliveryTooFar, setIsDeliveryTooFar] = useState(false);

  // Delivery states
  // const [deliveryDate, setDeliveryDate] = useState("");
  // const [deliveryTime, setDeliveryTime] = useState("");
  const [localDeliveryDistanceMi, setLocalDeliveryDistanceMi] = useState("");
  const [localDeliveryDistanceKm, setLocalDeliveryDistanceKm] = useState("");

  // Calendar availability states
  const [openAvailabilityModalOwner, setOpenAvailabilityModalOwner] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDateValues, setSelectedDateValues] = useState({
    selectedDate: new Date().toLocaleDateString(),
    selectedDateHourDisplay: "Closed",
  });
  const [highlightedDays, setHighlightedDays] = useState([]);
  const [timeBlockTimes, setTimeBlockTimes] = useState([]);
  const [calendarMonth, setCalendarMonth] = useState(dayjs());
  const [calendarDate, setCalendarDate] = useState(dayjs());

  const { selectedDate, selectedDateHourDisplay } = selectedDateValues;

  const requestAbortControllerMonth = useRef(null);
  const requestAbortControllerDay = useRef(null);
  const { push } = useRouter();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_GEO_API_KEY,
    libraries,
  });

  useEffect(() => {
    for (let i = 0; i < fulfillmentMethods.length; i++) {
      const fulfillment = fulfillmentMethods[i];
      const { methodInt, localDeliveryDistanceKm, localDeliveryDistanceMi } =
        fulfillment;

      //0: delivery, 1:pickup
      if (methodInt === 0) {
        setLocalDeliveryDistanceKm(localDeliveryDistanceKm);
        setLocalDeliveryDistanceMi(localDeliveryDistanceMi);
      }
    }
  }, [fulfillmentMethods]);

  // useEffect(() => {
  //   const { fulfillmentTypeDisplay } = cartDetails;
  //   setFulfillmentType(fulfillmentTypeDisplay);
  // }, [cartDetails]);

  const handleOpenAvailabilityModalOwner = () => {
    let date = dayjs();

    if (orderForDateDisplay !== "" && orderForDateDisplay !== "Select date") {
      date = dayjs(orderForDateDisplay);
      setCalendarDate(date);
      setCalendarMonth(date);
    } else {
      const dateStr = new Date(date).toLocaleDateString();

      setCartDetails({
        orderForDateDisplay: dateStr,
      });
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

    let daysInMonth = 31;
    //write a function to find the days in each month and set it to daysInMonth.
    if (month === 2) {
      daysInMonth = 28;
    } else if (month === 4 || month === 6 || month === 9 || month === 11) {
      daysInMonth = 30;
    } else {
      daysInMonth = 31;
    }

    for (let day = 1; day <= daysInMonth; day++) {
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

    setCartDetails({
      orderForDateDisplay: selectedDate,
    });

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
    // setDeliveryTime(stagedDeliveryTime);
    // setDeliveryDate(stagedDeliveryDate);
    setCartDetails({
      orderForDateDisplay: stagedDeliveryDate,
      orderForTimeDisplay: stagedDeliveryTime,
    });
  };

  const handleSetDeliveryChange = () => {
    if (selectedDateHourDisplay === "Closed") {
      handleOpenSnackbar("Store is closed on this day.");
      return;
    }

    if (isTimeBlockEnabled) {
      if (orderForTimeDisplay === "" || orderForTimeDisplay === "time") {
        handleOpenSnackbar("Please select a time.");
        return;
      }
    }

    if (requireOrderInAdvance) {
      if (isTimeBlockEnabled) {
        const selectedDateTime = `${orderForDateDisplay} ${orderForTimeDisplay}`;
        const selectedDateTimeEpoch = new Date(selectedDateTime).getTime();

        const nowEpoch = new Date().getTime();
        const difference = selectedDateTimeEpoch - nowEpoch;
        const orderInAdvanceMiliseconds = orderInAdvanceInSeconds * 1000;

        if (difference < orderInAdvanceMiliseconds) {
          handleOpenSnackbar(`Must order ${orderInAdvanceDisplay} in advance.`);
          return;
        }
      } else {
        const selectedDateEpoch = new Date(orderForDateDisplay).getTime();
        const nowEpoch = new Date();
        const todayStart = nowEpoch.setHours(0, 0, 0, 0);
        const todayStartEpoch = new Date(todayStart).getTime();
        const difference = selectedDateEpoch - todayStartEpoch;
        const orderInAdvanceMiliseconds = orderInAdvanceInSeconds * 1000;

        if (difference < orderInAdvanceMiliseconds) {
          handleOpenSnackbar(
            `Must place order ${orderInAdvanceDisplay} in advance.`
          );
          return;
        }
      }
    }

    stagedDeliveryDate = orderForDateDisplay;

    setCartDetails({
      orderForDateDisplay: stagedDeliveryDate,
    });
    setOpenAvailabilityModalOwner(false);
    setTimeBlockTimes([]);

    if (!isTimeBlockEnabled) return;
    stagedDeliveryTime = orderForTimeDisplay;
  };

  const handleSelectTime = (e) => {
    const { name } = e.target;
    // setDeliveryTime(name);
    setCartDetails({ orderForTimeDisplay: name });
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleSwitch = () => {
    if (fulfillmentType === 0) {
      setCartDetails({
        fulfillmentType: 1,
        fulfillmentDisplay: "pickup",
        deliveryFeeType: 0,
        deliveryFeeTypeDisplay: "free",
        deliveryFeePenny: 0,
        deliveryFeeDisplay: "$0.00",
      });
      return;
    }

    setCartDetails({
      fulfillmentType: 0,
      fulfillmentDisplay: "delivery",
      deliveryAddress: "",
    });

    handleChange("panel1");
    return;
  };

  const updateDeliveryFee = (distanceInMi, distanceInKm) => {
    const deliveryMethod = fulfillmentMethods.find(
      (method) => method.methodInt === 0
    );

    const {
      deliveryFeeType,
      deliveryFeePriceStr,
      deliveryFeePriceIntPenny,
      deliveryFeeByDistanceStr,
      deliveryFeeByDistanceIntPenny,
      deliveryFeeDistanceMetric,
      deliveryFeeByPercentStr,
      deliveryFeeByPercent,
    } = deliveryMethod;

    const deliveryFeeTypeInt =
      deliveryFeeType === "free"
        ? 0
        : deliveryFeeType === "flat"
        ? 1
        : deliveryFeeType === "percentage"
        ? 2
        : 3;

    let deliveryFeeByDistancePenny = deliveryFeeByDistanceIntPenny;
    let deliveryFeeByDistanceDisplay = deliveryFeeByDistanceStr;
    let deliveryFeeByPercentNum = deliveryFeeByPercent;
    let deliveryFeeByPercentDisplay = deliveryFeeByPercentStr;

    if (deliveryFeeTypeInt === 2) {
      const { subtotalPenny } = cartDetails;

      deliveryFeeByPercentNum = subtotalPenny * (deliveryFeeByPercent / 100);
      deliveryFeeByPercentDisplay = `$${(deliveryFeeByPercentNum / 100).toFixed(
        2
      )}`;
    }

    if (deliveryFeeTypeInt === 3) {
      deliveryFeeByDistancePenny =
        deliveryFeeDistanceMetric === "mi"
          ? deliveryFeeByDistanceIntPenny * distanceInMi
          : deliveryFeeByDistanceIntPenny * distanceInKm;

      deliveryFeeByDistanceDisplay = `$${(
        deliveryFeeByDistancePenny / 100
      ).toFixed(2)}`;
    }

    const deliveryFeePenny =
      deliveryFeeTypeInt === 0
        ? 0
        : deliveryFeeTypeInt === 1
        ? deliveryFeePriceIntPenny
        : deliveryFeeTypeInt === 2
        ? deliveryFeeByPercentNum
        : deliveryFeeByDistancePenny;

    const deliveryFeeDisplay =
      deliveryFeeTypeInt === 0
        ? "$0.00"
        : deliveryFeeTypeInt === 1
        ? deliveryFeePriceStr
        : deliveryFeeTypeInt === 2
        ? deliveryFeeByPercentDisplay
        : deliveryFeeByDistanceDisplay;

    setCartDetails({
      deliveryFeeType: deliveryFeeTypeInt,
      deliveryFeeTypeDisplay: deliveryFeeType,
      deliveryFeePenny,
      deliveryFeeDisplay,
    });
  };

  const handleChangeDeliveryClick = () => {
    push("/account/my-shop/fulfillment");
  };

  const handleChangeAvailabilityClick = () => {
    push("/account/my-shop/availability");
  };

  const getDistance = (lat1, lng1, lat2, lng2) => {
    const radiusOfEarnMiles = 3958.8;
    const degreeLat = degToRadius(lat2 - lat1);
    const degreeLng = degToRadius(lng2 - lng1);
    const a =
      Math.sin(degreeLat / 2) * Math.sin(degreeLat / 2) +
      Math.cos(degToRadius(lat1)) *
        Math.cos(degToRadius(lat2)) *
        Math.sin(degreeLng / 2) *
        Math.sin(degreeLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceInMi = radiusOfEarnMiles * c; // Distance in miles
    const distanceInKm = distanceInMi * 1.609344; // Distance in km

    const roundedNumInMi = round(distanceInMi);
    const roundedNumInKm = round(distanceInKm);

    if (roundedNumInMi > localDeliveryDistanceMi) {
      setIsDeliveryTooFar(true);
      return null;
    }

    const distanceInMiStr = roundedNumInMi.toString() + " mi";
    const distanceInKmStr = roundedNumInKm.toString() + " km";

    setCartDetails({
      delvieryDistanceMi: roundedNumInMi,
      deliveryDistanceMiDisplay: distanceInMiStr,
      deliveryDistanceKm: roundedNumInKm,
      deliveryDistanceKmDisplay: distanceInKmStr,
    });

    setDeliveryDistanceInMi(roundedNumInMi);
    setDeliveryDistanceInKm(roundedNumInKm);

    return { roundedNumInMi, roundedNumInKm };
  };

  const degToRadius = (deg) => {
    return (deg * Math.PI) / 180;
  };

  const round = (num) => {
    let m = Number((Math.abs(num) * 100).toPrecision(2));
    const result = (Math.round(m) / 100) * Math.sign(num);

    return result;
  };

  return (
    <div className="p-4 w-full flex flex-col md:flex-col-reverse ">
      {!isOwner ? (
        fulfillmentMethodInt === 2 ? (
          <Accordion
            onChange={handleSwitch}
            expanded={hydrated && fulfillmentType === 0}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
            sx={{
              border: "1px solid var(--black-design-extralight)",
              boxShadow: "none",
              width: "100%",
              borderRadius: "4px",
            }}
          >
            <AccordionSummary
              expandIcon={
                <ShopSwitch
                  checked={hydrated && fulfillmentType === 0}
                  onClick={handleSwitch}
                />
              }
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              {/* <div className=""> */}
              {hydrated && fulfillmentType === 0 ? (
                <div className="flex gap-1 items-center">
                  <TakeoutDiningOutlinedIcon
                    fontSize="small"
                    sx={{ color: "var(--gray-light-med)" }}
                  />
                  <p className="text-sm font-light text-[color:var(--gray-light-med)]">
                    pickup
                  </p>
                  <p className="text-sm text-[color:var(--black-design-extralight)]">
                    {" "}
                    /{" "}
                  </p>
                  <DeliveryDiningOutlinedIcon
                    fontSize="small"
                    sx={{ color: "var(--black-design-extralight)" }}
                  />
                  {fulfillmentMethods.map((method) => {
                    const {
                      id,
                      methodInt,
                      deliveryTypeInt,
                      localDeliveryDistanceStr,
                    } = method;

                    // methodInt 0: delivery, 1: pickup
                    if (methodInt === 0) {
                      // deliveryTypeInt 0: self-delivery, 1: third party (uber, ups, etc.)
                      if (methodInt === 0 && deliveryTypeInt === 1) {
                        return (
                          <div key={id} className="flex items-center">
                            <p className="text-sm text-[color:var(--black-design-extralight)]  ">
                              delivery :
                            </p>
                            <p className="text-xs font-light text-[color:var(--black-design-extralight)] ml-1 ">
                              {localDeliveryDistanceStr}
                            </p>
                          </div>
                        );
                      } else {
                        return (
                          <div key={id} className="flex items-center">
                            <p className="text-sm text-[color:var(--black-design-extralight)]  ">
                              delivery
                            </p>
                          </div>
                        );
                      }
                    }
                  })}
                </div>
              ) : (
                <span className="flex gap-1 items-center">
                  <TakeoutDiningOutlinedIcon
                    fontSize="small"
                    sx={{ color: "var(--black-design-extralight)" }}
                  />
                  <p className="text-sm text-[color:var(--black-design-extralight)]">
                    pickup
                  </p>
                  <p className="text-sm text-[color:var(--black-design-extralight)]">
                    /
                  </p>
                  <div className="flex gap-1 items-center">
                    <DeliveryDiningOutlinedIcon
                      fontSize="small"
                      sx={{ color: "var(--gray-light-med)" }}
                    />
                    {fulfillmentMethods.map((method) => {
                      const {
                        id,
                        methodInt,
                        deliveryTypeInt,
                        localDeliveryDistanceStr,
                      } = method;

                      // methodInt 0: delivery, 1: pickup
                      if (methodInt === 0) {
                        // deliveryTypeInt 0: self-delivery, 1: third party (uber, ups, etc.)
                        if (methodInt === 0 && deliveryTypeInt === 1) {
                          return (
                            <div key={id} className="flex items-center">
                              <p className="text-sm font-light text-[color:var(--gray-light-med)]  ">
                                delivery :
                              </p>
                              <p className="text-xs font-light text-[color:var(--gray-light-med)] ml-1 ">
                                {localDeliveryDistanceStr}
                              </p>
                            </div>
                          );
                        } else {
                          return (
                            <div key={id} className="flex items-center">
                              <p className="text-sm text-[color:var(--gray-light-med)]  ">
                                delivery
                              </p>
                            </div>
                          );
                        }
                      }
                    })}
                  </div>
                </span>
              )}
              {/* </div> */}
            </AccordionSummary>
            <AccordionDetails>
              {isLoaded ? (
                <React.Fragment>
                  <PlacesAutoComplete
                    setIsDeliveryTooFar={setIsDeliveryTooFar}
                    address={deliveryAddress}
                    placeholder="deliver to: address"
                    onAddressSelect={(address) => {
                      getGeocode({ address: address }).then((results) => {
                        const { lat, lng } = getLatLng(results[0]);

                        const distance = getDistance(lat, lng, bizLat, bizLng);

                        if (distance) {
                          const { roundedNumInMi, roundedNumInKm } = distance;
                          setCartDetails({ deliveryAddress: address });
                          updateDeliveryFee(roundedNumInMi, roundedNumInKm);
                        } else {
                          setCartDetails({ deliveryAddress: "" });
                        }

                        setLat(lat);
                        setLng(lng);
                      });
                    }}
                  />
                  {isDeliveryTooFar && (
                    <p className="font-light text-sm mt-2 ml-2 text-[color:var(--primary)]">
                      * Location too far.
                    </p>
                  )}
                </React.Fragment>
              ) : (
                <p className="font-light text-xs">Loading...</p>
              )}
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
          <div>
            <div className="flex justify-between items-center border-b bg-[color:var(--brown-bg)] p-4 rounded-t">
              <div className="flex gap-1 items-center">
                <DeliveryDiningOutlinedIcon
                  fontSize="small"
                  sx={{ color: "var(--brown-text)" }}
                />
                {fulfillmentMethods.map((method) => {
                  const {
                    id,
                    methodInt,
                    deliveryTypeInt,
                    localDeliveryDistanceStr,
                  } = method;

                  // methodInt 0: delivery, 1: pickup
                  // deliveryTypeInt 0: self-delivery, 1: third party (uber, ups, etc.)
                  if (methodInt === 0) {
                    if (methodInt === 0 && deliveryTypeInt === 1) {
                      return (
                        <div key={id} className="flex items-center">
                          <p className="text-sm text-[color:var(--brown-text)]  ">
                            delivery :
                          </p>
                          <p className="text-xs font-light text-[color:var(--brown-text)] ml-1 ">
                            within {localDeliveryDistanceStr}
                          </p>
                        </div>
                      );
                    } else {
                      return (
                        <div key={id} className="flex items-center">
                          <p className="text-sm text-[color:var(--brown-text)]  ">
                            delivery
                          </p>
                        </div>
                      );
                    }
                  }
                })}
              </div>
            </div>
            <div className="flex justify-between items-center bg-[color:var(--brown-bg)] p-4 rounded-b">
              {isLoaded ? (
                <PlacesAutoComplete
                  setIsDeliveryTooFar={setIsDeliveryTooFar}
                  placeholder="deliver to: address"
                  onAddressSelect={(address) => {
                    getGeocode({ address: address }).then((results) => {
                      const { lat, lng } = getLatLng(results[0]);

                      const distance = getDistance(lat, lng, bizLat, bizLng);

                      if (distance) {
                        const { roundedNumInMi, roundedNumInKm } = distance;
                        setCartDetails({ deliveryAddress: address });
                        updateDeliveryFee(roundedNumInMi, roundedNumInKm);
                      } else {
                        setCartDetails({ deliveryAddress: "" });
                      }

                      setLat(lat);
                      setLng(lng);
                    });
                  }}
                />
              ) : (
                <p className="font-light text-xs">Loading...</p>
              )}
            </div>
          </div>
        )
      ) : (
        <div className="flex justify-between items-center bg-[color:var(--brown-bg)] p-4 rounded">
          {fulfillmentMethodInt == 0 && (
            <div className="flex items-center gap-2">
              <p className="text-sm text-[color:var(--brown-text)]"></p>
              <div className="flex gap-1 items-center">
                <DeliveryDiningOutlinedIcon
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
              <p className="text-sm text-[color:var(--brown-text)]"></p>
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
          )}
          {fulfillmentMethodInt == 2 && (
            <div className="flex items-center gap-2">
              <p className="text-sm text-[color:var(--brown-text)]"></p>
              <div className="flex gap-1 items-center">
                <DeliveryDiningOutlinedIcon
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

      {availability.hasCustomAvailability && isOwner ? (
        <div className="px-4 py-2 mt-2 flex justify-between items-center border border-[color:var(--gray-light-med)] rounded md:mb-4 ">
          <span className="flex items-center gap-2">
            <p className="font-extralight text-sm ">Store hours:</p>
            <button
              onClick={handleOpenAvailabilityModalOwner}
              className="font-extralight text-xs underline"
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
        availability.hasCustomAvailability &&
        availability &&
        (datesAvailability.length !== 0 ||
          datesRangedAvailability.length !== 0 ||
          daysOfWeekAvailability.length !== 0) && (
          <div className="px-4 py-2 mt-2 flex justify-between items-center border border-[color:var(--black-design-extralight)] rounded md:mb-4 ">
            <span className="flex flex-col">
              <p className="font-extralight text-[color:var(--gray-light-med)] ">
                Get it by
              </p>
              <div className="flex gap-2">
                <p className="text-[color:var(--black-design-extralight)] text-sm font-light ">
                  {hydrated && orderForDateDisplay === ""
                    ? "Select a date"
                    : hydrated && orderForDateDisplay}
                </p>

                {isTimeBlockEnabled && (
                  <p className="text-[color:var(--black-design-extralight)] text-sm font-light ">
                    {hydrated && orderForTimeDisplay === ""
                      ? "& time"
                      : `@ ${hydrated && orderForTimeDisplay}`}
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
              <h3 className="pb-2  border-b">Availability:</h3>
              <div className="flex gap-2 items-center mt-4  text-[color:var(--black-design-extralight)]">
                <p className="font-medium">Date:</p>
                <p className="font-light">{selectedDate}</p>
              </div>
              <div className="flex gap-2 items-center text-[color:var(--black-design-extralight)]">
                <p className="font-medium">Store hours:</p>
                <p className="font-light">{selectedDateHourDisplay}</p>
              </div>
              {requireOrderInAdvance && (
                <div className="flex gap-4 items-center mt-2 text-[color:var(--black-design-extralight)]">
                  <p className="text-sm font-light">
                    👉 Must order {orderInAdvanceDisplay} ahead
                  </p>
                </div>
              )}
            </div>

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

            {isTimeBlockEnabled && timeBlockTimes.length !== 0 && (
              <div className="border-t pt-4 pb-16 flex flex-col gap-4 text-[color:var(--black-design-extralight)]">
                <div className="flex items-center gap-2">
                  <p className=" whitespace-nowrap">Available times:</p>
                  {isOwner && <p className="font-light text-xs">View only</p>}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {timeBlockTimes.map((time, i) => {
                    return isOwner ? (
                      <p
                        key={i}
                        className="whitespace-nowrap border rounded px-2 py-1 text-[color:var(--gray-light-med)] w-fit"
                      >
                        {time}
                      </p>
                    ) : (
                      <button
                        name={time}
                        onClick={handleSelectTime}
                        key={i}
                        className={`whitespace-nowrap border rounded px-2 py-1 text-[color:var(--gray-light-med)] w-fit hover:bg-[color:var(--gray)] hover:text-white focus:bg-[color:var(--black-design-extralight)] focus:text-white
                        ${
                          hydrated && orderForTimeDisplay == time
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
              <div className="flex gap-4 fixed bottom-0 w-full left-0 py-3 px-9 sm:p-4 bg-white border-t">
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
