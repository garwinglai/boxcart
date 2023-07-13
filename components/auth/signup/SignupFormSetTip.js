import React from "react";
import styles from "@/styles/components/signup/signupformsettips.module.css";
import SignupFormRadioGroup from "./SignupFormRadioGroup";
import percentIcon from "@/public/images/icons/signupflow/percent_icon.png";
import dollarIcon from "@/public/images/icons/signupflow/dollar_icon.png";

function SignupFormSetTip({
  signupValues,
  onChangeTipType,
  isChecked,
  onChangeTipValues,
}) {
  const { typeOfTip, tipValues } = signupValues;
  const { tip1, tip2, tip3 } = tipValues;

  const typeOfTipInt = typeOfTip === "percentage" ? 0 : 1;

  return (
    <div>
      <h4 className="font-medium textblack">Set up customer tip options:</h4>
      <p className="font-light text-xs">(example: $1 $2 $3)</p>
      <div className={`${styles.form_box}`}>
        <div className={`${styles.flexCol} ${styles.tip_type_box}`}>
          <SignupFormRadioGroup
            id="percentage"
            name="percentage"
            label="%"
            hasImage={false}
            // imgSrc={percentIcon}
            // imgAlt="percentage icon"
            onChange={onChangeTipType}
            isChecked={isChecked}
          />
          <SignupFormRadioGroup
            id="dollar"
            name="dollar"
            label="$"
            hasImage={false}
            // imgSrc={dollarIcon}
            // imgAlt="dollar icon"
            onChange={onChangeTipType}
            isChecked={isChecked}
          />
        </div>
        <div className={`${styles.inputs_box} ${styles.flex}`}>
          <div className={`${styles.input_group}`}>
            <input
              autoFocus
              className={`${styles.tip_input}`}
              type="number"
              id="input_1"
              value={tip1.tipStr}
              name="tip1"
              pattern="\d*"
              inputMode="numeric"
              onChange={onChangeTipValues}
            />
            <label className={`${styles.tip_label}`} htmlFor="input_1">
              {typeOfTipInt === 0 ? "%" : "$"}
            </label>
          </div>
          <div className={`${styles.input_group}`}>
            <input
              className={`${styles.tip_input}`}
              type="number"
              id="input_2"
              name="tip2"
              value={tip2.tipStr}
              pattern="\d*"
              inputMode="numeric"
              onChange={onChangeTipValues}
            />
            <label className={`${styles.tip_label}`} htmlFor="input_2">
              {typeOfTipInt === 0 ? "%" : "$"}
            </label>
          </div>
          <div className={`${styles.input_group}`}>
            <input
              className={`${styles.tip_input}`}
              type="number"
              id="input_3"
              name="tip3"
              value={tip3.tipStr}
              pattern="\d*"
              inputMode="numeric"
              onChange={onChangeTipValues}
            />
            <label className={`${styles.tip_label}`} htmlFor="input_3">
              {typeOfTipInt === 0 ? "%" : "$"}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupFormSetTip;
