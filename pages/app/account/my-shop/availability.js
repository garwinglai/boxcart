import React, { useState } from "react";
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
import { updateHasScheduleAccountClient } from "@/helper/client/api/availability/availability-toggles-crud";
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

function Availability({ userAccount }) {
  const {
    availability,
    hasCustomAvailability,
    id: accountId,
  } = userAccount || {};

  const [drawerState, setDrawerState] = useState({
    right: false,
  });
  const [hasCustomHours, setHasCustomHours] = useState(
    hasCustomAvailability ? true : false
  );
  const [openSnackbar, setOpenSnackbar] = useState({
    snackbarOpen: false,
    snackbarMessage: "",
  });
  const [availabilityValues, setAvailabilityValues] = useState({
    datesAvailability: availability
      ? availability.datesAvailability.sort((a, b) => {
          return parseInt(a.dateEpochStr) - parseInt(b.dateEpochStr);
        })
      : [],
    datesRangedAvailability: availability
      ? availability.datesRangedAvailability.sort((a, b) => {
          return parseInt(a.startDateEpochStr) - parseInt(b.startDateEpochStr);
        })
      : [],
    daysOfWeekAvailability: availability
      ? availability.daysOfWeekAvailability.sort((a, b) => {
          return a.dayInt - b.dayInt;
        })
      : [],
  });
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [aToggleIsChanged, setAToggleIsChanged] = useState(false);
  const [updateDatesSchedule, setUpdateDatesSchedule] = useState([]);
  const [updateRangedSchedule, setUpdateRangedSchedule] = useState([]);
  const [updateDayOfWeekSchedule, setUpdateDayOfWeekSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { snackbarOpen, snackbarMessage } = openSnackbar;
  const { datesAvailability, datesRangedAvailability, daysOfWeekAvailability } =
    availabilityValues;

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
      console.log("sortedDaysOfWeekAvailability", sortedDaysOfWeekAvailability);
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
      <div className="flex flex-col lg:flex-row-reverse md:px-8">
        <div className=" h-fit lg:w-1/2">
          <h4 className="mb-2 ml-4 text-[color:var(--third-dark)]">Calendar</h4>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              disabled
              renderLoading={() => <DayCalendarSkeleton />}
            />
          </LocalizationProvider>
        </div>
        <div className="lg:w-1/2">
          {datesAvailabilityLength > 0 && (
            <div className="px-4 border-b pb-6">
              <h4 className="mb-2 text-[color:var(--third-dark)]">Dates:</h4>
              <div className="px-4 flex flex-col gap-2">
                {datesAvailability.map((date) => {
                  const {
                    id,
                    dateStr,
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
                      scheduleType="date"
                      key={id}
                      dateId={id}
                      startDateStr={dateStr}
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
                Day of Week:
              </h4>
              <div className="px-4 flex flex-col gap-2">
                {daysOfWeekAvailability.map((date) => {
                  const {
                    id,
                    dayStr,
                    dayInt,
                    startTimeStr,
                    endTimeStr,
                    isEnabled,
                    repeatOption,
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
                      dayStr={dayStr}
                      startTimeStr={startTimeStr}
                      endTimeStr={endTimeStr}
                      isEnabled={isEnabled}
                      repeatOption={repeatOption}
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
      <div className="flex justify-between p-4 bg-white rounded m-4 ">
        <div className="flex flex-col">
          <h4>Set custom hours</h4>
          <p className="font-extralight text-xs">
            If disabled, customers will be able to order at anytime.
          </p>
        </div>
        <IOSSwitch checked={hasCustomHours} onClick={handleSetHoursSwitch} />
      </div>
      {hasCustomHours && (
        <React.Fragment>
          <div className=" flex justify-between items-center p-4 border-b mb-4 md:px-6">
            <h3>Scheduled Hours</h3>
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
