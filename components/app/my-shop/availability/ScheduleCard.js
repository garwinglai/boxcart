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
    // use date id & scheduleType
    if (scheduleType === "date") {
      const res = await deleteDatesAvailabilityClient(dateId);
      const { success, value } = res;

      if (success) {
        handleOpenSnackbar("Schedule deleted.");
      }

      if (!success) {
        handleOpenSnackbar("Error deleting schedule. Please refresh.");
      }
    }

    if (scheduleType === "range") {
      const res = await deleteDatesRangedAvailabilityClient(dateId);
      const { success, value } = res;

      if (success) {
        handleOpenSnackbar("Schedule deleted.");
      }

      if (!success) {
        handleOpenSnackbar("Error deleting schedule. Please refresh.");
      }
    }

    if (scheduleType === "week") {
      const res = await deleteDaysOfWeekAvailabilityClient(dateId);
      const { success, value } = res;

      if (success) {
        handleOpenSnackbar("Schedule deleted.");
      }

      if (!success) {
        handleOpenSnackbar("Error deleting schedule. Please refresh.");
      }
    }

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
      className={`grid items-center justify-center bg-white rounded px-4 py-1 grid-cols-[.75fr_2.5fr_2.5fr_0.5fr]`}
    >
      <IOSSwitch checked={isEnabled} onClick={handleToggleEnableSchedule} />
      <div className={`flex flex-col justify-center items-center`}>
        <span>
          {scheduleType === "date" && <p className="text-xs">{startDateStr}</p>}
          {scheduleType === "range" && (
            <p className="text-xs">
              {startDateStr} - {endDateStr}
            </p>
          )}
          {scheduleType === "week" &&
            daysDisplay.split(", ").map((day) => (
              <p key={day} className="text-xs font-extralight text-center">
                {day}
              </p>
            ))}
        </span>
      </div>
      <span>
        <p className="text-xs">{hoursDisplay}</p>
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

      <IconButton onClick={handleOpenMenu}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
    </div>
  );
}

export default ScheduleCard;
