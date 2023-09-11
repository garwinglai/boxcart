import React, { useState } from "react";
import styles from "../../../styles/components/storefront/options/check-group.module.css";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Checkbox from "@mui/material/Checkbox";

function CheckGroupComponent({
  currOption,
  handleOptionCheckedGroupChange,
  checkedOptions,
}) {
  const {
    optionGroupName,
    selectionDisplay,
    isRequiredDisplay,
    options,
    id: groupId,
  } = currOption;

  return (
    <FormControl
      className={`${styles.option_box}`}
      sx={{
        // paddingLeft: "1.5rem",
        // paddingRight: "1.5rem",
        paddingBottom: "1.25rem",
      }}
      component="fieldset"
      variant="standard"
    >
      <div className={`${styles.flex} ${styles.title_box}`}>
        <p className="font-medium text-sm">{optionGroupName}</p>
        <p className="font-extralight text-xs text-[color:var(--gray)] opacity-70 ">
          {isRequiredDisplay} - {selectionDisplay}
        </p>
      </div>
      <FormGroup className="pr-1">
        {options.map((option) => {
          const { id, optionName, priceStr, quantityInt } = option;

          const optionValue =
            optionName +
            "-" +
            priceStr +
            "-" +
            groupId +
            "-" +
            quantityInt +
            "-" +
            optionGroupName +
            "-" +
            id;

          const findCurrentOption = checkedOptions.find(
            (findOption) => findOption.optionId == id
          );

          let selectedOptionValue = "";
          let isOptionChecked = false;

          if (findCurrentOption) {
            const {
              optionName: selectedOptionName,
              price,
              optionQuantity,
              optionId,
            } = findCurrentOption;

            selectedOptionValue =
              selectedOptionName +
              "-" +
              price +
              "-" +
              groupId +
              "-" +
              optionQuantity +
              "-" +
              optionGroupName +
              "-" +
              optionId;

            isOptionChecked = selectedOptionValue == optionValue;
          }

          return (
            <FormControlLabel
              key={id}
              control={
                <Checkbox
                  onChange={handleOptionCheckedGroupChange}
                  value={optionValue}
                  color="warning"
                  checked={isOptionChecked}
                />
              }
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
              className={`${styles.checkbox_box}`}
            />
          );
        })}
      </FormGroup>
    </FormControl>
  );
}

export default CheckGroupComponent;
