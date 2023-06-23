import React from "react";
import styles from "@/styles/components/signup/signupformenabletips.module.css";
import SignupFormRadioGroup from "./SignupFormRadioGroup";

function SignupFormEnableTips({ isChecked, onChange }) {
	return (
		<div className={`${styles.enable_tips_box}`}>
			<h4 className="font-medium text-black">Enable tips?</h4>
			<div className={`${styles.flexCol} ${styles.button_group}`}>
				<SignupFormRadioGroup
					id="yesTips"
					name="yesTips"
					isChecked={isChecked}
					onChange={onChange}
					label="Yes"
					hasImage={false}
					imgSrc=""
					imgAlt=""
				/>
				<SignupFormRadioGroup
					id="noTips"
					name="noTips"
					isChecked={isChecked}
					onChange={onChange}
					label="No"
					hasImage={false}
					imgSrc=""
					imgAlt=""
				/>
			</div>
		</div>
	);
}

export default SignupFormEnableTips;
