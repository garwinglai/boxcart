import React from "react";
import styles from "../../styles/components/signup/signupformdistance.module.css";
import SignupFormRadioGroup from "./SignupFormRadioGroup";

function SignupFormDistance({ isLocalDistanceChecked, handleChange }) {
	return (
		<div>
			<h1 className={`${styles.title}`}>How far do you deliver?</h1>
			<div className={`${styles.distance_box}`}>
				<SignupFormRadioGroup
					id="5mi"
					name="5mi/8km"
					label="5mi/8km"
					hasImage={false}
					isChecked={isLocalDistanceChecked}
					onChange={handleChange}
				/>
				<SignupFormRadioGroup
					id="10mi"
					name="10mi/16km"
					label="10mi/16km"
					hasImage={false}
					isChecked={isLocalDistanceChecked}
					onChange={handleChange}
				/>
				<SignupFormRadioGroup
					id="30mi"
					name="30mi/48km"
					label="30mi/48km"
					hasImage={false}
					isChecked={isLocalDistanceChecked}
					onChange={handleChange}
				/>
				<SignupFormRadioGroup
					id="50mi"
					name="50mi/80km"
					label="50mi/80km"
					hasImage={false}
					isChecked={isLocalDistanceChecked}
					onChange={handleChange}
				/>
			</div>
		</div>
	);
}

export default SignupFormDistance;
