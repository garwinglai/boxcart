import React from "react";
import styles from "@/styles/components/signup/businesstypecheckbox.module.css";
import Image from "next/image";

function BusinessTypeCheckbox({
	id,
	name,
	imgSrc,
	label,
	imgAlt,
	onChange,
	checked,
}) {
	return (
		<label className={`${styles.checkbox_group}`}>
			<div className={`${styles.input_group}`}>
				<input
					type="checkbox"
					id={id}
					name={name}
					onChange={onChange}
					checked={checked(name)}
				/>
				<span className={`${styles.checkbox}`}></span>
				<label htmlFor={id} className="text-sm font-light">
					{label}
				</label>
			</div>
			<Image src={imgSrc} alt={imgAlt} className="w-8 h-8" />
		</label>
	);
}

export default BusinessTypeCheckbox;
