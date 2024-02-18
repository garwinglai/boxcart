import { IOSSwitch } from "@/components/global/switches/IOSSwitch";
import React, { useState } from "react";
import { IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled, alpha } from "@mui/material/styles";
import {
  deleteDatesAvailabilityClient,
  deleteDatesRangedAvailabilityClient,
  deleteDaysOfWeekAvailabilityClient,
} from "@/helper/client/api/availability/availability-crud";
import EditScheduleDrawer from "./EditScheduleDrawer";
import Drawer from "@mui/material/Drawer";
import { useChecklistStore } from "@/lib/store";
import { updateAvailabilityChecklistClient } from "@/helper/client/api/checklist";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 66,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

function ScheduleCard({
  accountId,
  availabilityValues,
  availability,
  scheduleData,
  availabilityId,
  scheduleType,
  dateId,
  daysDisplay,
  startDateStr,
  hoursDisplay,
  endDateStr,
  startTimeStr,
  endTimeStr,
  isEnabled,
  repeatOption,
  handleOpenSnackbar,
  toggleUpdated,
  updateDatesScheduleData,
  updateRangedScheduleData,
  updateDayOfWeekScheduleData,
  getAvailabilities,
}) {
  const checklistStore = useChecklistStore((state) => state.checklist);
  const setChecklistStore = useChecklistStore((state) => state.setChecklist);

  const { datesAvailability, datesRangedAvailability, daysOfWeekAvailability } =
    availabilityValues || {};

  const [drawerState, setDrawerState] = useState({
    right: false,
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const toggleDrawerEditSchedule = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawerState({ ...drawerState, [anchor]: open });
    handleClose();
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDelete = async () => {
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

    const datesLength = datesAvailability?.length;
    const rangedLength = datesRangedAvailability?.length;
    const daysOfWeekLength = daysOfWeekAvailability?.length;

    if (scheduleType === "date") {
      if (
        requireAvailability &&
        datesLength === 1 &&
        rangedLength === 0 &&
        daysOfWeekLength === 0
      ) {
        handleOpenSnackbar(
          "Must have at least one schedule. Pickup order is enabled."
        );
        return;
      }

      // use date id & scheduleType
      const res = await deleteDatesAvailabilityClient(dateId);
      const { success, value } = res;

      if (!success) {
        handleOpenSnackbar("Error deleting schedule. Please refresh.");
      }

      if (datesLength === 1 && rangedLength === 0 && daysOfWeekLength === 0) {
        const isAvailSet = false;
        setChecklistStore({ isAvailabilitySet: isAvailSet });
        await updateAvailabilityChecklistClient(accountId, isAvailSet);
      }
    }

    if (scheduleType === "range") {
      if (
        requireAvailability &&
        datesLength === 0 &&
        rangedLength === 1 &&
        daysOfWeekLength === 0
      ) {
        handleOpenSnackbar(
          "Must have at least one schedule. Pickup order is enabled."
        );
        return;
      }

      const res = await deleteDatesRangedAvailabilityClient(dateId);
      const { success, value } = res;

      if (!success) {
        handleOpenSnackbar("Error deleting schedule. Please refresh.");
      }

      if (datesLength === 0 && rangedLength === 1 && daysOfWeekLength === 0) {
        const isAvailSet = false;
        setChecklistStore({ isAvailabilitySet: isAvailSet });
        await updateAvailabilityChecklistClient(accountId, isAvailSet);
      }
    }

    if (scheduleType === "week") {
      if (
        requireAvailability &&
        datesLength === 0 &&
        rangedLength === 0 &&
        daysOfWeekLength === 1
      ) {
        handleOpenSnackbar(
          "Must have at least one schedule. Pickup order is enabled."
        );
        return;
      }
      const res = await deleteDaysOfWeekAvailabilityClient(dateId);
      const { success, value } = res;

      if (!success) {
        handleOpenSnackbar("Error deleting schedule. Please refresh.");
      }

      if (datesLength === 0 && rangedLength === 0 && daysOfWeekLength === 1) {
        const isAvailSet = false;
        setChecklistStore({ isAvailabilitySet: isAvailSet });
        await updateAvailabilityChecklistClient(accountId, isAvailSet);
      }
    }

    handleOpenSnackbar("Schedule deleted.");
    getAvailabilities(availabilityId);
    handleClose();
  };

  const handleToggleEnableSchedule = async () => {
    let toggleEnabled = true;

    if (isEnabled) {
      toggleEnabled = false;
    }
    toggleUpdated();

    if (scheduleType === "date") {
      updateDatesScheduleData(toggleEnabled, dateId);
    }

    if (scheduleType === "range") {
      updateRangedScheduleData(toggleEnabled, dateId);
    }

    if (scheduleType === "week") {
      updateDayOfWeekScheduleData(toggleEnabled, dateId);
    }
  };

  return (
    <div
      className={`grid items-center justify-center bg-white shadow rounded p-4 py-1 grid-cols-[.50fr_2.5fr_1.5fr_0.5fr]`}
    >
      <IOSSwitch checked={isEnabled} onClick={handleToggleEnableSchedule} />
      <div className={`text-center`}>
        <span>
          {scheduleType === "date" && <p className="text-xs">{startDateStr}</p>}
          {scheduleType === "range" && (
            <p className="text-xs">
              {startDateStr} - {endDateStr}
            </p>
          )}
          {scheduleType === "week" && (
            <p className="text-xs font-extralight text-center px-4">
              {daysDisplay}
            </p>
          )}
        </span>
      </div>
      <span>
        <p className="text-xs text-center">{hoursDisplay}</p>
      </span>

      <StyledMenu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem
          onClick={toggleDrawerEditSchedule("right", true)}
          sx={{ fontSize: "12px" }}
        >
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ fontSize: "12px" }}>
          Delete
        </MenuItem>
      </StyledMenu>
      <Drawer
        anchor={"right"}
        open={drawerState["right"]}
        onClose={toggleDrawerEditSchedule("right", false)}
      >
        <EditScheduleDrawer
          toggleDrawer={toggleDrawerEditSchedule("right", false)}
          accountId={accountId}
          scheduleData={scheduleData}
          handleOpenSnackbar={handleOpenSnackbar}
          availability={availability}
          getAvailabilities={getAvailabilities}
          scheduleTypeEdit={scheduleType}
        />
      </Drawer>

      <div className="mx-auto">
        <IconButton onClick={handleOpenMenu}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </div>
    </div>
  );
}

export default ScheduleCard;
