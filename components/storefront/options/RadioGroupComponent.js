import React from "react";
import styles from "../../../styles/components/storefront/options/radio-group.module.css";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

function RadioGroupComponent({ currOption }) {
  const { optionGroupName, selectionDisplay, isRequiredDisplay, options } =
    currOption;

  return (
    <FormControl
      className={`${styles.option_box}`}
      sx={{
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
        paddingTop: "1.25rem",
      }}
    >
      <div className={`${styles.flex} ${styles.title_box}`}>
        <p className=" font-medium text-sm">{optionGroupName}</p>
        <p className="font-extralight text-xs text-[color:var(--gray)] opacity-70">
          {isRequiredDisplay} - {selectionDisplay}
        </p>
      </div>
      <RadioGroup
        aria-labelledby="radio-buttons-group-label"
        defaultValue="female"
        name="radio-buttons-group"
      >
        <FormControlLabel
          value="none"
          control={<Radio color="warning" />}
          label={
            <p className="font-light text-sm text-[color:var(--black-design-extralight)] ">
              none
            </p>
          }
          labelPlacement="start"
          className=" justify-between"
        />
        {options.map((option) => {
          const { id, optionName, priceStr } = option;

          return (
            <FormControlLabel
              key={id}
              value={optionName}
              control={<Radio color="warning" />}
              label={
                <p className="font-light text-sm text-[color:var(--black-design-extralight)] ">{`${optionName} - ${priceStr}`}</p>
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
