import React from "react";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import styles from "@/styles/components/signup/nextbackbutton.module.css";
import ButtonLoader from "../../common/loaders/ButtonLoader";
import CircularProgress from "@mui/material/CircularProgress";
import ButtonSecondary from "@/components/common/buttons/ButtonSecondary";
import ButtonPrimary from "@/components/common/buttons/ButtonPrimary";

function NextBackButtons({
	step,
	nextStep,
	backStep,
	signup,
	canSkip,
	isLastStep,
	isLoading,
}) {
	return (
		<div className={`${styles.nextbackbuttons}`}>
			<div className={` ${step == 1 && styles.hide_back_button}`}>
				<ButtonSecondary name="Back" handleClick={backStep} type="button" />
			</div>

			<button
				type="button"
				className={`${styles.skip_button} text-sm ${
					!canSkip && styles.hide_skip_button
				}`}
				onClick={nextStep}
			>
				Skip
			</button>
			{isLoading ? (
				<CircularProgress color="secondary" />
			) : (
				<div>
					<ButtonPrimary
						type={isLastStep ? "submit" : "button"}
						name={isLastStep ? "Complete" : "Next"}
						handleClick={isLastStep ? signup : nextStep}
					/>
				</div>
			)}
		</div>
	);
}

export default NextBackButtons;
