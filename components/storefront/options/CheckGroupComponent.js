import React, { useState } from "react";
import styles from "../../../styles/components/storefront/options/check-group.module.css";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Checkbox from "@mui/material/Checkbox";

function CheckGroupComponent({ currOption }) {
	const { optionName, variations } = currOption;

	const [checkedArr, setCheckedArr] = useState([]);

	const handleChange = (event) => {
		const { name, checked } = event.target;
		if (checked) {
			if (!checkedArr.includes(name)) setCheckedArr((prev) => [...prev, name]);
		}

		if (!checked) {
			const removedOptionArr = checkedArr.filter((item) => item !== name);
			if (checkedArr.includes(name)) setCheckedArr(removedOptionArr);
		}
	};

	return (
		<FormControl
			className={`${styles.option_box}`}
			sx={{
				paddingLeft: "1.5rem",
				paddingRight: "1.5rem",
				paddingTop: "1.25rem",
			}}
			component="fieldset"
			variant="standard"
		>
			<div className={`${styles.flex} ${styles.title_box}`}>
				<p className="font-medium">{optionName}</p>
				<p className="font-extralight text-sm">as many</p>
			</div>
			<FormGroup className="pr-1">
				{variations.map((variant) => {
					return (
						<FormControlLabel
							key={variant.id}
							control={
								<Checkbox
									onChange={handleChange}
									name={variant.item}
									color="warning"
								/>
							}
							label={
								<p className="font-light text-sm">{`${variant.item} - ${variant.priceStr}`}</p>
							}
							labelPlacement="start"
							className={`${styles.checkbox_box}`}
						/>
					);
				})}
			</FormGroup>
		</FormControl>
	);
}

export default CheckGroupComponent;
