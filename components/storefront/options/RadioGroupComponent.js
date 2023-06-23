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
				<p className="font-medium">{optionName}</p>
				<p className="font-extralight text-sm">select 1</p>
			</div>
			<RadioGroup
				aria-labelledby="radio-buttons-group-label"
				defaultValue="female"
				name="radio-buttons-group"
			>
				{variations.map((variant) => {
					return (
						<FormControlLabel
							key={variant.id}
							value={variant.item}
							control={<Radio color="warning" />}
							label={
								<p className="font-light text-sm">{`${variant.item} - ${variant.priceStr}`}</p>
							}
							labelPlacement="start"
							className=" justify-between"
						/>
					);
				})}
			</RadioGroup>
		</FormControl>
	);
}

export default RadioGroupComponent;
