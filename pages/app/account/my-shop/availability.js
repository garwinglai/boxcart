import React, { useState, useEffect, useRef } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import calendar_icon from "@/public/images/icons/calendar_icon.png";
import Image from "next/image";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import AddIcon from "@mui/icons-material/Add";
import CreateScheduleDrawer from "@/components/app/my-shop/availability/CreateScheduleDrawer";
import Drawer from "@mui/material/Drawer";
import ScheduleCard from "@/components/app/my-shop/availability/ScheduleCard";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import { IOSSwitch } from "@/components/global/switches/IOSSwitch";
import { isAuth } from "@/helper/server/auth/isAuth";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  updateHasScheduleAccountClient,
  updateOrderInAdvanceToggleAccountClient,
  updateTimeBlockToggleAccountClient,
} from "@/helper/client/api/availability/availability-toggles-crud";
import SaveCancelButtons from "@/components/app/design/SaveCancelButtons";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import ButtonFourth from "@/components/global/buttons/ButtonFourth";
import ButtonThird from "@/components/global/buttons/ButtonThird";
import {
  updateScheduleEnabledDateClient,
  updateScheduleEnabledRangeClient,
  updateScheduleEnabledWeekClient,
} from "@/helper/client/api/availability/schedule-toggle.crud";
import { getAvailabilitiesClient } from "@/helper/client/api/availability/availability-crud";
import prisma from "@/lib/prisma";
import TimeBlockDrawer from "@/components/app/my-shop/availability/TimeBlockDrawer";
import dayjs from "dayjs";
import Badge from "@mui/material/Badge";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import HelpIcon from "@mui/icons-material/Help";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import TimeAdvanceDrawer from "@/components/app/my-shop/availability/TimeAdvanceDrawer";
import { useHasHydrated } from "@/utils/useHasHydrated";
import { useChecklistStore } from "@/lib/store";
import {
  updateAvailabilityChecklistClient,
  updateIsChecklistComplete,
} from "@/helper/client/api/checklist";
import availability_icon from "@/public/images/icons/account/availability_icon.png";

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

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 300,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

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

function Availability({ userAccount }) {
  const {
    availability,
    isTimeBlockEnabled,
    fulfillmentMethods,
    id: accountId,
  } = userAccount ? userAccount : {};

  const checklistStore = useChecklistStore((state) => state.checklist);
  const setChecklistStore = useChecklistStore((state) => state.setChecklist);

  const [selectedDateValues, setSelectedDateValues] = useState({
    selectedDate: new Date().toLocaleDateString(),
    selectedDateHourDisplay: "Closed",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedDays, setHighlightedDays] = useState([]);
  const [drawerState, setDrawerState] = useState({
    right: false,
  });
  const [drawerTimeBlockState, setDrawerTimeBlockState] = useState({
    right: false,
  });
  const [drawerTimeAdvanceState, setDrawerTimeAdvanceState] = useState({
    right: false,
  });
  const [hasCustomHours, setHasCustomHours] = useState(
    availability
      ? availability.hasCustomAvailability
        ? availability.hasCustomAvailability
        : false
      : false
  );
  const [timeBlockEnabled, setTimeBlockEnabled] = useState(
    availability
      ? availability.isTimeBlockEnabled
        ? availability.isTimeBlockEnabled
        : false
      : false
  );
  const [timeBlockCurrentValue, setTimeBlockCurrentValue] = useState(
    availability
      ? availability.timeBlock
        ? availability.timeBlock
        : "15 min"
      : "15 min"
  );
  const [orderInAdvanceDisplay, setOrderInAdvanceDisplay] = useState(
    availability
      ? availability.orderInAdvanceDisplay
        ? availability.orderInAdvanceDisplay
        : "24 hours"
      : "24 hours"
  );
  const [orderInAdvanceEnabled, setOrderInAdvanceEnabled] = useState(
    availability
      ? availability.requireOrderInAdvance
        ? availability.requireOrderInAdvance
        : false
      : false
  );
  const [orderTimeAdvance, setOrderTimeAdvance] = useState(
    availability
      ? availability.orderInAdvanceValue
        ? availability.orderInAdvanceValue
        : "24"
      : "24"
  );
  const [orderTimeAdvanceMetric, setOrderTimeAdvanceMetric] = useState(
    availability
      ? availability.orderInAdvanceMetric
        ? availability.orderInAdvanceMetric
        : "hour"
      : "hour"
  );

  // const [timeBlockTimes, setTimeBlockTimes] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState({
    snackbarOpen: false,
    snackbarMessage: "",
  });
  const [availabilityValues, setAvailabilityValues] = useState({
    datesAvailability: availability
      ? availability.datesAvailability
        ? availability.datesAvailability.sort((a, b) => {
            return parseInt(a.dateEpochStr) - parseInt(b.dateEpochStr);
          })
        : []
      : [],
    datesRangedAvailability: availability
      ? availability.datesRangedAvailability
        ? availability.datesRangedAvailability.sort((a, b) => {
            return (
              parseInt(a.startDateEpochStr) - parseInt(b.startDateEpochStr)
            );
          })
        : []
      : [],
    daysOfWeekAvailability: availability
      ? availability.daysOfWeekAvailability
        ? availability.daysOfWeekAvailability.sort((a, b) => {
            return a.dayInt - b.dayInt;
          })
        : []
      : [],
  });
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [aToggleIsChanged, setAToggleIsChanged] = useState(false);
  const [updateDatesSchedule, setUpdateDatesSchedule] = useState([]);
  const [updateRangedSchedule, setUpdateRangedSchedule] = useState([]);
  const [updateDayOfWeekSchedule, setUpdateDayOfWeekSchedule] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [calendarDate, setCalendarDate] = useState(dayjs());

  const { selectedDate, selectedDateHourDisplay } = selectedDateValues;
  const { snackbarOpen, snackbarMessage } = openSnackbar;
  const { datesAvailability, datesRangedAvailability, daysOfWeekAvailability } =
    availabilityValues;

  const requestAbortControllerMonth = useRef(null);
  const requestAbortControllerDay = useRef(null);
  const hydrated = useHasHydrated();

  useEffect(() => {
    fetchShopHours(
      calendarDate,
      datesAvailability,
      datesRangedAvailability,
      daysOfWeekAvailability
    );

    return () => requestAbortControllerDay.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    datesAvailability,
    datesRangedAvailability,
    daysOfWeekAvailability,
    calendarDate,
  ]);

  useEffect(() => {
    fetchHighlightedDays(
      currentMonth,
      datesAvailability,
      datesRangedAvailability,
      daysOfWeekAvailability
    );
    // TODO: ?? delete past schedules?

    return () => requestAbortControllerMonth.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    datesAvailability,
    datesRangedAvailability,
    daysOfWeekAvailability,
    currentMonth,
  ]);

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
      return;
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
      return;
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
      return;
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

  const handleMonthChange = (date) => {
    if (requestAbortControllerMonth.current) {
      // make sure that you are aborting useless requests
      // because it is possible to switch between months pretty quickly
      requestAbortControllerMonth.current.abort();
    }

    setIsLoading(true);
    setCurrentMonth(date);
    setHighlightedDays([]);
  };

  const handleDateClick = (date) => {
    setCalendarDate(date);
  };

  const getAvailabilities = async (availabilityId) => {
    const { success, value, error } = await getAvailabilitiesClient(
      availabilityId
    );

    if (success) {
      const {
        datesAvailability,
        datesRangedAvailability,
        daysOfWeekAvailability,
      } = value;

      const sortedDatesAvailability = datesAvailability.sort((a, b) => {
        return parseInt(a.dateEpochStr) - parseInt(b.dateEpochStr);
      });

      const sortedDatesRangedAvailability = datesRangedAvailability.sort(
        (a, b) => {
          return parseInt(a.startDateEpochStr) - parseInt(b.startDateEpochStr);
        }
      );

      const sortedDaysOfWeekAvailability = daysOfWeekAvailability.sort(
        (a, b) => {
          return a.dayInt - b.dayInt;
        }
      );

      setAvailabilityValues({
        datesAvailability: sortedDatesAvailability,
        datesRangedAvailability: sortedDatesRangedAvailability,
        daysOfWeekAvailability: sortedDaysOfWeekAvailability,
      });

      closeCancelModal();
    }
  };

  const toggleUpdated = () => {
    setAToggleIsChanged(true);
  };

  const updateDatesScheduleData = (isEnabled, scheduleId) => {
    const newArray = [...updateDatesSchedule, { isEnabled, scheduleId }];
    setUpdateDatesSchedule(newArray);
    setAvailabilityValues((prev) => ({
      ...prev,
      datesAvailability: prev.datesAvailability.map((date) => {
        if (date.id === scheduleId) {
          return {
            ...date,
            isEnabled,
          };
        }

        return date;
      }),
    }));
  };

  const updateRangedScheduleData = (isEnabled, scheduleId) => {
    const newArray = [...updateRangedSchedule, { isEnabled, scheduleId }];
    setUpdateRangedSchedule(newArray);

    setAvailabilityValues((prev) => ({
      ...prev,
      datesRangedAvailability: prev.datesRangedAvailability.map((date) => {
        if (date.id === scheduleId) {
          return {
            ...date,
            isEnabled,
          };
        }

        return date;
      }),
    }));
  };

  const updateDayOfWeekScheduleData = (isEnabled, scheduleId) => {
    const newArray = [...updateDayOfWeekSchedule, { isEnabled, scheduleId }];
    setUpdateDayOfWeekSchedule(newArray);

    setAvailabilityValues((prev) => ({
      ...prev,
      daysOfWeekAvailability: prev.daysOfWeekAvailability.map((date) => {
        if (date.id === scheduleId) {
          return {
            ...date,
            isEnabled,
          };
        }

        return date;
      }),
    }));
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

  const closeCancelModal = () => {
    setIsCancelModalOpen(false);
  };

  const handleCancel = (e) => {
    setIsCancelModalOpen(true);
  };

  const handleCancelAllUpdates = () => {
    resetOriginalAvailabilities();
    setAToggleIsChanged(false);
    setUpdateDatesSchedule([]);
    setUpdateRangedSchedule([]);
    setUpdateDayOfWeekSchedule([]);
    closeCancelModal();
  };

  const resetOriginalAvailabilities = async () => {
    const { id } = availability;
    getAvailabilities(id);
  };

  const handleSaveScheduleToggles = async () => {
    const datesToggleUpdatedLen = updateDatesSchedule.length;
    const rangedToggleUpdatedLen = updateRangedSchedule.length;
    const weekToggleUpdatedLen = updateDayOfWeekSchedule.length;
    setIsLoading(true);
    let errorDates;
    let errorRanged;
    let errorWeek;

    if (datesToggleUpdatedLen > 0) {
      const { success, error } = await updateScheduleEnabledDateClient(
        updateDatesSchedule
      );

      if (!success || error) {
        errorDates = "Error updating dates.";
      }
    }

    if (rangedToggleUpdatedLen > 0) {
      const { success, error } = await updateScheduleEnabledRangeClient(
        updateRangedSchedule
      );

      if (!success || error) {
        errorRanged = "Error updating date range.";
      }
    }

    if (weekToggleUpdatedLen > 0) {
      const { success, error } = await updateScheduleEnabledWeekClient(
        updateDayOfWeekSchedule
      );

      if (!success || error) {
        errorWeek = "Error updating day of week.";
      }
    }

    if (errorDates || errorRanged || errorWeek) {
      handleOpenSnackbar(
        `${errorDates ? errorDates : ""} ${errorRanged ? errorRanged : ""} ${
          errorWeek ? errorWeek : ""
        } Please refresh and try again.`
      );
      setIsLoading(false);
      return;
    }

    handleOpenSnackbar("Schedule updated.");
    setIsLoading(false);
    setAToggleIsChanged(false);
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawerState({ ...drawerState, [anchor]: open });
  };

  const toggleDrawerTimeBlock = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawerTimeBlockState({ ...drawerTimeBlockState, [anchor]: open });
  };

  const toggleDrawerTimeAdvance = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawerTimeAdvanceState({ ...drawerTimeAdvanceState, [anchor]: open });
  };

  const handleSetHoursSwitch = async () => {
    let isCustomHoursEnabled = true;
    const isPickupAvailable = fulfillmentMethods.find(
      (fulfillment) => fulfillment.method === "pickup"
    );

    if (isPickupAvailable && hasCustomHours) {
      handleOpenSnackbar("Cannot disable. Pickup is enabled in Fulfillment.");
      return;
    }

    if (hasCustomHours) {
      isCustomHoursEnabled = false;
      handleOpenSnackbar("Disabling...");
    } else {
      handleOpenSnackbar("Enabling...");
    }

    setHasCustomHours((prev) => !prev);

    const { success, value, error } = await updateHasScheduleAccountClient(
      isCustomHoursEnabled,
      accountId
    );

    if (!success || error) {
      handleOpenSnackbar("Error updating custom hours.");
      setHasCustomHours((prev) => !prev);
      return;
    }

    if (isCustomHoursEnabled) {
      updateChecklist(value, isCustomHoursEnabled);
      handleOpenSnackbar("Enabled");
      return;
    }

    handleOpenSnackbar("Disabled");
  };

  const updateChecklist = (availability, isCustomHoursEnabled) => {
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

    const {
      datesAvailability,
      datesRangedAvailability,
      daysOfWeekAvailability,
    } = availability;

    const datesAvailLength = datesAvailability.length;
    const datesRangedAvailLength = datesRangedAvailability.length;
    const daysOfWeekAvailLength = daysOfWeekAvailability.length;

    if (
      datesAvailLength === 0 &&
      datesRangedAvailLength === 0 &&
      daysOfWeekAvailLength === 0
    )
      return;

    setChecklistStore({ isAvailabilitySet: true });

    const { success, value, error } = updateAvailabilityChecklistClient(
      accountId,
      isCustomHoursEnabled
    );

    if (!success) {
      console.log("error updating checklist for product:", error);
      //TODO: handle error for not being able to update checklist.
    }

    if (
      isEmailVerified &&
      isDeliverySet &&
      isPaymentsSet &&
      isProductsUploaded
    ) {
      const checklistCompleted = true;
      updateIsChecklistComplete(accountId, checklistCompleted);
      setChecklistStore({ isChecklistComplete: checklistCompleted });
    }
  };

  const handleTimeBlockSwitch = async () => {
    let timeBlockToggle = true;

    if (timeBlockEnabled) {
      timeBlockToggle = false;
      handleOpenSnackbar("Disabling...");
    } else {
      handleOpenSnackbar("Enabling...");
    }

    setTimeBlockEnabled((prev) => !prev);

    const { success, value, error } = await updateTimeBlockToggleAccountClient(
      timeBlockToggle,
      accountId
    );

    if (!success || error) {
      handleOpenSnackbar("Error updating time block.");
      setTimeBlockEnabled((prev) => !prev);
    }

    if (timeBlockToggle) {
      handleOpenSnackbar("Enabled");
      return;
    }

    handleOpenSnackbar("Disabled");
  };

  const updateTimeBlockCurrValue = (value) => {
    setTimeBlockCurrentValue(value);
  };

  const updateOrderInAdvanceTimeDisplay = (
    orderInAdvanceDisplay,
    orderInAdvanceMetric,
    orderInAdvanceValue
  ) => {
    setOrderInAdvanceDisplay(orderInAdvanceDisplay);
    setOrderTimeAdvanceMetric(orderInAdvanceMetric);
    setOrderTimeAdvance(orderInAdvanceValue);
  };

  const handleOrderInAdvanceSwitch = async (e) => {
    let orderInAdvanceToggle = true;

    if (orderInAdvanceEnabled) {
      orderInAdvanceToggle = false;
      handleOpenSnackbar("Disabling...");
    } else {
      handleOpenSnackbar("Enabling...");
    }

    setOrderInAdvanceEnabled((prev) => !prev);

    const { success, value, error } =
      await updateOrderInAdvanceToggleAccountClient(
        orderInAdvanceToggle,
        accountId
      );

    if (!success || error) {
      handleOpenSnackbar("Error.");
      setOrderInAdvanceEnabled((prev) => !prev);
    }

    if (orderInAdvanceEnabled) {
      handleOpenSnackbar("Disabled");
      return;
    }
    handleOpenSnackbar("Enabled");
  };

  // TODO: after lunch : 1. timeblock, update savings to availability model 2. on register, create

  function displayMain() {
    // Length of each different way to schedule.
    const datesAvailabilityLength = datesAvailability.length;
    const datesRangedAvailabilityLength = datesRangedAvailability.length;
    const daysOfWeekAvailabilityLength = daysOfWeekAvailability.length;

    if (
      datesAvailabilityLength === 0 &&
      datesRangedAvailabilityLength === 0 &&
      daysOfWeekAvailabilityLength === 0
    )
      return (
        <div className="w-fit mx-auto mt-20">
          <Image
            src={calendar_icon}
            alt="calendar icon"
            className=" opacity-50 mx-auto w-20 h-20"
          />
          <p className=" mt-4 text-[color:var(--gray-text)]">
            No schedules added.
          </p>
        </div>
      );

    return (
      <div className="flex flex-col lg:flex-row md:px-8">
        <div className="border-b mb-4 h-fit lg:w-5/12 xl:w-1/3 lg:border-b-0">
          <div className="">
            <h3 className=" ml-8 font-normal text-normal mb-2">Calendar:</h3>
            <div className="flex gap-2 items-center ml-8 text-[color:var(--black)]">
              <h6 className="">Date:</h6>
              <h6 className="text-sm font-light">{selectedDate}</h6>
            </div>
            <div className="flex gap-2 items-end ml-8  text-[color:var(--black)]">
              <h6 className="">Store hours:</h6>
              <h6 className="text-sm font-light">{selectedDateHourDisplay}</h6>
            </div>
          </div>
          <div className="my-4">
            {/* <h3 className="mb-2 ml-4 underline">Calendar:</h3> */}
            {hydrated && (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                  loading={isLoading}
                  onMonthChange={handleMonthChange}
                  onChange={handleDateClick}
                  sx={{
                    ...{
                      "& .MuiPickersDay-root": {
                        width: 35,
                        height: 35,
                        fontSize: "rem",
                        // marginTop: "0.25rem",
                      },
                    },
                    width: "90%",
                    fontSize: "1rem",
                    backgroundColor: "var(--gray-light-soft)",
                    borderRadius: "8px",
                    padding: "8px 8px",
                    // marginBottom: "2rem",
                  }}
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
            )}
          </div>
        </div>
        <div className="lg:flex-grow lg:border-l pl-4">
          <div className="flex justify-between items-center mb-4 ">
            <h3 className="ml-4 text-normal font-normal">Schedules:</h3>
            <div className="flex items-center mr-4">
              <p className="font-light text-sm">Overlap: </p>
              <HtmlTooltip
                leaveTouchDelay={10000}
                enterTouchDelay={0}
                title={
                  <div className="px-4 py-2">
                    <h4 className="font-bold text-xs">Schedule priority:</h4>
                    <ul className="pl-4">
                      <li className="list-disc">Specific dates</li>
                      <li className="list-disc">Date ranges</li>
                      <li className="list-disc">Weekly schedules</li>
                    </ul>
                    <p className="my-4">
                      You may have overlapping store hours. In that case, store
                      hours will take priority based on the order above.
                    </p>
                    {/* <Link
                      href="/app/account/my-shop/availability"
                      className="underline mt-4"
                    >
                      Watch video
                    </Link> */}
                  </div>
                }
              >
                <IconButton>
                  <HelpIcon fontSize="small" />
                </IconButton>
              </HtmlTooltip>
            </div>
          </div>
          {datesAvailabilityLength > 0 && (
            <div className="pb-6">
              <h6 className="px-4 mb-2 text-[color:var(--third-dark)]">Date</h6>
              <div className="px-4 flex flex-col gap-2">
                {datesAvailability.map((date) => {
                  const {
                    id,
                    dateStr,
                    startTimeStr,
                    endTimeStr,
                    hoursDisplay,
                    isEnabled,
                    availabilityId,
                    repeatOption,
                  } = date;

                  return (
                    <ScheduleCard
                      availabilityValues={availabilityValues}
                      accountId={accountId}
                      availability={availability}
                      scheduleData={date}
                      availabilityId={availabilityId}
                      scheduleType="date"
                      key={id}
                      dateId={id}
                      hoursDisplay={hoursDisplay}
                      startDateStr={dateStr}
                      startTimeStr={startTimeStr}
                      repeatOption={repeatOption}
                      endTimeStr={endTimeStr}
                      isEnabled={isEnabled}
                      handleOpenSnackbar={handleOpenSnackbar}
                      toggleUpdated={toggleUpdated}
                      updateDatesScheduleData={updateDatesScheduleData}
                      updateRangedScheduleData={updateRangedScheduleData}
                      updateDayOfWeekScheduleData={updateDayOfWeekScheduleData}
                      getAvailabilities={getAvailabilities}
                    />
                  );
                })}
              </div>
            </div>
          )}
          {datesRangedAvailabilityLength > 0 && (
            <div className="px-4 pt-4 pb-6">
              <h6 className="mb-2 text-[color:var(--third-dark)]">
                Date Range
              </h6>
              <div className="flex flex-col gap-2">
                {datesRangedAvailability.map((date) => {
                  const {
                    id,
                    startDateStr,
                    endDateStr,
                    startTimeStr,
                    hoursDisplay,
                    endTimeStr,
                    isEnabled,
                    availabilityId,
                  } = date;

                  return (
                    <ScheduleCard
                      availabilityValues={availabilityValues}
                      accountId={accountId}
                      availability={availability}
                      scheduleData={date}
                      availabilityId={availabilityId}
                      scheduleType="range"
                      key={id}
                      dateId={id}
                      hoursDisplay={hoursDisplay}
                      startDateStr={startDateStr}
                      endDateStr={endDateStr}
                      startTimeStr={startTimeStr}
                      endTimeStr={endTimeStr}
                      isEnabled={isEnabled}
                      handleOpenSnackbar={handleOpenSnackbar}
                      toggleUpdated={toggleUpdated}
                      updateDatesScheduleData={updateDatesScheduleData}
                      updateRangedScheduleData={updateRangedScheduleData}
                      updateDayOfWeekScheduleData={updateDayOfWeekScheduleData}
                      getAvailabilities={getAvailabilities}
                    />
                  );
                })}
              </div>
            </div>
          )}
          {daysOfWeekAvailabilityLength > 0 && (
            <div className="px-4  pt-4 pb-6">
              <h6 className="mb-2 text-[color:var(--third-dark)]">
                Weekly Schedule
              </h6>
              <div className="flex flex-col gap-2">
                {daysOfWeekAvailability.map((date) => {
                  const {
                    id,
                    daysDisplay,
                    hoursDisplay,
                    startTimeStr,
                    endTimeStr,
                    isEnabled,
                    availabilityId,
                  } = date;

                  return (
                    <ScheduleCard
                      availabilityValues={availabilityValues}
                      accountId={accountId}
                      availability={availability}
                      scheduleData={date}
                      availabilityId={availabilityId}
                      scheduleType="week"
                      key={id}
                      dateId={id}
                      hoursDisplay={hoursDisplay}
                      daysDisplay={daysDisplay}
                      startTimeStr={startTimeStr}
                      endTimeStr={endTimeStr}
                      isEnabled={isEnabled}
                      handleOpenSnackbar={handleOpenSnackbar}
                      toggleUpdated={toggleUpdated}
                      updateDatesScheduleData={updateDatesScheduleData}
                      updateRangedScheduleData={updateRangedScheduleData}
                      updateDayOfWeekScheduleData={updateDayOfWeekScheduleData}
                      getAvailabilities={getAvailabilities}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

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
    <div className="pb-32">
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={action}
      />
      <div className="lg:flex">
        <div className="flex flex-col border shadow rounded items-center justify-between  p-4 bg-white  m-4 lg:w-1/2">
          <div className="flex gap-4 items-center justify-between w-full">
            <div className="flex flex-col">
              <h4>Order in advance:</h4>
              <p className="font-extralight text-xs">
                Customers must order ahead of time. Ex: 24 hours ahead.
              </p>
            </div>
            <IOSSwitch
              checked={orderInAdvanceEnabled}
              onClick={handleOrderInAdvanceSwitch}
            />
          </div>
          {orderInAdvanceEnabled && (
            <div className="ml-auto mt-4">
              <div>
                <ButtonFourth
                  handleClick={toggleDrawerTimeAdvance("right", true)}
                  name={orderInAdvanceDisplay}
                />
              </div>
              <Drawer
                anchor={"right"}
                open={drawerTimeAdvanceState["right"]}
                onClose={toggleDrawerTimeAdvance("right", false)}
              >
                <TimeAdvanceDrawer
                  toggleDrawer={toggleDrawerTimeAdvance("right", false)}
                  accountId={accountId}
                  orderTimeInAdvance={orderTimeAdvance}
                  orderTimeInAdvanceMetric={orderTimeAdvanceMetric}
                  handleOpenSnackbar={handleOpenSnackbar}
                  updateOrderInAdvanceTimeDisplay={
                    updateOrderInAdvanceTimeDisplay
                  }
                />
              </Drawer>
            </div>
          )}
        </div>

        <div className="flex flex-col border shadow rounded items-center justify-between p-4 bg-white  m-4 lg:w-1/2">
          <div className="flex items-center gap-4  justify-between w-full">
            <div className="flex flex-col">
              <h4>Time buffer</h4>
              <p className="font-extralight text-xs">
                Set a time buffer between each order. Ex: accept orders every 15
                minutes.
              </p>
            </div>
            <IOSSwitch
              checked={timeBlockEnabled}
              onClick={handleTimeBlockSwitch}
            />
          </div>

          {timeBlockEnabled && (
            <div className="ml-auto mt-4">
              <div>
                <ButtonFourth
                  handleClick={toggleDrawerTimeBlock("right", true)}
                  name={timeBlockCurrentValue}
                />
              </div>
              <Drawer
                anchor={"right"}
                open={drawerTimeBlockState["right"]}
                onClose={toggleDrawerTimeBlock("right", false)}
              >
                <TimeBlockDrawer
                  toggleDrawer={toggleDrawerTimeBlock("right", false)}
                  accountId={accountId}
                  timeBlock={timeBlockCurrentValue}
                  handleOpenSnackbar={handleOpenSnackbar}
                  updateTimeBlockCurrValue={updateTimeBlockCurrValue}
                />
              </Drawer>
            </div>
          )}
        </div>
        <div className="flex flex-col border shadow rounded items- justify-between p-4 bg-white  m-4 lg:w-1/2">
          <div className="flex items-center gap-4  justify-between w-full">
            <div className="flex flex-col">
              <h4>Set availability</h4>
              <p className="font-extralight text-xs">
                Availability will allow customers to select delivery date,
                pickup time, or book a service.
              </p>
            </div>
            <IOSSwitch
              checked={hasCustomHours}
              onClick={handleSetHoursSwitch}
            />
          </div>
          {hasCustomHours && (
            <div className="ml-auto mt-4">
              <div className="flex justify-betweenitems-center">
                <div>
                  <ButtonPrimary
                    handleClick={toggleDrawer("right", true)}
                    name="Schedule"
                    icon={<AddIcon sx={{ fontSize: "14px" }} />}
                  />
                </div>
              </div>
              <Drawer
                anchor={"right"}
                open={drawerState["right"]}
                onClose={toggleDrawer("right", false)}
              >
                <CreateScheduleDrawer
                  toggleDrawer={toggleDrawer("right", false)}
                  accountId={accountId}
                  handleOpenSnackbar={handleOpenSnackbar}
                  availability={availability}
                  getAvailabilities={getAvailabilities}
                />
              </Drawer>
            </div>
          )}
        </div>
      </div>

      {hasCustomHours && (
        <div className=" pt-4 border-t">
          {displayMain()}
          {aToggleIsChanged && (
            <div className="fixed bottom-[3.3rem] z-10 border-b w-full bg-white border-t p-4 md:w-[calc(100%-225px)] md:bottom-0 lg:left-0 lg:ml-[225px]">
              <div className="lg:w-2/5 lg:ml-auto">
                <SaveCancelButtons
                  handleCancel={handleCancel}
                  cancelButtonType="button"
                  isLoading={isLoading}
                  handleSave={handleSaveScheduleToggles}
                  saveButtonType="button"
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
        </div>
      )}
    </div>
  );
}

export default Availability;

export async function getServerSideProps(context) {
  return isAuth(context, async (userSession) => {
    const { user, expires } = userSession;
    const { name, email, id } = user;
    let serializedAccount = {};

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
      console.log("serversideprops  error:", error);
    }
    return {
      props: {
        userSession,
        userAccount: serializedAccount,
      },
    };
  });
}

Availability.getLayout = function getLayout(
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

Availability.pageTitle = "Availability";
Availability.pageIcon = (
  <div className="relative w-8 h-8">
    <Image
      src={availability_icon}
      alt="availability icon"
      fill
      className=""
      priority
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  </div>
);
Availability.pageRoute = "availability";
Availability.mobilePageRoute = "availability";
