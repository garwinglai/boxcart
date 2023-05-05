import React from "react";
import styles from "../../../styles/components/storefront/options/radio-group.module.css";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

function RadioGroupComponent({ currOption }) {
	const { optionName, variations } = currOption;
	return (
		<FormControl
			className={`${styles.option_box}`}
			sx={{ paddingLeft: "1.5rem", paddingRight: "1.5rem" }}
		>
			<div className={`${styles.flex} ${styles.title_box}`}>
				<FormLabel
					id="demo-radio-buttons-group-label"
					sx={{
						color: " var(--gray)",
						fontSize: "20px",
					}}
				>
					{optionName}
				</FormLabel>
				<p className={`${styles.subtitle_info}`}>select 1</p>
			</div>
			<RadioGroup
				aria-labelledby="demo-radio-buttons-group-label"
				defaultValue="female"
				name="radio-buttons-group"
				className={`${styles.group_radio_box} `}
			>
				{variations.map((variant) => {
					return (
						<FormControlLabel
							key={variant.id}
							value={variant.item}
							control={<Radio />}
							label={`${variant.item} - ${variant.priceStr}`}
							labelPlacement="start"
							className={`${styles.radio_box}`}
						/>
					);
				})}
			</RadioGroup>
		</FormControl>
	);
}

export default RadioGroupComponent;
