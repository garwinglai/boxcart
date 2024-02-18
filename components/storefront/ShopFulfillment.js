import React, { useState, useRef, useEffect } from "react";
import { ShopSwitch } from "../global/switches/ShopSwitch";
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
import MuiAccordion from "@mui/material/Accordion";
import ButtonPrimary from "../global/buttons/ButtonPrimary";

const styledDeliveryModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  "@media (min-width: 769px)": {
    width: "50%",
  },
  "@media (min-width: 1025px)": {
    width: "30%",
  },
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "8px",
};

const styledAvailModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  "@media (min-width: 769px)": {
    width: "50%",
  },
  "@media (min-width: 1025px)": {
    width: "30%",
  },
  // height: "75%",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "8px",
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
      badgeContent={isSelected ? "✅" : undefined}
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
      />
    </Badge>
  );
}

let stagedDeliveryDate = "";
let stagedDeliveryTime = "";

function ShopFulfillment({ isOwner, userAccount, handleOpenSnackbar }) {
  const {
    fulfillmentMethodInt,
    fulfillmentMethods,
    availability,
    lat: bizLat,
    lng: bizLng,
    id: accountId,
    subdomain,
  } = userAccount ? userAccount : {};

  const hydrated = useHasHydrated();
  const setCartDetails = useCartStore((state) => state.setCartDetails);
  const cartStore = useCartStore((state) => {
    return state.store.find((store) => store.storeName === subdomain);
  });

  const { cartDetails } = cartStore || {};

  const {
    fulfillmentDisplay,
    fulfillmentType,
    deliveryAddress,
    orderForDateDisplay,
    orderForTimeDisplay,
  } = cartDetails || {};

  const {
    timeBlock,
    isTimeBlockEnabled,
    orderInAdvanceInSeconds,
    requireOrderInAdvance,
    orderInAdvanceDisplay,
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

  const handleOpenAvailabilityModalOwner = () => {
    let date = dayjs();

    if (!orderForDateDisplay || orderForDateDisplay === "") {
      const dateStr = new Date(date).toLocaleDateString();
      const details = { orderForDateDisplay: dateStr };

      setCartDetails(subdomain, details);
    } else {
      date = dayjs(orderForDateDisplay);
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

  const handleCloseAvailabilityModalOwner = () => {
    setOpenAvailabilityModalOwner(false);
    handleCancelDeliveryChange();
  };

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

    setCartDetails(subdomain, {
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
    setCartDetails(subdomain, {
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
      if (
        orderForTimeDisplay === "" ||
        orderForTimeDisplay === "time" ||
        !orderForTimeDisplay
      ) {
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

    setCartDetails(subdomain, {
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
    setCartDetails(subdomain, { orderForTimeDisplay: name });
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleSwitch = () => {
    if (fulfillmentType === 0) {
      setCartDetails(subdomain, {
        fulfillmentType: 1,
        fulfillmentDisplay: "pickup",
        deliveryFeeType: 0,
        deliveryFeeTypeDisplay: "free",
        deliveryFeePenny: 0,
        deliveryFeeDisplay: "$0.00",
      });
      return;
    }

    setCartDetails(subdomain, {
      fulfillmentType: 0,
      fulfillmentDisplay: "delivery",
      deliveryAddress: "",
    });

    handleChange("panel1");
    return;
  };

  const handleChangeDeliveryClick = () => {
    push("/app/account/my-shop/fulfillment");
  };

  const handleChangeAvailabilityClick = () => {
    push("/app/account/my-shop/availability");
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

    const delivery = fulfillmentMethods.find(
      (method) => method.methodInt === 0
    );
    const { deliveryTypeInt } = delivery;

    if (deliveryTypeInt === 1 && roundedNumInMi > localDeliveryDistanceMi) {
      setIsDeliveryTooFar(true);
      return null;
    }

    const distanceInMiStr = roundedNumInMi.toString() + " mi";
    const distanceInKmStr = roundedNumInKm.toString() + " km";

    setCartDetails(subdomain, {
      deliveryDistanceMi: roundedNumInMi,
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

  const [openDeliveryAddressModal, setOpenDeliveryAddressModal] =
    useState(false);
  const [openDeliveryPickupModal, setOpenDeliveryPickupModal] = useState(false);

  const handleOpenDeliveryPickupModal = () => {
    setOpenDeliveryPickupModal(true);
  };

  const handleCloseDeliveryPickupModal = () => {
    setOpenDeliveryPickupModal(false);
  };

  const handleOpenDeliveryAddressModal = () => {
    setOpenDeliveryAddressModal(true);
  };

  const handleCloseDeliveryAddressModal = () => {
    setOpenDeliveryAddressModal(false);
  };

  const handleSetDeliveryAddress = (fulfillmentType) => (e) => {
    // Pickup
    if (fulfillmentType === 1) {
      setOpenDeliveryAddressModal(false);
      setOpenDeliveryPickupModal(false);
      return;
    }

    // Delivery
    if (!deliveryAddress) {
      handleOpenSnackbar("Please enter a delivery address.");
      return;
    }

    if (isDeliveryTooFar) {
      handleOpenSnackbar(
        "Sorry, we can't deliver to that address. Please try another."
      );
      return;
    }

    setOpenDeliveryAddressModal(false);
    setOpenDeliveryPickupModal(false);
  };

  return (
    <div className="px-4 pb-4 w-full flex flex-row-reverse gap-4 justify-start items-end">
      {!isOwner ? (
        fulfillmentMethodInt === 2 ? (
          <div className="flex-grow w-1/2 lg:flex-grow-0 lg:w-5/12">
            {hydrated && fulfillmentType === 0 && deliveryAddress && (
              <button
                onClick={handleOpenDeliveryAddressModal}
                className="text-center text-xs w-full font-light mb-2 underline"
              >
                {deliveryAddress}
              </button>
            )}
            <button
              onClick={handleOpenDeliveryPickupModal}
              type="button"
              className=" rounded w-full h-full py-2 text-sm font-normal text-white bg-[color:var(--gray-light)] bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--secondary)] lg:flex-grow-0"
            >
              {hydrated && fulfillmentType === 1
                ? "Set Pickup"
                : "Set Delivery"}
            </button>
            <Modal
              open={openDeliveryPickupModal}
              // onClose={handleCloseDeliveryPickupModal}
              aria-labelledby="delivery address modal"
              aria-describedby="enter delivery address modal"
            >
              <Box sx={styledDeliveryModal}>
                <div className=" p-4 rounded-lg overflow-y-scroll">
                  <h3 className="mb-2">Select fulfillment:</h3>
                  <Accordion
                    onChange={handleSwitch}
                    expanded={hydrated && fulfillmentType === 0}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                    sx={{
                      border: "1px solid var(--gray-light-med)",
                      boxShadow: "none",
                      width: "100%",
                      borderRadius: `8px`,
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
                      {hydrated && fulfillmentType === 0 ? (
                        <div className="flex gap-1 items-center">
                          <p className="text-sm font-light text-[color:var(--gray-light-med)]">
                            pickup
                          </p>
                          <p className="text-sm text-[color:var(--black-design-extralight)]">
                            {" "}
                            /{" "}
                          </p>

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
                          <p className="text-sm text-[color:var(--black-design-extralight)]">
                            pickup
                          </p>
                          <p className="text-sm text-[color:var(--black-design-extralight)]">
                            /
                          </p>
                          <div className="flex gap-1 items-center">
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
                    </AccordionSummary>
                    <AccordionDetails>
                      {isLoaded ? (
                        <React.Fragment>
                          <PlacesAutoComplete
                            setIsDeliveryTooFar={setIsDeliveryTooFar}
                            address={deliveryAddress}
                            placeholder="deliver to: address"
                            onAddressSelect={(address) => {
                              getGeocode({ address: address }).then(
                                (results) => {
                                  const { lat, lng } = getLatLng(results[0]);

                                  const distance = getDistance(
                                    lat,
                                    lng,
                                    bizLat,
                                    bizLng
                                  );

                                  if (distance) {
                                    const { roundedNumInMi, roundedNumInKm } =
                                      distance;
                                    setCartDetails(subdomain, {
                                      deliveryAddress: address,
                                    });
                                    // updateDeliveryFee(
                                    //   roundedNumInMi,
                                    //   roundedNumInKm
                                    // );
                                  } else {
                                    setCartDetails(subdomain, {
                                      deliveryAddress: "",
                                    });
                                  }

                                  setLat(lat);
                                  setLng(lng);
                                }
                              );
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

                  {(fulfillmentType === 1 ||
                    (fulfillmentType === 0 && cartDetails.deliveryAddress)) && (
                    <div className="">
                      <button
                        onClick={handleSetDeliveryAddress(fulfillmentType)}
                        className="text-white w-full mt-4 font-light text-sm h-8 px-4 bg-[color:var(--black-design-extralight)] active:bg-black rounded md:text-sm md:px-6"
                      >
                        Set fulfillment
                      </button>
                    </div>
                  )}
                </div>
              </Box>
            </Modal>
          </div>
        ) : fulfillmentMethodInt === 1 ? (
          <button
            disabled
            type="button"
            className=" rounded w-1/2 py-2 text-sm font-normal text-white bg-[color:var(--gray-light)] bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--secondary)] lg:w-5/12"
          >
            Pickup only
          </button>
        ) : (
          <div className="flex-grow w-1/2 lg:w-5/12 lg:flex-grow-0">
            {hydrated && deliveryAddress && (
              <button
                onClick={handleOpenDeliveryAddressModal}
                className="text-center text-xs w-full font-light mb-2 underline"
              >
                {deliveryAddress}
              </button>
            )}
            <button
              onClick={handleOpenDeliveryAddressModal}
              type="button"
              className=" rounded w-full py-2 text-sm font-normal text-white bg-[color:var(--gray-light)] bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--secondary)] lg:flex-grow-0"
            >
              Delivery info
            </button>

            <Modal
              open={openDeliveryAddressModal}
              aria-labelledby="delivery address modal"
              aria-describedby="enter delivery address modal"
            >
              <Box sx={styledDeliveryModal}>
                <div className="max-h-[36rem] overflow-y-scroll">
                  {isLoaded ? (
                    <div className="rounded-lg p-4">
                      <h3 className="mb-4">Enter delivery address:</h3>
                      <PlacesAutoComplete
                        setIsDeliveryTooFar={setIsDeliveryTooFar}
                        address={deliveryAddress}
                        placeholder="deliver to: address"
                        onAddressSelect={(address) => {
                          getGeocode({ address: address }).then((results) => {
                            const { lat, lng } = getLatLng(results[0]);

                            const distance = getDistance(
                              lat,
                              lng,
                              bizLat,
                              bizLng
                            );

                            if (distance) {
                              const { roundedNumInMi, roundedNumInKm } =
                                distance;
                              setCartDetails(subdomain, {
                                deliveryAddress: address,
                              });
                              // updateDeliveryFee(roundedNumInMi, roundedNumInKm);
                            } else {
                              setCartDetails(subdomain, {
                                deliveryAddress: "",
                              });
                            }

                            setLat(lat);
                            setLng(lng);
                          });
                        }}
                      />
                      {isDeliveryTooFar && (
                        <p className="font-light text-sm mt-2 ml-2 text-[color:var(--error)]">
                          * Location too far.
                        </p>
                      )}
                      {cartDetails.deliveryAddress && (
                        <button
                          onClick={handleSetDeliveryAddress(fulfillmentType)}
                          className="text-white w-full mt-4 font-light text-sm h-8 px-4 bg-[color:var(--black-design-extralight)] active:bg-black rounded md:text-sm md:px-6"
                        >
                          Set address
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="font-light text-xs">Loading...</p>
                  )}
                </div>
              </Box>
            </Modal>
          </div>
        )
      ) : (
        <div className="flex-grow h-full w-1/2 lg:flex-grow-0 lg:w-5/12">
          {fulfillmentMethodInt == 0 && (
            <button
              onClick={handleChangeDeliveryClick}
              type="button"
              className="rounded w-full h-full  py-2 text-sm font-normal text-white bg-[color:var(--gray-light)] bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--secondary)] lg:flex-grow-0"
            >
              Edit delivery
            </button>
          )}
          {fulfillmentMethodInt == 1 && (
            <button
              onClick={handleChangeDeliveryClick}
              type="button"
              className="rounded py-2 w-full h-full text-sm font-normal text-white bg-[color:var(--gray-light)] bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--secondary)] active:bg-[color:var(--primary)] active:from-[color:var(--secondary)] active:to-[color:var(--primary)]"
            >
              Edit pickup
            </button>
          )}
          {fulfillmentMethodInt == 2 && (
            <button
              onClick={handleChangeDeliveryClick}
              type="button"
              className="rounded py-2 w-full h-full text-sm font-normal text-white bg-[color:var(--gray-light)] bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--secondary)] active:bg-[color:var(--primary)] active:from-[color:var(--secondary)] active:to-[color:var(--primary)]"
            >
              Edit delivery
            </button>
          )}
        </div>
      )}

      {hasCustomAvailability && isOwner ? (
        <button
          type="button"
          onClick={handleOpenAvailabilityModalOwner}
          className="flex justify-center gap-1 items-center font-normal  py-2 w-1/2 rounded text-[color:var(--gray)] bg-[color:var(--gray-light)] focus:text-black active:bg-[color:var(--gray)] flex-wrap text-sm
            lg:w-5/12"
        >
          Availability
        </button>
      ) : (
        hasCustomAvailability &&
        availability &&
        (datesAvailability.length !== 0 ||
          datesRangedAvailability.length !== 0 ||
          daysOfWeekAvailability.length !== 0) && (
          <div className="w-1/2 lg:w-5/12">
            {hydrated &&
              orderForDateDisplay &&
              (isTimeBlockEnabled ? (
                <button
                  onClick={handleOpenAvailabilityModalOwner}
                  className="flex items-center justify-center w-full mb-2"
                >
                  <span className="text-xs font-light">
                    ({orderForDateDisplay}
                  </span>
                  {orderForTimeDisplay !== "" && (
                    <span className="text-xs font-light pl-1">
                      @ {orderForTimeDisplay})
                    </span>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleOpenAvailabilityModalOwner}
                  className="text-xs font-light text-center mb-2 w-full"
                >
                  ({hydrated && orderForDateDisplay})
                </button>
              ))}
            <button
              type="button"
              onClick={handleOpenAvailabilityModalOwner}
              className="flex w-full justify-center gap-1 text-sm items-center py-2 rounded text-[color:var(--gray)] bg-[color:var(--gray-light)] focus:text-black active:bg-[color:var(--gray)] flex-wrap"
            >
              Get it by
            </button>
          </div>
        )
      )}
      <Modal
        open={openAvailabilityModalOwner}
        onClose={handleCloseAvailabilityModalOwner}
        aria-labelledby="calendar-modal"
        aria-describedby="view of calendar to select date and time"
      >
        <Box sx={styledAvailModal}>
          <div className="max-h-[38rem] overflow-y-scroll">
            <div className="border-b p-4">
              <h3 className="pb-2 underline">Availability:</h3>
              <div className="flex gap-2 items-center text-[color:var(--black-design-extralight)]">
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
            <div className=" mb-16">
              {!isOwner ? (
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
                    sx={{
                      width: "300px",
                    }}
                  />
                </LocalizationProvider>
              ) : (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateCalendar
                    disablePast
                    defaultValue={calendarDate}
                    defaultCalendarMonth={calendarMonth}
                    loading={isLoading}
                    onMonthChange={handleMonthChange}
                    onChange={handleDateClick}
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
              )}

              {isTimeBlockEnabled && timeBlockTimes.length !== 0 && (
                <div className=" border-t py-4 px-6 pb-16 flex flex-col gap-4 text-[color:var(--black-design-extralight)]">
                  <div className="flex items-center gap-2">
                    <p className=" whitespace-nowrap">Available times:</p>
                    {isOwner && <p className="font-light text-xs">View only</p>}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {timeBlockTimes.map((time, i) => {
                      const today = new Date().toLocaleDateString();

                      if (today == selectedDate) {
                        const currentTime = new Date().getTime();

                        const scheduledTime = new Date(
                          `${selectedDate} ${time}`
                        ).getTime();

                        if (currentTime >= scheduledTime) return null;
                      }

                      return isOwner ? (
                        <p
                          key={i}
                          className="whitespace-nowrap border rounded w-full py-1 text-[color:var(--gray-light-med)] text-center"
                        >
                          {time}
                        </p>
                      ) : (
                        <button
                          name={time}
                          onClick={handleSelectTime}
                          key={i}
                          className={`whitespace-nowrap border rounded py-1 text-center text-[color:var(--gray-light-med)] w-full hover:bg-[color:var(--secondary)] hover:text-white focus:bg-[color:var(--black-design-extralight)] focus:text-white
                        ${
                          hydrated && orderForTimeDisplay == time
                            ? "bg-[color:var(--secondary)] text-white"
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
            </div>
            {!isOwner ? (
              <div className="flex gap-4 rounded-b-lg fixed bottom-0 w-full left-0 py-3 px-9 sm:p-4 bg-white border-t z-10">
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
            ) : (
              <div className="fixed bottom-0 rounded-b-lg left-0 w-full py-3 px-9 sm:p-4 bg-white border-t z-10">
                <ButtonPrimary
                  name="Edit availability"
                  handleClick={handleChangeAvailabilityClick}
                />
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
  padding: theme.spacing(1.5),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const AccordionSummary = styled((props) => <MuiAccordionSummary {...props} />)(
  ({ theme }) => ({
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
      transform: "rotate(0deg)",
    },
  })
);

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  // border: `1px solid ${theme.palette.divider}`,
  // "&:not(:last-child)": {
  //   borderBottom: 0,
  // },
  // "&:before": {
  //   display: "none",
  // },
}));
