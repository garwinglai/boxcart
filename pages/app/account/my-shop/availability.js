import React, { useState, useEffect, useRef } from "react";
import EditCalendarRoundedIcon from "@mui/icons-material/EditCalendarRounded";
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
import { isAuth } from "@/helper/client/auth/isAuth";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  updateHasScheduleAccountClient,
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
import ButtonSecondary from "@/components/global/buttons/ButtonSecondary";
import TimeBlockDrawer from "@/components/app/my-shop/availability/TimeBlockDrawer";
import dayjs from "dayjs";
import Badge from "@mui/material/Badge";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";

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

const initialValue = dayjs();

function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

/**
 * Mimic fetch with abort controller https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort
 * ⚠️ No IE11 support
 */
// function fakeFetch(date, { signal }) {
//   return new Promise((resolve, reject) => {
//     const timeout = setTimeout(() => {
//       const daysInMonth = date.daysInMonth();
//       const daysToHighlight = [1, 2, 3].map(() =>
//         getRandomNumber(1, daysInMonth)
//       );

//       resolve({ daysToHighlight });
//     }, 500);

//     signal.onabort = () => {
//       clearTimeout(timeout);
//       reject(new DOMException("aborted", "AbortError"));
//     };
//   });
// }

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

function Availability({ userAccount }) {
  const {
    availability,
    hasCustomAvailability,
    isTimeBlockEnabled,
    timeBlock,
    id: accountId,
  } = userAccount || {};

  console.log("availability", availability);

  const requestAbortController = useRef(null);
  const [selectedDateValues, setSelectedDateValues] = useState({
    selectedDate: new Date().toLocaleDateString(),
    selectedDateHourDisplay: "9:00 AM - 5:00 PM",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedDays, setHighlightedDays] = useState([]);
  const [drawerState, setDrawerState] = useState({
    right: false,
  });
  const [drawerTimeBlockState, setDrawerTimeBlockState] = useState({
    right: false,
  });
  const [hasCustomHours, setHasCustomHours] = useState(
    hasCustomAvailability ? true : false
  );
  const [timeBlockEnabled, setTimeBlockEnabled] = useState(
    isTimeBlockEnabled ? true : false
  );
  const [timeBlockCurrentValue, setTimeBlockCurrentValue] = useState(
    timeBlock ? timeBlock : "15 min"
  );
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

  const { selectedDate, selectedDateHourDisplay } = selectedDateValues;
  const { snackbarOpen, snackbarMessage } = openSnackbar;
  const { datesAvailability, datesRangedAvailability, daysOfWeekAvailability } =
    availabilityValues;

  useEffect(() => {
    if (!availability) return;
    fetchHighlightedDays(initialValue);
    // TODO: ?? delete past schedules?

    return () => requestAbortController.current?.abort();
  }, []);

  const fetchHighlightedDays = (date) => {
    const controller = new AbortController();
    const allDaysWithSchedule = [];
    const daysOfSpecificDatesScheduled = getDaysFromDatesAvailability(date);
    const daysOfSpecificDatesRangedScheduled =
      getDaysFromDatesRangedAvailability(date);
    const daysOfWeekScheduled = getDaysFromDaysOfWeekAvailability(date);

    allDaysWithSchedule.push(...daysOfSpecificDatesScheduled);
    allDaysWithSchedule.push(...daysOfSpecificDatesRangedScheduled);
    allDaysWithSchedule.push(...daysOfWeekScheduled);
    // console.log("allDaysWithSchedule", allDaysWithSchedule);

    // make sure there are no duplicates in the array of all days with schedule
    const uniqueDaysWithSchedule = [...new Set(allDaysWithSchedule)];

    setHighlightedDays(allDaysWithSchedule);
    setIsLoading(false);

    requestAbortController.current = controller;
  };

  const getDaysFromDatesAvailability = (date) => {
    // For month: 0 = January, 11 = December.
    const { $y: year, $M: month, $D: day, $d: fullDate } = date;
    const actualMonthByNumber = month + 1;

    const days = [];
    const { datesAvailability } = availability;

    if (!datesAvailability) return;
    if (datesAvailability.length === 0) return;

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

  const getDaysFromDatesRangedAvailability = (date) => {
    const days = [];
    const { datesRangedAvailability } = availability;

    if (!datesRangedAvailability) return;
    if (datesRangedAvailability.length === 0) return;

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

  const getDaysFromDaysOfWeekAvailability = (date) => {
    const daysArr = [];
    const { $y: year, $M: month, $D: day, $d: fullDate } = date;
    const actualMonthByNumber = month + 1;
    const { daysOfWeekAvailability } = availability;

    if (!daysOfWeekAvailability) return;
    if (daysOfWeekAvailability.length === 0) return;

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
    console.log("targetWeekday", targetWeekday);
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

  const handleMonthChange = (date) => {
    if (requestAbortController.current) {
      // make sure that you are aborting useless requests
      // because it is possible to switch between months pretty quickly
      requestAbortController.current.abort();
    }

    setIsLoading(true);
    setHighlightedDays([]);
    fetchHighlightedDays(date);
  };

  const handleDateClick = (date) => {
    const { $y: year, $M: month, $D: day, $d: fullDate } = date;
    const actualMonthByNumber = month + 1;

    // TODO: show current date : hours
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

  const handleSetHoursSwitch = async () => {
    let isCustomHoursEnabled = true;

    if (hasCustomHours) isCustomHoursEnabled = false;

    setHasCustomHours((prev) => !prev);

    const { success, value, error } = await updateHasScheduleAccountClient(
      isCustomHoursEnabled,
      accountId
    );

    if (!success || error) {
      handleOpenSnackbar("Error updating custom hours.");
    }
  };

  const handleTimeBlockSwitch = async () => {
    let timeBlockToggle = true;

    if (isTimeBlockEnabled) timeBlockToggle = false;

    setTimeBlockEnabled((prev) => !prev);

    const { success, value, error } = await updateTimeBlockToggleAccountClient(
      timeBlockToggle,
      accountId
    );

    if (!success || error) {
      handleOpenSnackbar("Error updating time block.");
    }
  };

  const updateTimeBlockCurrValue = (value) => {
    setTimeBlockCurrentValue(value);
  };

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
        <div className="border-b mb-4 h-fit lg:w-1/2 lg:border-b-0">
          <div className="mb-6">
            <h3 className="mb-2 ml-4 underline">Selected date:</h3>
            <div className="flex gap-4 items-center px-8 mt-5  text-[color:var(--third-dark)]">
              <p>Date:</p>
              <p>{selectedDate}</p>
            </div>
            <div className="flex gap-4 items-center px-8  text-[color:var(--third-dark)]">
              <p>Store hours:</p>
              <p>{selectedDateHourDisplay}</p>
            </div>
          </div>
          <div>
            <h3 className="mb-2 ml-4 underline">Monthly:</h3>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                // defaultValue={initialValue}
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
        </div>
        <div className="lg:w-1/2">
          <h3 className="mb-4 ml-4 underline">All schedules:</h3>
          {datesAvailabilityLength > 0 && (
            <div className="px-4 border-b pb-6">
              <h4 className="mb-2 text-[color:var(--third-dark)]">
                Specific dates:
              </h4>
              <div className="px-4 flex flex-col gap-2">
                {datesAvailability.map((date) => {
                  const {
                    id,
                    dateStr,
                    startTimeStr,
                    endTimeStr,
                    isEnabled,
                    availabilityId,
                    repeatOption,
                  } = date;

                  return (
                    <ScheduleCard
                      accountId={accountId}
                      availability={availability}
                      scheduleData={date}
                      availabilityId={availabilityId}
                      scheduleType="date"
                      key={id}
                      dateId={id}
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
            <div className="px-4 border-b pt-4 pb-6">
              <h4 className="mb-2 text-[color:var(--third-dark)]">
                Date Range:
              </h4>
              <div className="px-4 flex flex-col gap-2">
                {datesRangedAvailability.map((date) => {
                  const {
                    id,
                    startDateStr,
                    endDateStr,
                    startTimeStr,
                    endTimeStr,
                    isEnabled,
                    availabilityId,
                  } = date;

                  return (
                    <ScheduleCard
                      accountId={accountId}
                      availability={availability}
                      scheduleData={date}
                      availabilityId={availabilityId}
                      scheduleType="range"
                      key={id}
                      dateId={id}
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
            <div className="px-4 border-b pt-4 pb-6">
              <h4 className="mb-2 text-[color:var(--third-dark)]">
                Weekly Schedule:
              </h4>
              <div className="px-4 flex flex-col gap-2">
                {daysOfWeekAvailability.map((date) => {
                  const {
                    id,
                    daysDisplay,
                    startTimeStr,
                    endTimeStr,
                    isEnabled,
                    availabilityId,
                  } = date;

                  return (
                    <ScheduleCard
                      accountId={accountId}
                      availability={availability}
                      scheduleData={date}
                      availabilityId={availabilityId}
                      scheduleType="week"
                      key={id}
                      dateId={id}
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
        <div className="flex justify-between items-center p-4 bg-white rounded m-4 lg:w-1/2">
          <div className="flex flex-col">
            <h4>Set custom hours</h4>
            <p className="font-extralight text-xs">
              If disabled, customers can order at anytime.
            </p>
          </div>
          <IOSSwitch checked={hasCustomHours} onClick={handleSetHoursSwitch} />
        </div>
        <div className="flex justify-between items-center p-4 bg-white rounded m-4 lg:w-1/2">
          <div className="flex flex-col">
            <h4>Time block</h4>
            <p className="font-extralight text-xs">
              Allow orders to block out time. Best for bakers, restaurants, etc.
            </p>
          </div>
          <IOSSwitch
            checked={timeBlockEnabled}
            onClick={handleTimeBlockSwitch}
          />
        </div>
      </div>
      {timeBlockEnabled && (
        <div className="p-4 flex justify-between items-center md:gap-8 md:w-fit md:ml-auto md:pr-6">
          <div className="flex items-center gap-2">
            <h3>Time Block:</h3>
          </div>
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
      {hasCustomHours && (
        <React.Fragment>
          <div className=" flex justify-between items-center p-4 border-b mb-4 md:px-6">
            <h3></h3>
            <div>
              <ButtonPrimary
                handleClick={toggleDrawer("right", true)}
                name="Create"
                icon={<AddIcon sx={{ fontSize: "14px" }} />}
              />
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
        </React.Fragment>
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
Availability.pageIcon = <EditCalendarRoundedIcon />;
Availability.pageRoute = "availability";
Availability.mobilePageRoute = "availability";
