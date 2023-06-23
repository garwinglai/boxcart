import React, { useState } from "react";
import EditCalendarRoundedIcon from "@mui/icons-material/EditCalendarRounded";
import AppLayout from "@/components/layouts/AppLayout";
import calendar_icon from "@/public/images/icons/calendar_icon.png";
import Image from "next/image";
import ButtonPrimary from "@/components/common/buttons/ButtonPrimary";
import AddIcon from "@mui/icons-material/Add";
import CreateScheduleDrawer from "@/components/app/my-shop/availability/CreateScheduleDrawer";
import Drawer from "@mui/material/Drawer";
import ScheduleCard from "@/components/app/my-shop/availability/ScheduleCard";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import { IOSSwitch } from "@/components/common/switches/IOSSwitch";
import { isAuth } from "@/helper/client/auth/isAuth";

function Availability() {
	const [drawerState, setDrawerState] = useState({
		right: false,
	});
	const [hasSchedule, setHasSchedule] = useState(true);
	const [showCustomHours, setShowCustomHours] = useState(false);

	const toggleDrawer = (anchor, open) => (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}

		setDrawerState({ ...drawerState, [anchor]: open });
	};

	const handleSetHoursSwitch = () => {
		setShowCustomHours((prev) => !prev);
	};

	function displayMain() {
		if (!hasSchedule)
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
				<div className=" h-80 flex-grow">
					<h4 className="mb-2 ml-4 text-[color:var(--third-dark)]">Calendar</h4>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DateCalendar
							disabled
							renderLoading={() => <DayCalendarSkeleton />}
						/>
					</LocalizationProvider>
				</div>
				<div className="flex-grow">
					<div className="px-4 border-b pb-6">
						<h4 className="mb-2 text-[color:var(--third-dark)]">Dates:</h4>
						<div className="px-4 flex flex-col gap-2">
							<ScheduleCard scheduleType="date" />
							<ScheduleCard scheduleType="date" />
							<ScheduleCard scheduleType="date" />
						</div>
					</div>
					<div className="px-4 border-b pt-4 pb-6">
						<h4 className="mb-2 text-[color:var(--third-dark)]">Date Range:</h4>
						<div className="px-4 flex flex-col gap-2">
							<ScheduleCard scheduleType="range" />
							<ScheduleCard scheduleType="range" />
							<ScheduleCard scheduleType="range" />
						</div>
					</div>
					<div className="px-4 border-b pt-4 pb-6">
						<h4 className="mb-2 text-[color:var(--third-dark)]">
							Day of Week:
						</h4>
						<div className="px-4 flex flex-col gap-2">
							<ScheduleCard scheduleType="day" />
							<ScheduleCard scheduleType="day" />
							<ScheduleCard scheduleType="day" />
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="pb-32">
			<div className="flex justify-between p-4 bg-white rounded m-4 ">
				<div className="flex flex-col">
					<h4>Set custom hours</h4>
					<p className="font-extralight text-xs">
						If disabled, customers will be able to order at anytime.
					</p>
				</div>
				<IOSSwitch checked={showCustomHours} onClick={handleSetHoursSwitch} />
			</div>
			{showCustomHours && (
				<React.Fragment>
					<div className=" flex justify-between items-center p-4 md:px-6 md:border-b md:mb-4">
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
							/>
						</Drawer>
					</div>
					{displayMain()}
				</React.Fragment>
			)}
		</div>
	);
}

export default Availability;

export async function getServerSideProps(context) {
	return isAuth(context, (userSession) => {
		return {
			props: {
				userSession,
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
