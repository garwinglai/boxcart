import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import styles from "@/styles/components/search-bar.module.css";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import ButtonThird from "./ButtonThird";
import ButtonSecondary from "./ButtonSecondary";
import ButtonFilter from "./ButtonFilter";
import ButtonFourth from "./ButtonFourth";

function SearchBar() {
	return (
		<div className={`${styles.search_bar_box}`}>
			<FormControl fullWidth>
				{/* <InputLabel
					htmlFor="outlined-adornment-amount"
					sx={{ zIndex: "-100" }}
					aria-hidden="true"
				>
					Search orders
				</InputLabel> */}
				<OutlinedInput
					sx={{ borderRadius: "25px" }}
					className={`${styles.search_input}`}
					aria-label="search"
					id="outlined-adornment-amount"
					startAdornment={
						<InputAdornment position="start">
							<SearchIcon fontSize="small" />
						</InputAdornment>
					}
					endAdornment={
						<InputAdornment position="end">
							{/* <ButtonFourth name="Search" /> */}
							<button className={`${styles.search_btn}`}>Search</button>
						</InputAdornment>
					}
					size="small"
					placeholder="Search for customer, status, item..."
				/>
			</FormControl>
		</div>
	);
}

export default SearchBar;
