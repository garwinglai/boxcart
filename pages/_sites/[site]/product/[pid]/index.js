import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import ShareIcon from "@mui/icons-material/Share";
import { IconButton } from "@mui/material";
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
import {
  useCartStore,
  useProductQuantityStore,
  useOptionsQuantityStore,
} from "@/lib/store";
import { nanoid } from "nanoid";
import Link from "next/link";
import CheckmarkGif from "@/public/videos/checkmark.gif";

// generate item quantity constant to 100 values in an array from 1
const unlimitedQuantity = Array.from({ length: 100 }, (_, i) => i + 1);

function Product({ product }) {
  const setCart = useCartStore((state) => state.setCart);
  const addSubtotal = useCartStore((state) => state.addSubtotal);
  const cart = useCartStore((state) => state.cart);
  const productsStore = useProductQuantityStore((state) => state.products);
  const setProductsStore = useProductQuantityStore(
    (state) => state.setProducts
  );
  const removeProduct = useProductQuantityStore((state) => state.removeProduct);
  const reduceProductQuantity = useProductQuantityStore(
    (state) => state.reduceProductQuantity
  );
  const optionQuantityStore = useOptionsQuantityStore((state) => state.options);
  const setOptionsQuantityStore = useOptionsQuantityStore(
    (state) => state.setOptions
  );
  const reduceRemainingQuantity = useOptionsQuantityStore(
    (state) => state.reduceRemainingQuantity
  );
  const updateRemainingMax = useOptionsQuantityStore(
    (state) => state.updateRemainingMax
  );
  const removeOption = useOptionsQuantityStore((state) => state.removeOption);
  const reduceOptionQuantity = useOptionsQuantityStore(
    (state) => state.reduceOptionQuantity
  );

  const {
    id,
    productName,
    description,
    priceStr,
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

  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [exampleImages, setExampleImages] = useState([]);
  const [itemTotal, setItemTotal] = useState(product.priceStr);
  const [itemTotalPenny, setItemTotalPenny] = useState(product.priceIntPenny);
  const [radioOptionValues, setRadioOptionValues] = useState([]);
  const [checkboxOptionValues, setCheckboxOptionValues] = useState([]);
  const [customerNote, setCustomerNote] = useState("");
  const [businessQuestions, setBusinessQuestions] = useState(
    questions.length > 0
      ? questions.map((item) => {
          return {
            id: item.id,
            question: item.question,
            answer: "",
            isRequired: item.isRequired,
          };
        })
      : []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    isSnackbarOpen: false,
    snackbarMessage: "",
  });
  const [isSoldOut, setIsSoldOut] = useState(false);
  const [productQuantity, setProductQuantity] = useState(
    Array.from({ length: quantity }, (_, i) => i + 1)
  );
  const [optionsQuantity, setOptionsQuantity] = useState(
    Array.from({ length: quantity }, (_, i) => i + 1)
  );
  const [addedToCart, setAddedToCart] = useState(false);

  const { isSnackbarOpen, snackbarMessage } = snackbar;

  // Show default image first
  const imgArr = images.sort((a, b) => b.isDefault - a.isDefault);

  const router = useRouter();
  const selectRef = useRef(null);

  // Set product quantity if quantity is set to product
  useEffect(() => {
    if (!hasUnlimitedQuantity && setQuantityByProduct && quantity == 0) {
      setIsSoldOut(true);
    }

    const productExistInSstore = productsStore.find((item) => item.id === id);
    let finalSelectedQuantity = 0;

    if (productExistInSstore) {
      const { quantity: quantityStore, initialQuantity } = productExistInSstore;

      let quantityArray = [];

      if (quantity != initialQuantity) {
        // Store is old from cache, use quantity from db

        const relatedCartItems = cart.filter((item) => item.productId === id);
        let itemCount = 0;

        for (let i = 0; i < relatedCartItems.length; i++) {
          const currItem = relatedCartItems[i];
          const { quantity } = currItem;
          itemCount += quantity;
        }

        if (quantity >= itemCount) {
          quantityArray = Array.from(
            { length: quantity - itemCount },
            (_, i) => i + 1
          );
          finalSelectedQuantity = 1;
        } else {
          quantityArray = Array.from({ length: 0 }, (_, i) => i + 1);
          finalSelectedQuantity = 0;
        }
      } else {
        // Store is new, use quantity from store
        quantityArray = Array.from({ length: quantityStore }, (_, i) => i + 1);
        finalSelectedQuantity = 1;
      }

      setProductQuantity(quantityArray);

      if (finalSelectedQuantity === 0) {
        setIsSoldOut(true);
      } else {
        setIsSoldOut(false);
      }
    } else {
      const quantityArray = Array.from({ length: quantity }, (_, i) => i + 1);
      setProductQuantity(quantityArray);
      finalSelectedQuantity = 1;
    }

    setSelectedQuantity(finalSelectedQuantity);
  }, [productsStore]);

  // This checks for maxQuantity of options, and displays the max quantity left between each option available.
  useEffect(() => {
    if (!hasUnlimitedQuantity && !setQuantityByProduct) {
      const findOptionQuantityStore = optionQuantityStore.find(
        (item) => item.productId === id
      );

      // This keeps track of db quantity.
      let finalSelectedQuantity = 0;
      let numOptionsLeft = 0;
      let quantityArr = [];

      for (let i = 0; i < optionGroups.length; i++) {
        const currGroup = optionGroups[i];
        const { options } = currGroup;
        let optionsLeftInGroup = 0;

        for (let j = 0; j < options.length; j++) {
          const currOption = options[j];
          const { quantity } = currOption;
          optionsLeftInGroup += quantity;

          if (quantity > 0) {
            numOptionsLeft += quantity;
          }
        }

        if (optionsLeftInGroup == 0) {
          setIsSoldOut(true);
          return;
        } else {
          setIsSoldOut(false);
        }
      }

      // This looks for the max quantity between the different options available, and will be used to display how much quantity is left.

      const maxQuantity = findMaxQuantityOfOptionsDb(optionGroups);

      // calculate max option quantity to check if store && db align. If align = current store, if not, then stored values are old.
      const maxOptionQuantityDb = calculateTotalMaximumOfOptions(optionGroups);

      // if there is a store already
      if (findOptionQuantityStore) {
        const { totalOptionsAvailable, remainingMaxQuantity } =
          findOptionQuantityStore;

        if (maxOptionQuantityDb == totalOptionsAvailable) {
          // new store

          // Check all available required options.
          const requiredStoreOptions =
            findOptionQuantityStore.optionGroups.filter(
              (item) => item.isRequired
            );

          // check if any option quantity is zero in store, if it is zero, set soldout to true.
          for (let i = 0; i < requiredStoreOptions.length; i++) {
            const { options } = requiredStoreOptions[i];
            let itemOptionsQuantity = 0;

            for (let j = 0; j < options.length; j++) {
              const { optionQuantityLeft } = options[j];
              itemOptionsQuantity += optionQuantityLeft;
            }

            if (itemOptionsQuantity == 0) {
              setIsSoldOut(true);
              return;
            } else {
              itemOptionsQuantity = 0;
            }
          }

          quantityArr = Array.from(
            { length: remainingMaxQuantity },
            (_, i) => i + 1
          );
          finalSelectedQuantity = 1;
        } else {
          // old store
        }
      } else {
        quantityArr = Array.from({ length: maxQuantity }, (_, i) => i + 1);
        finalSelectedQuantity = 1;
      }

      if (maxQuantity === 0 || finalSelectedQuantity === 0) {
        setIsSoldOut(true);
      } else {
        setIsSoldOut(false);
      }

      setOptionsQuantity(quantityArr);
      setSelectedQuantity(finalSelectedQuantity);

      // If db is 0, set sold out to true.
      if (numOptionsLeft < 1) {
        setIsSoldOut(true);
      }
    }
  }, [productsStore, product, optionQuantityStore]);

  function handleBack() {
    router.back();
  }

  function handleShare() {
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
      optionId,
    } = destructureOptionValue(value);
    const { selectionOptionPricePenny, selectionOptionPriceDisplay } =
      calculatePricePenny(selectedOptionPrice);
    let updatedPricePenny = itemTotalPenny;

    const data = {
      optionId,
      selectionType,
      groupId: optionGroupId,
      optionGroupName,
      optionName: selectionName,
      price: selectionOptionPriceDisplay,
      pricePenny: selectionOptionPricePenny,
      optionQuantity,
    };

    const radioOptionValuesLength = radioOptionValues.length;

    if (radioOptionValuesLength === 0) {
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
      (parseFloat(selectedOptionPrice.slice(1)) * 100).toFixed(2)
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
    setIsLoading(true);

    const requiredOptions = optionGroups.filter((item) => item.isRequired);
    const requiredOptionGroupsLength = requiredOptions.length;

    // This if block checks if required options were selected.
    if (requiredOptionGroupsLength > 0) {
      // building data to filter out radio and checkbox option groups
      const optionGroupIdAndSelectionType = requiredOptions.map((item) => {
        return { groupId: item.id, selectionType: item.selectionType };
      });

      // Filter out radio and checkbox option groups
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
          setIsLoading(false);
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
          setIsLoading(false);
          return;
        }
      }
    }

    // If quantity is tied to options' quantity, then check if selected quantity for the product is more than options' quantity. If so, then there's not enough stock, so throw error "not enough stock".
    if (!setQuantityByProduct) {
      let smallestRadioOptionQuantity;

      for (let i = 0; i < radioOptionValues.length; i++) {
        const { optionQuantity, optionName } = radioOptionValues[i];
        const optionQuantityInt = parseInt(optionQuantity);

        if (optionName === "none") continue;

        if (!smallestRadioOptionQuantity) {
          smallestRadioOptionQuantity = optionQuantityInt;
        } else {
          if (optionQuantityInt < smallestRadioOptionQuantity) {
            smallestRadioOptionQuantity = optionQuantityInt;
          }
        }
      }

      let smallestCheckboxQuantity;

      for (let i = 0; i < checkboxOptionValues.length; i++) {
        const { options } = checkboxOptionValues[i];

        for (let j = 0; j < options.length; j++) {
          const { optionQuantity } = options[j];
          const optionQuantityInt = parseInt(optionQuantity);

          if (!smallestCheckboxQuantity) {
            smallestCheckboxQuantity = optionQuantityInt;
          } else {
            if (optionQuantityInt < smallestCheckboxQuantity) {
              smallestCheckboxQuantity = optionQuantityInt;
            }
          }
        }
      }

      if (smallestRadioOptionQuantity < selectedQuantity) {
        handleOpenSnackbar("Not enough in stock.");
        smallestRadioOptionQuantity = null;
        setIsLoading(false);
        return;
      }

      if (smallestCheckboxQuantity < selectedQuantity) {
        handleOpenSnackbar("Not enough in stock.");
        setIsLoading(false);
        smallestCheckboxQuantity = null;
        return;
      }
    }

    const addToCartProductData = structureOrderData();

    if (!hasUnlimitedQuantity && setQuantityByProduct) {
      updateProductQuantityInStore();
    }

    if (!hasUnlimitedQuantity && !setQuantityByProduct) {
      updateOptionQuantityInStore();
    }

    setAddedToCart(true);
    addSubtotal(itemTotalPenny);
    setCart(addToCartProductData);
    setIsLoading(false);
  };

  const calculateTotalMaximumOfOptions = (optionGroups) => {
    let maxOptionQuantityDb = 0;

    for (let i = 0; i < optionGroups.length; i++) {
      const currGroup = optionGroups[i];
      const { id: groupId, options } = currGroup;
      for (let j = 0; j < options.length; j++) {
        const currOption = options[j];
        const { quantity } = currOption;
        maxOptionQuantityDb += quantity;
      }
    }

    return maxOptionQuantityDb;
  };

  const findMaxQuantityOptionStore = (optionStoreGroup) => {
    let maxQuantity = 0;
    const selectedOptionIds = [];

    radioOptionValues.map((item) => {
      const { groupId, optionId } = item;
      selectedOptionIds.push(optionId);
    });

    checkboxOptionValues.map((item) => {
      const { groupId, options } = item;
      const optionIds = options.map((item) =>
        selectedOptionIds.push(item.optionId)
      );
    });

    for (let i = 0; i < optionStoreGroup.length; i++) {
      const currSet = optionStoreGroup[i];
      const { optionGroups } = currSet;

      for (let j = 0; j < optionGroups.length; j++) {
        const currGroup = optionGroups[j];
        const { isRequired, options } = currGroup;
        if (!isRequired) continue;

        for (let k = 0; k < options.length; k++) {
          const currOption = options[k];
          const { optionQuantityLeft, optionId } = currOption;

          if (selectedOptionIds.includes(optionId.toString())) {
            const reducedQuantity =
              optionQuantityLeft - parseInt(selectedQuantity);

            if (maxQuantity < reducedQuantity) {
              maxQuantity = reducedQuantity;
            }
            continue;
          }

          if (maxQuantity < optionQuantityLeft)
            maxQuantity = optionQuantityLeft;
        }
      }
    }

    return maxQuantity;
  };

  const findMaxQuantityOfOptionsDb = (optionGroups) => {
    let maxQuantity = 0;
    const selectedOptionIds = [];

    radioOptionValues.map((item) => {
      const { groupId, optionId } = item;
      selectedOptionIds.push(optionId);
    });

    checkboxOptionValues.map((item) => {
      const { groupId, options } = item;
      const optionIds = options.map((item) =>
        selectedOptionIds.push(item.optionId)
      );
    });

    for (let i = 0; i < optionGroups.length; i++) {
      const currGroup = optionGroups[i];
      const { options, isRequired } = currGroup;
      if (!isRequired) continue;

      for (let j = 0; j < options.length; j++) {
        const currOption = options[j];
        const { id, quantity } = currOption;

        if (selectedOptionIds.includes(id.toString())) {
          const reducedQuantity = quantity - parseInt(selectedQuantity);

          if (maxQuantity < reducedQuantity) {
            maxQuantity = reducedQuantity;
          }
          continue;
        }

        if (maxQuantity < quantity) maxQuantity = quantity;
      }
    }

    return maxQuantity;
  };

  const buildOptionsData = (
    optionGroups,
    maxOptionQuantityDb,
    maxQuantity,
    selectedQuantityNum
  ) => {
    let remainingMaxQuantity = maxQuantity;

    const optionsData = {
      productId: id,
      remainingMaxQuantity,
      remainingOptions: maxOptionQuantityDb - selectedQuantityNum,
      totalOptionsAvailable: maxOptionQuantityDb,
      optionGroups: optionGroups.map((item) => {
        const { id: groupId, options, selectionType, isRequired } = item;
        // selectionType 0 is radio input, 1 is checkbox input

        const builtOptions = options.map((option) => {
          const { id: optionId, quantity } = option;
          const optionQuantityInt = parseInt(quantity);
          let optionQuantity = optionQuantityInt;

          // Radio values are checked
          if (selectionType === 0) {
            for (let i = 0; i < radioOptionValues.length; i++) {
              const currRadioOption = radioOptionValues[i];
              const { groupId: groupIdChecked, optionId: optionIdChecked } =
                currRadioOption;

              if (groupId != groupIdChecked || optionId != optionIdChecked)
                continue;

              optionQuantity -= selectedQuantityNum;
            }
          }

          // Checkbox values are checked
          if (selectionType === 1) {
            for (let i = 0; i < checkboxOptionValues.length; i++) {
              const currOptionGroup = checkboxOptionValues[i];
              const { groupId: groupIdChecked, options } = currOptionGroup;

              if (groupIdChecked != groupId) continue;
              for (let j = 0; j < options.length; j++) {
                const currOption = options[j];
                const { optionId: optionIdChecked } = currOption;

                if (optionIdChecked != optionId) continue;
                optionQuantity -= selectedQuantityNum;
              }
            }
          }

          const optionData = {
            optionId,
            optionQuantityLeft: optionQuantity,
            initialOptionQuantity: optionQuantityInt,
          };

          return optionData;
        });

        const data = {
          groupId,
          isRequired,
          selectionType,
          options: builtOptions,
        };

        return data;
      }),
    };

    return optionsData;
  };

  const updateOptionQuantityInStore = () => {
    const optionsQtyExistsInStore = optionQuantityStore.find(
      (item) => item.productId === id
    );
    const selectedQuantityNum = parseInt(selectedQuantity);
    const maxOptionQuantityDb = calculateTotalMaximumOfOptions(optionGroups);
    const maxQuantity = findMaxQuantityOfOptionsDb(optionGroups);

    const optionsData = buildOptionsData(
      optionGroups,
      maxOptionQuantityDb,
      maxQuantity,
      selectedQuantityNum
    );

    if (!optionsQtyExistsInStore) {
      setOptionsQuantityStore(optionsData);
    } else {
      const { totalOptionsAvailable } = optionsQtyExistsInStore;

      // New Store? maxQuantity of db = maxInitialQuantity of optionStore
      if (maxOptionQuantityDb == totalOptionsAvailable) {
        // find the current maximum of options left in store
        const maxQuantityStore =
          findMaxQuantityOptionStore(optionQuantityStore);

        updateRemainingMax(id, maxQuantityStore);
        reduceRemainingQuantity(id, selectedQuantityNum);

        // reduce options selected in store
        const hasRadioOptionValues = radioOptionValues.length > 0;
        const hasCheckboxOptionValues = checkboxOptionValues.length > 0;

        if (hasRadioOptionValues) {
          for (let i = 0; i < radioOptionValues.length; i++) {
            const currRadioOption = radioOptionValues[i];
            const { groupId, optionId } = currRadioOption;

            reduceOptionQuantity(id, groupId, optionId, selectedQuantityNum);
          }
        }

        if (hasCheckboxOptionValues) {
          for (let i = 0; i < checkboxOptionValues.length; i++) {
            const currOptionGroup = checkboxOptionValues[i];
            const { groupId, options } = currOptionGroup;

            for (let j = 0; j < options.length; j++) {
              const currOption = options[j];
              const { optionId } = currOption;

              reduceOptionQuantity(id, groupId, optionId, selectedQuantityNum);
            }
          }
        }
      } else {
        // Old Store?
      }
    }
  };

  const updateProductQuantityInStore = () => {
    const productExistsInStore = productsStore.find((item) => item.id === id);
    const selectedQuantityNum = parseInt(selectedQuantity);

    const updatedQuantity = quantity - selectedQuantityNum;
    const productData = {
      id,
      quantity: updatedQuantity,
      initialQuantity: quantity,
    };

    if (!productExistsInStore) {
      setProductsStore(productData);
    } else {
      const { id: productStoreId, initialQuantity } = productExistsInStore;

      // If product store is new
      if (quantity == initialQuantity) {
        reduceProductQuantity(id, selectedQuantityNum);
      } else {
        // If product store is old, we have to update the store from db

        const relatedCartItems = cart.filter((item) => item.productId === id);
        const totalQuantityOfItemInCart = relatedCartItems.reduce(
          (acc, curr) => acc + curr.quantity,
          0
        );

        if (quantity >= totalQuantityOfItemInCart) {
          productData.quantity =
            quantity - totalQuantityOfItemInCart - selectedQuantityNum;
        }

        removeProduct(productStoreId);
        setProductsStore(productData);
      }
    }
  };

  const structureOrderData = () => {
    const addToCartTempItemId = nanoid();

    const updatedDataStructureRadio = radioOptionValues.map((item) => {
      const {
        groupId,
        optionGroupName,
        optionName,
        price,
        pricePenny,
        selectionType,
        optionQuantity,
        optionId,
      } = item;

      const optionsDisplay = optionName + " (" + price + ")";

      const data = {
        selectionType,
        optionGroupName: optionGroupName ? optionGroupName : null,
        groupId,
        optionsDisplay,
        options: [
          {
            optionId,
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
        optionGroupName: optionGroupName ? optionGroupName : null,
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
        question,
        answer,
        isRequired,
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
      defaultImage,
      productId: id,
      addToCartTempItemId,
      setQuantityByProduct,
      productName: productName,
      pricePenny: itemTotalPenny,
      priceDisplay: itemTotal,
      quantity: parseInt(selectedQuantity),
      customNote: customerNote,
      orderOptionGroups,
      orderQuestionsAnswers,
      orderExampleImages,
      hasUnlimitedQuantity,
    };

    return addToCartProductData;
  };

  //Displays
  function displayOptions(optionGroups) {
    return (
      <div className="px-6">
        {optionGroups.map((group, index) => {
          const { id: groupId, selectionType } = group;
          if (selectionType === 0) {
            const findExistingRadioOptions = radioOptionValues.find(
              (item) => item.groupId == groupId
            );

            let radioCheckedOption;

            if (findExistingRadioOptions) {
              const { optionId } = findExistingRadioOptions;
              radioCheckedOption = optionId;
            }

            return (
              <RadioGroupComponent
                key={groupId}
                productId={id}
                radioCheckedOption={radioCheckedOption}
                currOption={group}
                handleOptionRadioGroupChange={handleOptionRadioGroupChange(
                  selectionType
                )}
                hasUnlimitedQuantity={hasUnlimitedQuantity}
                setQuantityByProduct={setQuantityByProduct}
              />
            );
          }

          if (selectionType === 1) {
            const findExistingCheckboxOptions = checkboxOptionValues.find(
              (item) => item.groupId == groupId
            );

            let checkedOptions = [];

            if (findExistingCheckboxOptions) {
              const { options } = findExistingCheckboxOptions;
              checkedOptions = [...options];
            }

            return (
              <CheckGroupComponent
                key={groupId}
                productId={id}
                maxOptionsQuantity={optionsQuantity}
                checkedOptions={checkedOptions}
                currOption={group}
                handleOptionCheckedGroupChange={handleOptionCheckedGroupChange(
                  selectionType
                )}
                hasUnlimitedQuantity={hasUnlimitedQuantity}
                setQuantityByProduct={setQuantityByProduct}
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
      const { id, question, isRequired } = item;

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
            onChange={handleCustomerQuestionChange(id, isRequired)}
            rows={1}
            className="border border-[color:var(--black-design-extralight)] focus:outline-[color:var(--black)] p-2 "
          />
        </div>
      );
    });
  }

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnackbar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  if (addedToCart) {
    return (
      <div className="flex flex-col items-center justify-center mt-28">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 relative aspect-square">
            <Image
              src={CheckmarkGif}
              alt="checkmark"
              fill
              priority
              className=" object-cover rounded"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <h4>Added to cart</h4>
        </div>
        <h2>{productName}</h2>
        {defaultImage ? (
          <div className={`w-28 h-28 relative aspect-square mt-2 mb-16`}>
            <Image
              src={defaultImage}
              alt="product image"
              fill
              priority
              className="object-cover snap-center rounded"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className={`w-28 h-28 relative aspect-square mt-2 mb-16`}>
            <Image
              src={"https://fl-1.cdn.flockler.com/embed/no-image.svg"}
              alt="product image"
              fill
              priority
              className="object-cover snap-center rounded"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <div className="">
          <Link
            href="/"
            className=" text-center px-4 flex justify-center rounded items-center h-10 border border-[color:var(--black-design-extralight)] font-light text-[color:var(--black-design-extralight)] w-full active:bg-[color:var(--gray-light-med)] "
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
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
        action={action}
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
        <div className="flex gap-2 snap-x overflow-x-scroll w-full md:grid md:grid-cols-2 lg:w-5/6 lg:mx-auto xl:w-3/4">
          {isSampleProduct ? (
            defaultImage ? (
              <div
                className={`min-w-full snap-center relative aspect-square md:col-span-1 `}
              >
                <Image
                  src={defaultImage}
                  alt="product image"
                  fill
                  priority
                  className="object-cover "
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            ) : (
              <div
                className={`min-w-full snap-center relative aspect-square md:col-span-1`}
              >
                <Image
                  src={"https://fl-1.cdn.flockler.com/embed/no-image.svg"}
                  alt="product image"
                  fill
                  priority
                  className="object-cover  rounded"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )
          ) : images.length > 0 ? (
            images.map((imgItem, index) => {
              const { isDefault, image, id } = imgItem;

              return (
                <div
                  key={id}
                  className={`min-w-full snap-center relative aspect-square ${
                    isDefault ? "md:col-span-1" : "md:col-span-1 "
                  }`}
                >
                  <Image
                    src={image}
                    alt="product image"
                    fill
                    priority
                    className="object-cover "
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              );
            })
          ) : (
            <div
              key={id}
              className={`min-w-full snap-center relative aspect-square`}
            >
              <Image
                src={"https://fl-1.cdn.flockler.com/embed/no-image.svg"}
                alt="product image"
                fill
                priority
                className="object-cover "
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
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
        {isSoldOut && (
          <h4 className="text-[color:var(--error)] px-6">Sold out</h4>
        )}
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
        <div className="relative px-6 pb-4 pt-3">
          <label
            htmlFor="quantitySelect"
            className="block mb-1 font-medium text-sm text-[color:var(--black-design-extralight)] "
            ref={selectRef}
          >
            {hasUnlimitedQuantity
              ? "Item Quantity:"
              : setQuantityByProduct
              ? "Item Quantity: (" + `${productQuantity.length}` + " in stock)"
              : "Item Quantity: (" + optionsQuantity.length + " in stock)"}
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
              : optionsQuantity.map((item, idx) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
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
              name={isLoading ? "Adding ..." : isSoldOut ? "Sold out" : "Add"}
              type="submit"
              disabled={isLoading || isSoldOut}
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

export default Product;

Product.getLayout = function getLayout(page) {
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
