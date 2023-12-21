import React, { useState, useEffect } from "react";
import styles from "../../../styles/components/storefront/options/radio-group.module.css";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { useOptionsQuantityStore } from "@/lib/store";

function RadioGroupComponent({
  currOption,
  handleOptionRadioGroupChange,
  selectedValue,
  setQuantityByProduct,
  hasUnlimitedQuantity,
  radioCheckedOption,
  productId,
  currentAddedToCartOptionIds,
  totalQuantityOfItemInCart,
}) {
  const {
    id: groupId,
    optionGroupName,
    selectionDisplay,
    isRequiredDisplay,
    options,
    isRequired,
  } = currOption;

  const optionQuantityStore = useOptionsQuantityStore((state) => state.options);
  const setOptionsQuantityStore = useOptionsQuantityStore(
    (state) => state.setOptions
  );
  const removeOption = useOptionsQuantityStore((state) => state.removeOption);
  const reduceOptionQuantity = useOptionsQuantityStore(
    (state) => state.reduceOptionQuantity
  );

  const [optionQuantities, setOptionQuantities] = useState([]);

  useEffect(() => {
    const findOptionQuantityPerProduct = optionQuantityStore.find(
      (optionSet) => {
        if (optionSet.productId === productId) {
          return optionSet;
        }
      }
    );

    // If option quantity exists in store.
    if (findOptionQuantityPerProduct) {
      const findOptionGroup = findOptionQuantityPerProduct.optionGroups.find(
        (optionGroup) => {
          const { groupId: groupIdStore } = optionGroup;

          if (groupId == groupIdStore) {
            return optionGroup;
          }
        }
      );

      const findOptionQuantity = findOptionGroup.options;

      const buildOptionQuantitiesStore = findOptionQuantity.map((option) => {
        const { optionId, optionQuantityLeft } = option;
        return { optionId, optionQuantityLeft };
      });

      setOptionQuantities(buildOptionQuantitiesStore);
    } else {
      const buildOptionQuantitiesDb = options.map((option) => {
        const { id, quantity } = option;
        return { optionId: id, optionQuantityLeft: quantity };
      });

      setOptionQuantities(buildOptionQuantitiesDb);
    }
  }, [optionQuantityStore]);

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
        {options.map((option) => {
          const { id, optionName, priceStr } = option;

          let quantity = 0;

          // looping through state to ensure quantities are in real time, and updated.
          for (let i = 0; i < optionQuantities.length; i++) {
            const curr = optionQuantities[i];
            const { optionId, optionQuantityLeft } = curr;
            if (optionId === id) {
              quantity = optionQuantityLeft;
            }
          }

          if (
            currentAddedToCartOptionIds &&
            currentAddedToCartOptionIds.length > 0
          ) {
            for (let j = 0; j < currentAddedToCartOptionIds.length; j++) {
              const optionIdAddedToCart = currentAddedToCartOptionIds[j];
              if (optionIdAddedToCart == id) {
                quantity -= totalQuantityOfItemInCart;
              }
            }
          }

          const controlValue =
            optionName +
            "-" +
            priceStr +
            "-" +
            groupId +
            "-" +
            quantity +
            "-" +
            optionGroupName +
            "-" +
            id;

          // Checking if option is checked.
          let isOptionChecked = id == radioCheckedOption;

          return (
            <FormControlLabel
              key={id}
              value={controlValue}
              control={
                <Radio
                  color="warning"
                  checked={isOptionChecked}
                  disabled={
                    !hasUnlimitedQuantity && !setQuantityByProduct && quantity
                      ? quantity <= 0
                      : false
                  }
                />
              }
              label={
                <div className="flex flex-grow justify-between gap-2">
                  <p className="font-light text-xs text-[color:var(--black-design-extralight)] ">
                    {`${optionName} +${priceStr}`}
                  </p>
                  {!hasUnlimitedQuantity &&
                  !setQuantityByProduct &&
                  quantity ? (
                    quantity > 0 ? (
                      <p className="text-xs font-extralight -mr-1">
                        ({quantity} left)
                      </p>
                    ) : (
                      <p className="text-xs font-extralight -mr-1">
                        ({quantity} left)
                      </p>
                    )
                  ) : (
                    <p></p>
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
