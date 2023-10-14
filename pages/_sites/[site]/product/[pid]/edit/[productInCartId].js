import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import ShareIcon from "@mui/icons-material/Share";
import { IconButton } from "@mui/material";
// import { products } from "@/helper/temp/tempData";
import Image from "next/image";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import RadioGroupComponent from "@/components/storefront/options/RadioGroupComponent";
import CheckGroupComponent from "@/components/storefront/options/CheckGroupComponent";
import ButtonPrimaryStorefront from "@/components/global/buttons/ButtonPrimaryStorefront";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ShopLayout from "@/components/layouts/storefront/ShopLayout";
import prisma from "@/lib/prisma";
import Snackbar from "@mui/material/Snackbar";
import { useCartStore } from "@/lib/store";
import { nanoid } from "nanoid";
import Link from "next/link";

// generate item quantity constant to 100 values in an array from 1
const unlimitedQuantity = Array.from({ length: 100 }, (_, i) => i + 1);

function EditAddToCartProduct({ product }) {
  const cart = useCartStore((state) => state.cart);
  const setCart = useCartStore((state) => state.setCart);
  const addSubtotal = useCartStore((state) => state.addSubtotal);
  const removeItemFromCart = useCartStore((state) => state.removeItemFromCart);
  const subtractSubtotal = useCartStore((state) => state.subtractSubtotal);

  const {
    id,
    productName,
    description,
    priceStr,
    priceIntPenny,
    reviewStr,
    reviewDouble,
    reviewCountStr,
    quantity,
    images,
    defaultImage,
    hasUnlimitedQuantity,
    setQuantityByProduct,
    optionGroups,
    questions,
    enableCustomNote,
    enableCustomerImageUploads,
    isSampleProduct,
  } = product;

  const [beforeEditPricePenny, setBeforeEditPricePenny] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState("1");
  const [exampleImages, setExampleImages] = useState([]);
  const [itemTotal, setItemTotal] = useState(product.priceStr);
  const [itemTotalPenny, setItemTotalPenny] = useState(product.priceIntPenny);
  const [radioOptionValues, setRadioOptionValues] = useState([]);
  const [checkboxOptionValues, setCheckboxOptionValues] = useState([]);
  const [customerNote, setCustomerNote] = useState("");
  const [businessQuestions, setBusinessQuestions] = useState(
    questions.length > 0
      ? questions.map((item) => {
          const { isRequired } = item;

          return {
            id: item.id,
            question: item.question,
            answer: "",
            isRequired,
          };
        })
      : []
  );

  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    isSnackbarOpen: false,
    snackbarMessage: "",
  });
  const [addedToCart, setAddedToCart] = useState(false);

  const { isSnackbarOpen, snackbarMessage } = snackbar;

  // Show default image first
  const imgArr = images.sort((a, b) => b.isDefault - a.isDefault);

  // create an array from 1 to quantity
  const productQuantity = Array.from({ length: quantity }, (_, i) => i + 1);

  const { back, query } = useRouter();
  const { productInCartId } = query;
  console.log("productInCartId", productInCartId);
  const selectRef = useRef(null);

  useEffect(() => {
    const currProductInCartToEdit = cart.find(
      (item) => item.addToCartTempItemId === productInCartId
    );
    const {
      customNote,
      orderExampleImages,
      orderOptionGroups,
      orderQuestionsAnswers,
      priceDisplay,
      pricePenny,
      quantity,
    } = currProductInCartToEdit;

    const radioOptionGroups = orderOptionGroups.filter(
      (item) => item.selectionType === 0
    );
    const checkboxOptionGroups = orderOptionGroups.filter(
      (item) => item.selectionType === 1
    );

    const radioOptionGroupRestructure = radioOptionGroups.map((item) => {
      const { optionGroupName, options, selectionType, groupId } = item;
      const { optionName, price, pricePenny, optionQuantity } = options[0];

      const setToNull = optionQuantity === "null" ? null : optionQuantity;

      const data = {
        selectionType,
        groupId,
        optionGroupName,
        optionName,
        price,
        pricePenny,
        optionQuantity: setToNull,
      };

      return data;
    });

    console.log("radioOptionGroups", radioOptionGroups);
    console.log("checkboxOptionGroups", checkboxOptionGroups);

    setBeforeEditPricePenny(pricePenny);
    setRadioOptionValues(radioOptionGroupRestructure);
    setCheckboxOptionValues(checkboxOptionGroups);
    setCustomerNote(customNote);
    setItemTotal(priceDisplay);
    setItemTotalPenny(pricePenny);
    setSelectedQuantity(quantity);

    setExampleImages(orderExampleImages);
    setBusinessQuestions(orderQuestionsAnswers);
  }, [productInCartId]);

  function handleBack() {
    back();
  }

  function handleShare() {
    // TODO: copy link - show small popup (link copied)
    // window.alert("share clicked");
  }

  const handleOpenSnackbar = (message) => {
    setSnackbar({
      isSnackbarOpen: true,
      snackbarMessage: message,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      isSnackbarOpen: false,
      snackbarMessage: "",
    });
  };

  const handleQuantityChange = (event) => {
    const { value } = event.target;
    const quantityInt = parseInt(value);

    const productPricePenny = product.priceIntPenny;
    let newItemTotalInt = productPricePenny * quantityInt;
    let totalPennyFromSelectManyOptions = 0;
    let totalPennyFromSelectOneOptions = 0;

    const checkedOptionValuesLength = checkboxOptionValues.length;
    const radioOptionValuesLength = radioOptionValues.length;

    if (checkedOptionValuesLength > 0) {
      //loop through the array, then loop through the options array to sum up all pricePenny

      for (let i = 0; i < checkedOptionValuesLength; i++) {
        const { options } = checkboxOptionValues[i];
        for (let j = 0; j < options.length; j++) {
          const { pricePenny } = options[j];
          totalPennyFromSelectManyOptions += pricePenny;
        }
      }
    }

    if (radioOptionValuesLength > 0) {
      for (let i = 0; i < radioOptionValuesLength; i++) {
        const { pricePenny } = radioOptionValues[i];
        totalPennyFromSelectOneOptions += pricePenny;
      }
    }

    newItemTotalInt += totalPennyFromSelectManyOptions * quantityInt;
    newItemTotalInt += totalPennyFromSelectOneOptions * quantityInt;
    const newItemTotalDisplay =
      `$` + (newItemTotalInt / 100).toFixed(2).toString();

    setItemTotal(newItemTotalDisplay);
    setItemTotalPenny(newItemTotalInt);
    setSelectedQuantity(quantityInt);
  };

  const handleOptionRadioGroupChange = (selectionType) => (event) => {
    const { value } = event.target;

    const {
      optionGroupId,
      selectedOptionPrice,
      selectionName,
      optionQuantity,
      optionGroupName,
    } = destructureOptionValue(value);
    const { selectionOptionPricePenny, selectionOptionPriceDisplay } =
      calculatePricePenny(selectedOptionPrice);
    let updatedPricePenny = itemTotalPenny;

    const data = {
      selectionType,
      groupId: optionGroupId,
      optionGroupName,
      optionName: selectionName,
      price: selectionOptionPriceDisplay,
      pricePenny: selectionOptionPricePenny,
      optionQuantity,
    };
    const radioOptionvaluesLength = radioOptionValues.length;

    if (radioOptionvaluesLength === 0) {
      updatedPricePenny += selectionOptionPricePenny * selectedQuantity;
      setRadioOptionValues((prev) => [...prev, data]);
    } else {
      const optionGroupExists = radioOptionValues.find(
        (item) => optionGroupId == item.groupId
      );

      if (!optionGroupExists) {
        updatedPricePenny += selectionOptionPricePenny * selectedQuantity;
        setRadioOptionValues((prev) => [...prev, data]);
      } else {
        const { pricePenny } = optionGroupExists;

        setRadioOptionValues((prev) =>
          prev.map((item) => (item.groupId === optionGroupId ? data : item))
        );
        updatedPricePenny -= pricePenny * selectedQuantity;
        updatedPricePenny += selectionOptionPricePenny * selectedQuantity;
      }
    }

    const updatedPriceStr = calculateUpdatedPrice(updatedPricePenny);
    setItemTotal(updatedPriceStr);
    setItemTotalPenny(updatedPricePenny);
  };

  const handleOptionCheckedGroupChange = (selectionType) => (event) => {
    const { value, checked } = event.target;

    const {
      optionGroupId,
      selectedOptionPrice,
      selectionName,
      optionId,
      optionQuantity,
      optionGroupName,
    } = destructureOptionValue(value);
    const { selectionOptionPricePenny, selectionOptionPriceDisplay } =
      calculatePricePenny(selectedOptionPrice);
    let updatedPricePenny = itemTotalPenny;

    const data = {
      selectionType,
      groupId: optionGroupId,
      optionGroupName,
      options: [
        {
          optionId,
          pricePenny: selectionOptionPricePenny,
          price: selectionOptionPriceDisplay,
          optionName: selectionName,
          optionQuantity,
        },
      ],
    };

    const checkedOptionValuesLength = checkboxOptionValues.length;

    if (checked) {
      if (checkedOptionValuesLength === 0) {
        setCheckboxOptionValues((prev) => [...prev, data]);
      } else {
        const optionGroupExists = checkboxOptionValues.find(
          (item) => item.groupId === optionGroupId
        );

        if (!optionGroupExists) {
          setCheckboxOptionValues((prev) => [...prev, data]);
        } else {
          const { options } = optionGroupExists;
          const updatedCheckedValues = [...options, data.options[0]];

          const updatedCheckboxOptionValues = checkboxOptionValues.map((item) =>
            item.groupId === optionGroupId
              ? { ...item, options: updatedCheckedValues }
              : item
          );

          setCheckboxOptionValues(updatedCheckboxOptionValues);
        }
      }
      updatedPricePenny += selectionOptionPricePenny * selectedQuantity;
    } else {
      const filteredCheckedValues = checkboxOptionValues.map((item) =>
        item.groupId === optionGroupId
          ? {
              ...item,
              options: item.options.filter(
                (item) => item.optionId !== optionId
              ),
            }
          : item
      );
      const filteredCheckBoxGroup = filteredCheckedValues.filter(
        (group) => group.options.length > 0
      );
      setCheckboxOptionValues(filteredCheckBoxGroup);
      updatedPricePenny -= selectionOptionPricePenny * selectedQuantity;
    }

    const updatedPriceStr = calculateUpdatedPrice(updatedPricePenny);
    setItemTotal(updatedPriceStr);
    setItemTotalPenny(updatedPricePenny);
  };

  const destructureOptionValue = (value) => {
    const selectionName = value.split("-")[0];
    const selectedOptionPrice = value.split("-")[1];
    const optionGroupId = value.split("-")[2];
    const optionQuantity = value.split("-")[3];
    const optionGroupName = value.split("-")[4];
    const optionId = value.split("-")[5];

    return {
      optionGroupId,
      selectedOptionPrice,
      selectionName,
      optionId,
      optionQuantity,
      optionGroupName,
    };
  };

  const calculatePricePenny = (selectedOptionPrice) => {
    const selectionOptionPricePenny = parseInt(
      parseFloat(selectedOptionPrice.slice(1)) * 100
    );
    const selectionOptionPriceDisplay =
      `$` + (selectionOptionPricePenny / 100).toFixed(2);

    return { selectionOptionPricePenny, selectionOptionPriceDisplay };
  };

  const calculateUpdatedPrice = (updatedPricePenny) => {
    const updatedPrice = (updatedPricePenny / 100).toFixed(2);
    const updatedPriceStr = `$` + updatedPrice;

    return updatedPriceStr;
  };

  const handleCustomerNoteChange = (event) => {
    const { value } = event.target;
    setCustomerNote(value);
  };

  const handleExampleFile = (e) => {
    const selectedImage = e.target.files[0];
    if (!selectedImage) return;

    const fileName = selectedImage.name;
    const imgUrl = URL.createObjectURL(selectedImage);
    const imgData = { imgUrl, fileName, imageFile: selectedImage };

    if (exampleImages.length < 3) {
      setExampleImages((prev) => [...prev, imgData]);
    }
  };

  const handleRemoveImage = (e, item) => {
    const { fileName, imgUrl } = item;
    const remainingImages = exampleImages.filter(
      (item) => item.fileName !== fileName
    );

    setExampleImages(remainingImages);
  };

  const handleCustomerQuestionChange = (id, isRequired) => (event) => {
    const { value } = event.target;

    const updatedQuestions = businessQuestions.map((item) =>
      item.id === id ? { ...item, answer: value, isRequired } : item
    );

    setBusinessQuestions(updatedQuestions);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();

    const requiredOptions = optionGroups.filter((item) => item.isRequired);
    const requiredQuestions = questions.filter((item) => item.isRequired);

    const requiredOptionGroupsLength = requiredOptions.length;

    if (requiredOptionGroupsLength > 0) {
      const optionGroupIdAndSelectionType = requiredOptions.map((item) => {
        return { groupId: item.id, selectionType: item.selectionType };
      });

      const optionGroupRadios = optionGroupIdAndSelectionType.filter(
        (item) => item.selectionType === 0
      );
      const optionGroupCheckbox = optionGroupIdAndSelectionType.filter(
        (item) => item.selectionType === 1
      );

      const optionGroupRadiosLength = optionGroupRadios.length;
      const optionGroupCheckboxLength = optionGroupCheckbox.length;

      if (optionGroupRadiosLength > 0) {
        const optionGroupRadiosIds = optionGroupRadios.map(
          (item) => item.groupId
        );

        const optionGroupRadiosExists = radioOptionValues.filter((item) =>
          optionGroupRadiosIds.includes(parseInt(item.groupId))
        );

        const optionGroupRadiosExistsLength = optionGroupRadiosExists.length;

        if (optionGroupRadiosExistsLength !== optionGroupRadiosLength) {
          handleOpenSnackbar("Missing required options");
          return;
        }
      }

      if (optionGroupCheckboxLength > 0) {
        const optionGroupCheckboxIds = optionGroupCheckbox.map(
          (item) => item.groupId
        );

        const optionGroupCheckboxExists = checkboxOptionValues.filter((item) =>
          optionGroupCheckboxIds.includes(parseInt(item.groupId))
        );

        const optionGroupCheckboxExistsLength =
          optionGroupCheckboxExists.length;

        if (optionGroupCheckboxExistsLength !== optionGroupCheckboxLength) {
          handleOpenSnackbar("Missing required options");
          return;
        }
      }
    }

    if (!setQuantityByProduct) {
      let smallestRadioOptionQuantity;
      let tempPosition = 0;
      for (let i = 0; i < radioOptionValues.length; i++) {
        const { optionQuantity, optionName } = radioOptionValues[i];

        if (optionName === "none") continue;

        if (tempPosition === 0) {
          smallestRadioOptionQuantity = optionQuantity;
          tempPosition++;
          continue;
        }

        if (optionQuantity < smallestRadioOptionQuantity) {
          smallestRadioOptionQuantity = optionQuantity;
        }
      }

      tempPosition--;

      let smallestCheckboxQuantity;

      for (let i = 0; i < checkboxOptionValues.length; i++) {
        const { options } = checkboxOptionValues[i];

        for (let j = 0; j < options.length; j++) {
          const { optionQuantity } = options[j];

          if (tempPosition === 0) {
            smallestCheckboxQuantity = optionQuantity;
            tempPosition++;
            continue;
          }

          if (optionQuantity < smallestCheckboxQuantity) {
            smallestCheckboxQuantity = optionQuantity;
          }
        }
      }

      if (
        smallestRadioOptionQuantity &&
        smallestRadioOptionQuantity < selectedQuantity
      ) {
        handleOpenSnackbar("Not enough in stock.");
        smallestRadioOptionQuantity = null;
        return;
      }

      if (
        smallestCheckboxQuantity &&
        smallestCheckboxQuantity < selectedQuantity
      ) {
        handleOpenSnackbar("Not enough in stock.");
        smallestCheckboxQuantity = null;
        return;
      }
    }

    const addToCartTempItemId = nanoid();

    const addToCartProductData = structureOrderData();
    addToCartProductData.addToCartTempItemId = addToCartTempItemId;
    addToCartProductData.defaultImage = product.defaultImage;
    addToCartProductData.productId = id;

    removeItemFromCart(productInCartId);
    subtractSubtotal(beforeEditPricePenny);
    addSubtotal(itemTotalPenny);
    setCart(addToCartProductData);
    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  const structureOrderData = () => {
    const pricePenny = parseInt(parseFloat(itemTotal.slice(1)) * 100);

    const updatedDataStructureRadio = radioOptionValues.map((item) => {
      const {
        groupId,
        optionGroupName,
        optionName,
        price,
        pricePenny,
        selectionType,
        optionQuantity,
      } = item;

      const optionsDisplay = optionName + " (" + price + ")";

      const data = {
        groupId,
        selectionType,
        optionGroupName,
        optionsDisplay,
        options: [
          {
            optionName,
            price,
            pricePenny,
            optionQuantity,
          },
        ],
      };

      return data;
    });

    const updatedDataStructureCheckbox = checkboxOptionValues.map((item) => {
      const { optionGroupName, options, groupId, selectionType } = item;
      const optionsDisplayArr = [];

      const updatedOptions = options.map((option) => {
        const { optionName, price, pricePenny, optionQuantity, optionId } =
          option;

        const data = {
          optionName,
          price,
          pricePenny,
          optionQuantity: parseInt(optionQuantity),
          optionId,
        };

        const checkBoxOptionDisplay = optionName + " (" + price + ")";
        optionsDisplayArr.push(checkBoxOptionDisplay);

        return data;
      });

      const optionsDisplay = optionsDisplayArr.join(", ");

      const data = {
        selectionType,
        groupId,
        optionGroupName,
        optionsDisplay,
        options: updatedOptions,
      };

      return data;
    });

    const orderOptionGroups = [
      ...updatedDataStructureRadio,
      ...updatedDataStructureCheckbox,
    ];

    const orderQuestionsAnswers = businessQuestions.map((item) => {
      const { question, answer, id, isRequired } = item;

      const data = {
        id,
        isRequired,
        question,
        answer,
      };
      return data;
    });

    const orderExampleImages = exampleImages.map((item) => {
      const { fileName, imageFile, imgUrl } = item;

      const data = {
        fileName,
        imageFile,
        imgUrl,
      };

      return data;
    });

    const addToCartProductData = {
      productName: productName,
      pricePenny,
      priceDisplay: itemTotal,
      quantity: parseInt(selectedQuantity),
      customNote: customerNote,
      orderOptionGroups,
      orderQuestionsAnswers,
      orderExampleImages,
    };

    return addToCartProductData;
  };

  //Displays
  function displayOptions(optionGroups) {
    return (
      <div className="px-6">
        {optionGroups.map((group, index) => {
          const { id, selectionType } = group;

          if (selectionType === 0) {
            const findExistingRadioOption = radioOptionValues.find(
              (item) => item.groupId == id
            );

            let selectedValue = "";

            if (findExistingRadioOption) {
              const {
                optionName,
                price,
                groupId,
                optionQuantity,
                optionGroupName,
              } = findExistingRadioOption;

              if (!optionGroupName) {
                selectedValue = optionName + "-" + "$0" + "-" + groupId;
              } else {
                selectedValue =
                  optionName +
                  "-" +
                  price +
                  "-" +
                  groupId +
                  "-" +
                  optionQuantity +
                  "-" +
                  optionGroupName;
              }
            }

            return (
              <RadioGroupComponent
                key={id}
                selectedValue={selectedValue}
                currOption={group}
                handleOptionRadioGroupChange={handleOptionRadioGroupChange(
                  selectionType
                )}
              />
            );
          }

          if (selectionType === 1) {
            const findExistingCheckboxOptions = checkboxOptionValues.find(
              (item) => item.groupId == id
            );

            let checkedOptions = [];

            if (findExistingCheckboxOptions) {
              const { options } = findExistingCheckboxOptions;
              checkedOptions = [...options];
            }

            return (
              <CheckGroupComponent
                key={id}
                currOption={group}
                checkedOptions={checkedOptions}
                handleOptionCheckedGroupChange={handleOptionCheckedGroupChange(
                  selectionType
                )}
              />
            );
          }
        })}
      </div>
    );
  }

  function displayNote() {
    return (
      <div className="flex flex-col pt-4 pb-6 px-6">
        <h4 className="font-medium text-sm">Custom note:</h4>
        <label
          htmlFor="customNote"
          className="text-[color:var(--gray-text)] font-extralight mb-2 text-sm"
        >
          Have something to add? Let us know here!
        </label>
        <textarea
          name="customNote"
          id="customNote"
          value={customerNote}
          onChange={handleCustomerNoteChange}
          rows={5}
          className="border border-[color:var(--black-design-extralight)] focus:outline-[color:var(--black)] p-2 "
        />
      </div>
    );
  }

  function displayQuestions(businessQuestions) {
    return businessQuestions.map((item) => {
      const { id, question, isRequired, answer } = item;

      return (
        <div key={id} className="flex flex-col pt-4 pb-6 px-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-sm">{question}</h4>
            <p className="text-xs font-extralight opacity-70">
              {isRequired ? "required" : "optional"}
            </p>
          </div>
          <textarea
            name="customNote"
            id="customNote"
            required={isRequired}
            value={answer}
            onChange={handleCustomerQuestionChange(id, isRequired)}
            rows={1}
            className="border border-[color:var(--black-design-extralight)] focus:outline-[color:var(--black)] p-2 "
          />
        </div>
      );
    });
  }

  function showQuantityBasedOnOptions(optionGroups) {
    let maxQuantity = 0;

    for (let i = 0; i < optionGroups.length; i++) {
      const { id, options } = optionGroups[i];
      const optionsLength = options.length;

      if (optionsLength === 0) return;

      for (let j = 0; j < optionsLength; j++) {
        const { quantityInt } = options[j];
        if (quantityInt > maxQuantity) maxQuantity = quantityInt;
      }
    }
    const quantityArr = Array.from({ length: maxQuantity }, (_, i) => i + 1);

    return quantityArr.map((item, idx) => (
      <option key={item} value={item}>
        {item}
      </option>
    ));
  }

  return (
    <form
      onSubmit={handleAddToCart}
      className="md:flex md:relative md:w-full md:px-8 md:pb-8 md:gap-4  md:overflow-hidden"
    >
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        sx={{ width: "fit-content" }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      />
      <div className="md:w-[65%] md:overflow-y-scroll">
        <div className="flex justify-between items-center my-1 mx-2 md:ml-0 md:my-4">
          <IconButton onClick={handleBack} className="flex items-center">
            <ChevronLeftIcon
              fontSize="medium"
              sx={{ color: "var(--black-design-extralight)" }}
            />
            <p className="font-light text-sm text-[color:var(--black-design-extralight)]">
              Back
            </p>
          </IconButton>
          <div className="rounded-full">
            <IconButton onClick={handleShare}>
              <ShareIcon
                fontSize="small"
                sx={{ color: "var(--black-design-extralight)" }}
              />
            </IconButton>
          </div>
        </div>
        <div className="flex overflow-x-scroll w-full md:grid md:grid-cols-2 lg:w-5/6 lg:mx-auto xl:w-3/4">
          {isSampleProduct ? (
            <div className={`min-w-full relative aspect-square md:col-span-2`}>
              <Image
                src={defaultImage}
                alt="product image"
                fill
                priority
                className="object-cover snap-center"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ) : (
            images.map((imgItem, index) => {
              const { isDefault, image, id } = imgItem;

              return (
                <div
                  key={id}
                  className={`min-w-full relative aspect-square ${
                    isDefault ? "md:col-span-2" : "md:col-span-1 "
                  }`}
                >
                  <Image
                    src={image}
                    alt="product image"
                    fill
                    priority
                    className="object-cover snap-center"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              );
            })
          )}
        </div>
        {images.length > 1 ? (
          <div className="text-center pt-2 md:hidden">
            <MoreHorizIcon
              fontSize="medium"
              sx={{ color: "var(--gray-light-med)" }}
            />
          </div>
        ) : (
          <div className="text-center pt-4 md:hidden"></div>
        )}
      </div>
      <div className="md:w-[35%] md:pt-10 md:sticky md:top-0">
        <div className="flex flex-col gap-2 px-6 pb-4 border-b border-[color:var(--gray-light)]">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">{productName}</h3>
            <p className="font-medium">{priceStr}</p>
          </div>
          <div className="flex justify-between gap-4  md:flex-col-reverse md:items-start md:gap-2">
            <p className="font-light text-sm text-[color:var(--gray)] ">
              {description}
            </p>
            {/* <div className="flex flex-col items-end md:items-start">
							<p className="text-[color:var(--gray-text)] font-extralight text-xs">{`(${reviewCountStr})`}</p>

							<Rating
								name="read-only"
								defaultValue={reviewDouble}
								precision={0.5}
								readOnly
								size="small"
							/>
						</div> */}
          </div>
        </div>
        <div className="relative px-6 pb-4">
          <label
            htmlFor="quantitySelect"
            className="block mb-1 font-medium text-sm text-[color:var(--black-design-extralight)] "
            ref={selectRef}
          >
            Item Quantity:
          </label>
          <select
            id="quantitySelect"
            value={selectedQuantity}
            onChange={handleQuantityChange}
            className="appearance-none w-full px-4 py-2 border text-sm font-light border-gray-300 rounded focus:outline-[color:var(--third)] "
          >
            {hasUnlimitedQuantity
              ? // 100 is the max quantity
                unlimitedQuantity.map((item, idx) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))
              : setQuantityByProduct
              ? productQuantity.map((item, idx) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))
              : showQuantityBasedOnOptions(optionGroups)}
          </select>
        </div>
        {optionGroups.length > 0 && (
          <div className="border-y pt-4">{displayOptions(optionGroups)}</div>
        )}
        {businessQuestions.length > 0 && (
          <div className="border-b">{displayQuestions(businessQuestions)}</div>
        )}
        {enableCustomNote && <div className="border-b">{displayNote()}</div>}
        {enableCustomerImageUploads && (
          <div className="py-4">
            <div className="flex items-center justify-between px-6">
              <h4 className="font-medium text-sm">Upload examples:</h4>
              <p className="text-xs font-extralight opacity-70">optional</p>
            </div>
            <div className="flex flex-row-reverse justify-between gap-4 items-center px-6 pt-4">
              <p className="text-xs font-extralight">3 uploads max</p>
              {exampleImages.length < 3 && (
                <label
                  htmlFor="file"
                  aria-disabled
                  className="text-white bg-[color:var(--black-design-extralight)] font-extralight text-xs px-4 py-2 active:bg-black"
                >
                  Upload image
                  <input
                    type="file"
                    id="file"
                    value=""
                    accept="image/"
                    onChange={handleExampleFile}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        )}
        <div className="flex overflow-x-scroll w-full gap-2 px-6 border-b">
          {exampleImages.length !== 0 &&
            exampleImages.map((item, idx) => (
              <div key={idx} className="flex flex-col max-w-[5rem] gap-1 pb-4">
                <div className="relative h-[5rem] min-w-[5rem] inline-block">
                  <Image
                    src={item.imgUrl}
                    alt={item.fileName}
                    fill
                    className="object-cover inline-block"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute bg-[color:var(--black-design-extralight)] rounded-full right-1 top-1 opacity-70">
                    <IconButton onClick={(e) => handleRemoveImage(e, item)}>
                      <CloseIcon
                        sx={{
                          color: "var(--white)",
                          fontSize: "0.75rem",
                        }}
                      />
                    </IconButton>
                  </div>
                </div>
                <p className="truncate font-extralight text-xs">
                  {item.fileName}
                </p>
              </div>
            ))}
        </div>
        <div className="flex px-6 pt-4 justify-between items-center">
          <h3 className="font-medium">Item total:</h3>
          <p className="font-medium">{itemTotal}</p>
        </div>
        <div className="sticky bottom-0 p-4 mt-20 flex flex-col gap-2 bg-white border-t border-[color:var(--gray-light-med)] md:border-none md:mt-8">
          <div className="h-10">
            <ButtonPrimaryStorefront
              name={`${addedToCart ? "Updated" : "Update Item"}`}
              type="submit"
              disabled={isLoading}
            />
          </div>

          <Link
            href="/"
            className=" text-center flex justify-center items-center h-10 border border-[color:var(--black-design-extralight)] font-light text-[color:var(--black-design-extralight)] w-full active:bg-[color:var(--gray-light-med)] "
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </form>
  );
}

export default EditAddToCartProduct;

EditAddToCartProduct.getLayout = function getLayout(page) {
  return <ShopLayout>{page}</ShopLayout>;
};

export async function getServerSideProps(context) {
  const { pid } = context.query;
  const id = parseInt(pid);

  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      account: true,
      images: true,
      optionGroups: {
        include: {
          options: true,
        },
      },
      questions: true,
    },
  });

  if (!product) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { account } = product;

  if (!account.isChecklistComplete) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const serializedProduct = JSON.parse(JSON.stringify(product));

  return {
    props: {
      product: serializedProduct,
    },
  };
}
