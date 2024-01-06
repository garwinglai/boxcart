import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import styles from "@/styles/components/search-bar.module.css";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import ButtonThird from "../buttons/ButtonThird";
import ButtonSecondary from "../buttons/ButtonSecondary";
import ButtonFilter from "../buttons/ButtonFilter";
import ButtonFourth from "../buttons/ButtonFourth";

function SearchBar({ placeholder }) {
  const handleSearch = (e) => {
    e.preventDefault();
		console.log("hi")
  };
  return (
    <div className={`${styles.search_bar_box}`}>
      <form onSubmit={handleSearch}>
        <FormControl fullWidth>
          {/* <InputLabel
					htmlFor="outlined-adornment-amount"
					sx={{ zIndex: "-100" }}
					aria-hidden="true"
				>
					Search orders
				</InputLabel> */}
          <OutlinedInput
            sx={{ borderRadius: "4px", fontSize: "12px" }}
            className={`${styles.search_input}`}
            aria-label="search"
            id="outlined-adornment-amount"
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            }
            // endAdornment={
            //   <InputAdornment position="end">
            //     {/* <ButtonFourth name="Search" /> */}
            //     <button
            //       type="submit"
            //       onClick={handleSearch}
            //       className=""
            //     >
            //       Search
            //     </button>
            //   </InputAdornment>
            // }
            size="small"
            placeholder={placeholder}
          />
        </FormControl>
      </form>
    </div>
  );
}

export default SearchBar;
