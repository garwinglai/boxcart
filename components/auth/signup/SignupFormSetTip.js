import React from "react";
import styles from "@/styles/components/signup/signupformsettips.module.css";
import SignupFormRadioGroup from "./SignupFormRadioGroup";
import percentIcon from "@/public/images/icons/signupflow/percent_icon.png";
import dollarIcon from "@/public/images/icons/signupflow/dollar_icon.png";
import CurrencyInput from "react-currency-input-field";

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
            <CurrencyInput
              name="tip1"
              required
              placeholder="%"
              value={tip1.tipInt}
              onValueChange={onChangeTipValues}
              decimalsLimit={2}
              decimalScale={2}
              suffix={typeOfTipInt === 0 ? "%" : ""}
              prefix={typeOfTipInt === 1 ? "$" : ""}
              className={`${styles.tip_input}`}
            />
          </div>
          <div className={`${styles.input_group}`}>
            <CurrencyInput
              name="tip2"
              required
              placeholder="%"
              value={tip2.tipInt}
              onValueChange={onChangeTipValues}
              decimalsLimit={2}
              decimalScale={2}
              suffix={typeOfTipInt === 0 ? "%" : ""}
              prefix={typeOfTipInt === 1 ? "$" : ""}
              className={`${styles.tip_input}`}
            />
          </div>
          <div className={`${styles.input_group}`}>
            <CurrencyInput
              name="tip3"
              required
              placeholder="%"
              value={tip3.tipInt}
              onValueChange={onChangeTipValues}
              decimalsLimit={2}
              decimalScale={2}
              suffix={typeOfTipInt === 0 ? "%" : ""}
              prefix={typeOfTipInt === 1 ? "$" : ""}
              className={`${styles.tip_input}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupFormSetTip;
