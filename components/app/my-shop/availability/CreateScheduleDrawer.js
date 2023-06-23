import React, { useState } from "react";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import calendar_icon from "@/public/images/icons/calendar_icon.png";
import Image from "next/image";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

function CreateScheduleDrawer({ drawerState, toggleDrawer }) {
	const [createScheduleOption, setCreateScheduleOption] =
		useState("specific-date");
	const [specificDate, setSpecificDate] = useState({
		date: "",
		startTime: "",
		endTime: "",
	});
	const [dateRange, setDateRange] = useState({
		startDate: "",
		endDate: "",
		startTime: "",
		endTime: "",
	});
	const [selectedTime, setSelectedTime] = useState("");

	const handleTimeChange = (event) => {
		setSelectedTime(event.target.value);
	};

	const handleChange = (event) => {
		setCreateScheduleOption(event.target.value);
	};

	const generateTimeOptions = () => {
		const options = [];
		for (let hours = 0; hours < 24; hours++) {
			for (let minutes = 0; minutes < 60; minutes += 15) {
				const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");
				const formattedMinutes = minutes.toString().padStart(2, "0");
				const amPm = hours < 12 ? "AM" : "PM";
				const timeValue = `${formattedHours}:${formattedMinutes} ${amPm}`;
				options.push(
					<option key={timeValue} value={timeValue}>
						{timeValue}
					</option>
				);
			}
		}
		return options;
	};

	function displayCreateScheduleOption(schedulingOption) {
		if (schedulingOption === "specific-date")
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
									name="specific-date"
									id="specific-date"
									className="border px-2 py-1 text-xs"
								/>
							</div>
						</div>
						<div className="flex flex-col gap-2">
							<h4 className="text-[color:var(--third-dark-med)] ">Hours:</h4>
							<div className="flex justify-between items-center mx-4">
								<p className="font-light text-sm">Start time:</p>
								<select
									id="dateStartTime"
									// value={selectedTime}
									// onChange={handleTimeChange}
									className="border px-2 py-1 text-xs"
								>
									{generateTimeOptions()}
								</select>
							</div>
							<div className="flex justify-between items-center mx-4">
								<p className="font-light text-sm">End time:</p>
								<select
									id="dateEndTime"
									// value={selectedTime}
									// onChange={handleTimeChange}
									className="border px-2 py-1 text-xs"
								>
									{generateTimeOptions()}
								</select>
							</div>
						</div>
					</div>
				</React.Fragment>
			);
		if (schedulingOption === "date-range")
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
									name="startDate"
									id="startDate"
									className="border px-2 py-1 text-xs"
								/>
							</div>
							<div className="flex justify-between items-center mx-4">
								<p className="font-light text-sm">End date:</p>
								<input
									type="date"
									name="endDate"
									id="endDate"
									className="border px-2 py-1 text-xs"
								/>
							</div>
						</div>
						<div className="flex flex-col gap-2 ">
							<h4 className="text-[color:var(--third-dark-med)] ">Hours:</h4>
							<div className="flex justify-between items-center mx-4">
								<p className="font-light text-sm">Start time:</p>
								<select
									id="rangeStartTime"
									// value={selectedTime}
									// onChange={handleTimeChange}
									className="border px-2 py-1 text-xs"
								>
									{generateTimeOptions()}
								</select>
							</div>
							<div className="flex justify-between items-center mx-4">
								<p className="font-light text-sm">End time:</p>
								<select
									id="rangeEndTime"
									// value={selectedTime}
									// onChange={handleTimeChange}
									className="border px-2 py-1 text-xs"
								>
									{generateTimeOptions()}
								</select>
							</div>
						</div>
					</div>
				</React.Fragment>
			);
		if (schedulingOption === "day-of-week")
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
									id="dayOfWeek"
									// value={selectedDay}
									// onChange={handleChange}
									className="border px-2 py-1 text-xs"
								>
									<option value="Monday">Monday</option>
									<option value="Tuesday">Tuesday</option>
									<option value="Wednesday">Wednesday</option>
									<option value="Thursday">Thursday</option>
									<option value="Friday">Friday</option>
									<option value="Saturday">Saturday</option>
									<option value="Sunday">Sunday</option>
								</select>
							</div>
						</div>
						<div className="flex flex-col gap-2  border-b pb-4">
							<h4 className="text-[color:var(--third-dark-med)] ">Hours:</h4>
							<div className="flex justify-between items-center mx-4">
								<p className="font-light text-sm">Start time:</p>
								<select
									id="dayOfWeekStartTime"
									// value={selectedTime}
									// onChange={handleTimeChange}
									className="border px-2 py-1 text-xs"
								>
									{generateTimeOptions()}
								</select>
							</div>
							<div className="flex justify-between items-center mx-4">
								<p className="font-light text-sm">End time:</p>
								<select
									id="dayOfWeekEndTime"
									// value={selectedTime}
									// onChange={handleTimeChange}
									className="border px-2 py-1 text-xs"
								>
									{generateTimeOptions()}
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
									// value={selectedOption}
									// onChange={handleChange}
									className="border px-2 py-1 text-xs"
								>
									<option value="noRepeat">Does not repeat</option>
									<option value="oncePerWeek">Once per week</option>
									<option value="repeatDaily">Repeat daily</option>
									<option value="weekdays">Weekdays (Mon - Fri)</option>
								</select>
							</div>
						</div>
					</div>
				</React.Fragment>
			);
	}

	return (
		<div className="w-screen md:w-[60vw] lg:w-[40vw] xl:w-[30vw]">
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
						defaultValue="female"
						name="radio-buttons-group"
						value={createScheduleOption}
						onChange={handleChange}
						fullWidth
						sx={{ width: "100%" }}
					>
						<FormControlLabel
							value="specific-date"
							control={<Radio color="warning" />}
							label="By date"
							labelPlacement="start"
							fullWidth
							sx={{
								display: "flex",
								justifyContent: "space-between",
								width: "100%",
								paddingRight: "20px",
							}}
						/>
						<FormControlLabel
							value="date-range"
							control={<Radio color="warning" />}
							label="By date range"
							labelPlacement="start"
							fullWidth
							sx={{
								display: "flex",
								justifyContent: "space-between",
								width: "100%",
								paddingRight: "20px",
							}}
						/>
						<FormControlLabel
							value="day-of-week"
							control={<Radio color="warning" />}
							label="By day of week"
							labelPlacement="start"
							fullWidth
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
			<div className="p-4">
				{displayCreateScheduleOption(createScheduleOption)}
			</div>
		</div>
	);
}

export default CreateScheduleDrawer;
