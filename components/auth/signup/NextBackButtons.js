import React from "react";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import styles from "@/styles/components/signup/nextbackbutton.module.css";
import ButtonLoader from "../../global/loaders/ButtonLoader";
import CircularProgress from "@mui/material/CircularProgress";
import ButtonSecondary from "@/components/global/buttons/ButtonSecondary";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";

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
        {!isLoading && (
          <ButtonSecondary name="Back" handleClick={backStep} type="button" />
        )}
      </div>

      <button
        type="button"
        className={`${styles.skip_button} text-sm ${
          (step == 0 || !canSkip || isLoading) && styles.hide_skip_button
        }`}
        onClick={nextStep}
      >
        Skip
      </button>
      {isLoading ? (
        <CircularProgress color="inherit" />
      ) : (
        <div>
          <ButtonPrimary
            type={isLastStep ? "submit" : "button"}
            name={isLastStep ? "Complete" : "Next"}
            handleClick={isLastStep ? null : nextStep}
          />
        </div>
      )}
    </div>
  );
}

export default NextBackButtons;
