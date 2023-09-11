import React from "react";
import styles from "../../../styles/components/storefront/options/radio-group.module.css";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

function RadioGroupComponent({
  currOption,
  handleOptionRadioGroupChange,
  selectedValue,
}) {
  const {
    id: groupId,
    optionGroupName,
    selectionDisplay,
    isRequiredDisplay,
    options,
  } = currOption;

  return (
    <FormControl
      className={`${styles.option_box}`}
      sx={{
        // paddingLeft: "1.5rem",
        // paddingRight: "1.5rem",
        paddingBottom: "1.25rem",
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
        value={selectedValue}
        onChange={handleOptionRadioGroupChange}
        required
      >
        <FormControlLabel
          defaultValue={`none-$0-${groupId}`}
          value={`none-$0-${groupId}`}
          control={<Radio color="warning" />}
          label={
            <p className="font-light text-xs text-[color:var(--black-design-extralight)] ">
              none
            </p>
          }
          labelPlacement="start"
          className=" justify-between"
        />
        {options.map((option) => {
          const { id, optionName, priceStr, quantityInt } = option;

          const controlValue =
            optionName +
            "-" +
            priceStr +
            "-" +
            groupId +
            "-" +
            quantityInt +
            "-" +
            optionGroupName;

          return (
            <FormControlLabel
              key={id}
              value={controlValue}
              control={<Radio color="warning" />}
              label={
                <div className="flex flex-grow justify-between gap-2">
                  <p className="font-light text-xs text-[color:var(--black-design-extralight)] ">
                    {`${optionName} - ${priceStr}`}
                  </p>
                  {quantityInt && (
                    <p className="text-xs font-extralight -mr-1">
                      ({quantityInt} left)
                    </p>
                  )}
                </div>
              }
              labelPlacement="start"
              className="justify-between w-full"
            />
          );
        })}
      </RadioGroup>
    </FormControl>
  );
}

export default RadioGroupComponent;
