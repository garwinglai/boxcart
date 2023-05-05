import React from "react";
import styles from "../../styles/components/signup/signup-form-radio-group.module.css";
import Image from "next/image";

function SignupFormRadioGroup({
	id,
	name,
	label,
	imgSrc,
	imgAlt,
	hasImage,
	isChecked,
	onChange,
}) {
	return (
		<label className={`${styles.fulfillment}`}>
			<div className={`${styles.radio_group}`}>
				<input
					type="radio"
					id={id}
					name={name}
					checked={isChecked(name)}
					onChange={onChange}
				/>
				<label htmlFor={id}>{label}</label>
			</div>
			{hasImage && <Image src={imgSrc} width={50} alt={imgAlt} />}
		</label>
	);
}

export default SignupFormRadioGroup;
