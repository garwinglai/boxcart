import React from "react";
import styles from "../../styles/components/signup/signupformaddress.module.css";

function SignupFormAddress({ handleChange, signupValues }) {
	const { address_1, address_2, city, state, zip } = signupValues;

	return (
		<div className={`${styles.address_form}`}>
			<label htmlFor="address_1" className={`${styles.address_label}`}>
				What&apos;s your address?
			</label>
			<div className={`${styles.flexCol}`}>
				<input
					type="text"
					id="address_1"
					name="address_1"
					placeholder="Address 1"
					className={`${styles.address_input}`}
					onChange={handleChange}
					value={address_1}
				/>
				<input
					type="text"
					id="address_2"
					name="address_2"
					placeholder="Address 2"
					className={`${styles.address_input}`}
					onChange={handleChange}
					value={address_2}
				/>
				<div className={`${styles.flex}`}>
					<input
						type="text"
						placeholder="City"
						name="city"
						className={`${styles.address_input}`}
						onChange={handleChange}
						value={city}
					/>
					<input
						type="text"
						name="state"
						placeholder="State"
						pattern="[A-Za-z]{2}"
						maxLength={2}
						className={`${styles.address_input}`}
						onChange={handleChange}
						value={state}
					/>
					<input
						type="number"
						name="zip"
						placeholder="Zip"
						className={`${styles.address_input}`}
						onChange={handleChange}
						value={zip}
					/>
				</div>
			</div>
		</div>
	);
}

export default SignupFormAddress;
