import React from "react";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import styles from "../../styles/components/signup/nextbackbutton.module.css";
import ButtonLoader from "../loaders/ButtonLoader";
import CircularProgress from "@mui/material/CircularProgress";

function NextBackButtons({
	step,
	disableNext,
	nextStep,
	backStep,
	signup,
	canSkip,
	isLastStep,
	isLoading,
}) {
	console.log("isLastStep", isLastStep);
	return (
		<div className={`${styles.nextbackbuttons}`}>
			<button
				type="button"
				className={`${styles.back_button} ${styles.buttons} ${
					step == 0 && styles.hide_back_button
				}`}
				onClick={backStep}
			>
				<div className={`${styles.button_group}`}>
					<ArrowBackIcon />
					Back
				</div>
			</button>
			<button
				type="button"
				className={`${styles.skip_button} ${styles.buttons} ${
					!canSkip && styles.hide_skip_button
				}`}
				onClick={nextStep}
			>
				Skip
			</button>
			{isLoading ? (
				<CircularProgress color="secondary" />
			) : (
				<button
					type={isLastStep ? "submit" : "button"}
					className={`${styles.next_button} ${styles.buttons}`}
					onClick={isLastStep ? signup : nextStep}
					disabled={disableNext()}
				>
					<div className={`${styles.button_group}`}>
						{isLastStep ? "Finish" : "Next"}
						<ArrowForwardIcon />
					</div>
				</button>
			)}
		</div>
	);
}

export default NextBackButtons;
