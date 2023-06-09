import React, { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import Badge from "@mui/material/Badge";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import PropTypes from "prop-types";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import styles from "@/styles/components/calendar.module.css";

function Calendar() {
	const requestAbortController = useRef(null);
	const [isLoading, setIsLoading] = useState(false);
	const [highlightedDays, setHighlightedDays] = useState([1, 2, 15]);

	const fetchHighlightedDays = (date) => {
		const controller = new AbortController();
		fakeFetch(date, {
			signal: controller.signal,
		})
			.then(({ daysToHighlight }) => {
				setHighlightedDays(daysToHighlight);
				setIsLoading(false);
			})
			.catch((error) => {
				// ignore the error if it's caused by `controller.abort`
				if (error.name !== "AbortError") {
					throw error;
				}
			});

		requestAbortController.current = controller;
	};

	useEffect(() => {
		fetchHighlightedDays(initialValue);
		// abort request on unmount
		return () => requestAbortController.current?.abort();
	}, []);

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
	return (
		<div className={`${styles.calendar_box}`}>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<DateCalendar
					// sx={{ padding: "unset" }}
					defaultValue={initialValue}
					loading={isLoading}
					onMonthChange={handleMonthChange}
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
	);
}

export default Calendar;

function getRandomNumber(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}

/**
 * Mimic fetch with abort controller https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort
 * ⚠️ No IE11 support
 */
function fakeFetch(date, { signal }) {
	return new Promise((resolve, reject) => {
		const timeout = setTimeout(() => {
			const daysInMonth = date.daysInMonth();
			const daysToHighlight = [1, 2, 3].map(() =>
				getRandomNumber(1, daysInMonth)
			);

			resolve({ daysToHighlight });
		}, 500);

		signal.onabort = () => {
			clearTimeout(timeout);
			reject(new DOMException("aborted", "AbortError"));
		};
	});
}

const initialValue = dayjs("2022-04-18");

function ServerDay(props) {
	const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

	const isSelected =
		!props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) > 0;

	return (
		<Badge
			key={props.day.toString()}
			overlap="circular"
			badgeContent={isSelected ? "🌚" : undefined}
		>
			<PickersDay
				{...other}
				outsideCurrentMonth={outsideCurrentMonth}
				day={day}
			/>
		</Badge>
	);
}

ServerDay.propTypes = {
	/**
	 * The date to show.
	 */
	day: PropTypes.object.isRequired,
	highlightedDays: PropTypes.arrayOf(PropTypes.number),
	/**
	 * If `true`, day is outside of month and will be hidden.
	 */
	outsideCurrentMonth: PropTypes.bool.isRequired,
};
