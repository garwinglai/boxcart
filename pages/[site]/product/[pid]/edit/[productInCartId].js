import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import ShareIcon from "@mui/icons-material/Share";
import { IconButton, Rating } from "@mui/material";
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
import {
  useCartStore,
  useProductQuantityStore,
  useOptionsQuantityStore,
  useShopperStore,
} from "@/lib/store";
import Link from "next/link";
import CheckmarkGif from "@/public/videos/checkmark.gif";
import ReviewComponent from "@/components/storefront/reviews/ReviewComponent";

// generate item quantity constant to 100 values in an array from 1
const unlimitedQuantity = Array.from({ length: 100 }, (_, i) => i + 1);

function EditAddToCartProduct({ product }) {
  const { account, id: productId } = product || {};
  const { id: accountId, subdomain } = account || {};

  const setCartDetails = useCartStore((state) => state.setCartDetails);
  const cartStore = useCartStore((state) => {
    return state.store.find((store) => store.storeName === subdomain);
  });

  const { cart } = cartStore || {};

  const setCart = useCartStore((state) => state.setCart);
  const addSubtotal = useCartStore((state) => state.addSubtotal);
  const removeItemFromCart = useCartStore((state) => state.removeItemFromCart);
  const subtractSubtotal = useCartStore((state) => state.subtractSubtotal);

  const shopperAccount = useShopperStore((state) => state.shopperAccount);
  const productsStore = useProductQuantityStore((state) => state.products);
  const setProductsStore = useProductQuantityStore(
    (state) => state.setProducts
  );
  const removeProduct = useProductQuantityStore((state) => state.removeProduct);
  const optionQuantityStore = useOptionsQuantityStore((state) => state.options);
  const setOptionsQuantityStore = useOptionsQuantityStore(
    (state) => state.setOptions
  );
  const reduceRemainingQuantity = useOptionsQuantityStore(
    (state) => state.reduceRemainingQuantity
  );
  const updateOptionQuantity = useOptionsQuantityStore(
    (state) => state.updateOptionQuantity
  );
  const updateRemainingMax = useOptionsQuantityStore(
    (state) => state.updateRemainingMax
  );
  const updateRemainingOptions = useOptionsQuantityStore(
    (state) => state.updateRemainingOptions
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
    salePriceStr,
    productType,
    productTypeDisplay,
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
    taxCode,
  } = product;

  const [seconds, setSeconds] = useState(5);
  const [reviews, setReviews] = useState(product.reviews);
  const [beforeEditPricePenny, setBeforeEditPricePenny] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState(quantity);
  const [exampleImages, setExampleImages] = useState([]);
  const [itemTotal, setItemTotal] = useState(
    product.salePriceStr || product.salePriceStr !== ""
      ? product.salePriceStr
      : product.priceStr
  );
  const [itemTotalPenny, setItemTotalPenny] = useState(
    product.salePricePenny || product.salePricePenny !== null
      ? product.salePricePenny
      : product.priceIntPenny
  );
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

  const [isSoldOut, setIsSoldOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    isSnackbarOpen: false,
    snackbarMessage: "",
  });
  const [productQuantity, setProductQuantity] = useState(
    Array.from({ length: quantity }, (_, i) => i + 1)
  );
  const [optionsQuantity, setOptionsQuantity] = useState(
    Array.from({ length: quantity }, (_, i) => i + 1)
  );
  const [currentAddedToCartOptionIds, setCurrentAddedToCartOptionIds] =
    useState([]);
  const [totalQuantityOfItemInCart, setTotalQuantityOfItemInCart] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  const { isSnackbarOpen, snackbarMessage } = snackbar;

  // Show default image first
  const imgArr = images.sort((a, b) => b.isDefault - a.isDefault);

  const { back, query, push } = useRouter();
  const { productInCartId, site } = query;

  const selectRef = useRef(null);

  useEffect(() => {
    const productExistInSstore = productsStore.find((item) => item.id === id);
    let finalSelectedQuantity = 0;

    const currProductInCartToEdit = cart.find(
      (item) => item.addToCartTempItemId === productInCartId
    );

    if (!currProductInCartToEdit) {
      push(`/${site}`);
      return;
    }

    const { quantity: cartQuantity } = currProductInCartToEdit;

    if (productExistInSstore) {
      const { quantity: quantityStore, initialQuantity } = productExistInSstore;

      let quantityArray = [];

      // Store is old from cache, use quantity from db
      if (quantity != initialQuantity) {
        const findAllRelatedCartItmes = cart.filter(
          (item) => item.productId === id
        );

        const itemQuantityTotalInCart = findAllRelatedCartItmes.reduce(
          (acc, curr) => acc + curr.quantity,
          0
        );

        if (quantity >= itemQuantityTotalInCart) {
          const extraProductQuantity = quantity - itemQuantityTotalInCart;

          quantityArray = Array.from(
            { length: extraProductQuantity + cartQuantity },
            (_, i) => i + 1
          );
          finalSelectedQuantity = cartQuantity;
        } else {
          quantityArray = Array.from({ length: 0 }, (_, i) => i + 1);
          finalSelectedQuantity = 0;
        }
      } else {
        // Store is new, use quantity from store

        quantityArray = Array.from(
          { length: quantityStore + cartQuantity },
          (_, i) => i + 1
        );
        finalSelectedQuantity = cartQuantity;
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
      finalSelectedQuantity = cartQuantity;
    }

    setSelectedQuantity(finalSelectedQuantity);
  }, [productsStore, product, quantity, cart]);

  // This checks for maxQuantity of options, and displays the max quantity left between each option available.
  useEffect(() => {
    // calculate max option quantity to check if store && db align. If align = current store, if not, then stored values are old.
    const maxOptionQuantityDb = calculateTotalMaximumOfOptions(optionGroups);

    if (!hasUnlimitedQuantity && !setQuantityByProduct) {
      const findOptionQuantityStore = optionQuantityStore.find(
        (item) => item.productId === id
      );
      const currProductInCartToEdit = cart.find(
        (item) => item.addToCartTempItemId === productInCartId
      );
      const allRelatedProductsInCart = cart.filter(
        (item) =>
          item.productId === id && item.addToCartTempItemId !== productInCartId
      );

      if (!currProductInCartToEdit) {
        push("/");
        return;
      }

      const maxQuantity = findMaxQuantityOfOptionsDb(optionGroups);

      let quantityArr = [];
      let remainingMaxQuantity = 0;

      if (!findOptionQuantityStore) {
        quantityArr = Array.from({ length: maxQuantity }, (_, i) => i + 1);
      }

      const { quantity, orderOptionGroups } = currProductInCartToEdit;
      const orderOptionIds = [];

      orderOptionGroups.map((item) => {
        const { options } = item;
        options.map((option) => orderOptionIds.push(option.optionId));
      });

      // 1. find maxRemainingQuantity left in store - loop through store, add the quantities of this specific productToEdit back to options that isRequired. Then, look for maxQuantity of options left that is required, and update remainingMax store.
      for (let i = 0; i < optionQuantityStore.length; i++) {
        const currSet = optionQuantityStore[i];
        const { optionGroups, groupId } = currSet;
        for (let j = 0; j < optionGroups.length; j++) {
          const currGroup = optionGroups[j];
          const { isRequired, options } = currGroup;
          if (!isRequired) continue;

          for (let k = 0; k < options.length; k++) {
            const currOption = options[k];
            const { optionQuantityLeft, optionId } = currOption;

            if (orderOptionIds.includes(optionId.toString())) {
              const resetQuantity = optionQuantityLeft + quantity;

              if (remainingMaxQuantity < resetQuantity)
                remainingMaxQuantity = resetQuantity;

              continue;
            }
            if (remainingMaxQuantity < optionQuantityLeft)
              remainingMaxQuantity = optionQuantityLeft;
          }
        }
      }

      if (allRelatedProductsInCart.length > 0) {
        let totalQuantityOfProductInCart = 0;
        const relatedOrderOptionIds = [];

        for (let l = 0; l < allRelatedProductsInCart.length; l++) {
          const currProduct = allRelatedProductsInCart[l];

          const { quantity, orderOptionGroups } = currProduct;

          orderOptionGroups.map((item) => {
            const { options } = item;
            options.map((option) =>
              relatedOrderOptionIds.push(option.optionId)
            );
          });
          totalQuantityOfProductInCart += quantity;
        }
        remainingMaxQuantity - totalQuantityOfProductInCart;

        setTotalQuantityOfItemInCart(totalQuantityOfProductInCart);
        setCurrentAddedToCartOptionIds(relatedOrderOptionIds);
      }

      quantityArr = Array.from(
        { length: remainingMaxQuantity },
        (_, i) => i + 1
      );

      setOptionsQuantity(quantityArr);
      setSelectedQuantity(quantity);
    }
  }, [productsStore, product, optionQuantityStore, cart]);

  // Sets product info to edit
  useEffect(() => {
    setAddedToCart(false);
    const currProductInCartToEdit = cart.find(
      (item) => item.addToCartTempItemId === productInCartId
    );

    if (!currProductInCartToEdit) {
      push(`/${site}`);
      return;
    }

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
      const { optionName, price, pricePenny, optionQuantity, optionId } =
        options[0];

      const setToNull = optionQuantity === "null" ? null : optionQuantity;

      const data = {
        selectionType,
        groupId,
        optionId,
        optionGroupName,
        optionName,
        price,
        pricePenny,
        optionQuantity: setToNull,
      };

      return data;
    });

    setBeforeEditPricePenny(pricePenny);
    setRadioOptionValues(radioOptionGroupRestructure);
    setCheckboxOptionValues(checkboxOptionGroups);
    setCustomerNote(customNote);
    setItemTotal(priceDisplay);
    setItemTotalPenny(pricePenny);
    // setSelectedQuantity(quantity);
    setExampleImages(orderExampleImages);
    setBusinessQuestions(orderQuestionsAnswers);
  }, [productInCartId, product]);

  const getReviews = async (accountId, productId) => {
    const api = `/api/public/storefront/review/retrieve?accountId=${accountId}&productId=${productId}`;
    const res = await fetch(api, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { success, error, reviews } = await res.json();

    if (!success || error) {
      return handleOpenSnackbar("Couldn't load reviews.");
    }

    setReviews(reviews);
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

        // if (selectedOptionIds.includes(id.toString())) {
        //   const reducedQuantity = quantity - parseInt(selectedQuantity);

        //   if (maxQuantity < reducedQuantity) {
        //     maxQuantity = reducedQuantity;
        //   }
        //   continue;
        // }

        if (maxQuantity < quantity) maxQuantity = quantity;
      }
    }

    return maxQuantity;
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

  function handleBack() {
    push(`/${site}`);
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

    const productPricePenny = product.salePricePenny
      ? product.salePricePenny
      : product.priceIntPenny;
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
    setIsLoading(true);

    const requiredOptions = optionGroups.filter((item) => item.isRequired);
    const requiredQuestions = questions.filter((item) => item.isRequired);

    const requiredOptionGroupsLength = requiredOptions.length;

    // CHecks to ensure required options are selected
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

    if (!setQuantityByProduct) {
      let smallestRadioOptionQuantity;

      for (let i = 0; i < radioOptionValues.length; i++) {
        const { optionQuantity, optionName } = radioOptionValues[i];
        const optionQuantityInt = parseInt(optionQuantity);

        if (optionName === "none") continue;

        if (i === 0) {
          smallestRadioOptionQuantity = optionQuantityInt;
          continue;
        }

        if (optionQuantityInt < smallestRadioOptionQuantity) {
          smallestRadioOptionQuantity = optionQuantityInt;
        }
      }

      let smallestCheckboxQuantity;

      for (let i = 0; i < checkboxOptionValues.length; i++) {
        const { options } = checkboxOptionValues[i];

        for (let j = 0; j < options.length; j++) {
          const { optionQuantity } = options[j];
          const optionQuantityInt = parseInt(optionQuantity);

          if (i === 0 && j === 0) {
            smallestCheckboxQuantity = optionQuantityInt;
            continue;
          } else {
            if (optionQuantityInt < smallestCheckboxQuantity) {
              smallestCheckboxQuantity = optionQuantityInt;
            }
          }
        }
      }

      if (
        smallestRadioOptionQuantity &&
        smallestRadioOptionQuantity < selectedQuantity
      ) {
        handleOpenSnackbar("Not enough in stock.");
        smallestRadioOptionQuantity = null;
        setIsLoading(false);
        return;
      }

      if (
        smallestCheckboxQuantity &&
        smallestCheckboxQuantity < selectedQuantity
      ) {
        handleOpenSnackbar("Not enough in stock.");
        smallestCheckboxQuantity = null;
        setIsLoading(false);
        return;
      }
    }

    const addToCartProductData = structureOrderData();

    if (!hasUnlimitedQuantity && setQuantityByProduct) {
      updateProductQuantityInStore();
    }

    if (!hasUnlimitedQuantity && !setQuantityByProduct) {
      updateOptionsQuantityStore();
    }

    setAddedToCart(true);
    removeItemFromCart(subdomain, productInCartId);
    subtractSubtotal(subdomain, beforeEditPricePenny);
    addSubtotal(subdomain, itemTotalPenny);
    setCart(subdomain, addToCartProductData);
    setCartDetails(subdomain, { taxRateCalculated: false });
    setIsLoading(false);

    setTimeout(() => {
      setSeconds(4);
    }, 1000);
    setTimeout(() => {
      setSeconds(3);
    }, 2000);
    setTimeout(() => {
      setSeconds(2);
    }, 3000);
    setTimeout(() => {
      setSeconds(1);
    }, 4000);
    setTimeout(() => {
      push(`/${site}`);
    }, 5000);
  };

  const updateOptionsQuantityStore = () => {
    const findOptionQuantityStore = optionQuantityStore.find(
      (item) => item.productId === id
    );
    const currProductInCartToEdit = cart.find(
      (item) => item.addToCartTempItemId === productInCartId
    );

    const allRelatedProductsInCart = cart.filter(
      (item) =>
        item.productId === id && item.addToCartTempItemId !== productInCartId
    );

    const relatedorderOptionIds = [];

    if (allRelatedProductsInCart.length > 0) {
      for (let i = 0; i < allRelatedProductsInCart.length; i++) {
        const currProduct = allRelatedProductsInCart[i];

        const {
          quantity: relatedQuantity,
          orderOptionGroups: relatedOrderOptionGroups,
        } = currProduct;

        relatedOrderOptionGroups.map((item) => {
          const { options } = item;
          options.map((option) => {
            relatedorderOptionIds.push({
              optionId: option.optionId,
              quantity: relatedQuantity,
            });
          });
        });
      }
    }

    const checkedIds = [];
    checkboxOptionValues.map((item) => {
      return item.options.map((option) => checkedIds.push(option.optionId));
    });
    const radioOptionIds = radioOptionValues.map((item) => {
      return item.optionId;
    });

    if (!findOptionQuantityStore) {
      //TODO: set store if no store exists
      return;
    }

    const { quantity, orderOptionGroups } = currProductInCartToEdit;
    const orderOptionIds = [];
    let remainingMaxQuantity = 0;
    let remainingOptions = 0;

    orderOptionGroups.map((item) => {
      const { options } = item;
      options.map((option) => orderOptionIds.push(option.optionId));
    });

    const orderOptionIdsRemoved = orderOptionIds.filter((id) => {
      if (
        !checkedIds.includes(id.toString()) ||
        !radioOptionIds.includes(id.toString())
      ) {
        return id;
      }
    });

    // loop through optionStore - find the current options of this cart item, take the iniital quantity and subtract selectedQuantity. Find the new remainingMaxQuantity between all options that isRequired.
    for (let i = 0; i < optionQuantityStore.length; i++) {
      const currSet = optionQuantityStore[i];
      const { optionGroups } = currSet;
      for (let j = 0; j < optionGroups.length; j++) {
        const currGroup = optionGroups[j];
        const { groupId, options, isRequired } = currGroup;
        for (let k = 0; k < options.length; k++) {
          const currOption = options[k];
          const { optionQuantityLeft, optionId, initialOptionQuantity } =
            currOption;

          if (checkedIds.includes(optionId.toString())) {
            let updatedQuantity = initialOptionQuantity - selectedQuantity;
            // 3. update options quantity
            // as initialQuantity - selectedQuantity, update the optionQuantityLeft in store
            for (let l = 0; l < relatedorderOptionIds.length; l++) {
              const currRelatedOption = relatedorderOptionIds[l];
              const { optionId: relatedOptionId, quantity } = currRelatedOption;

              if (relatedOptionId == optionId) {
                updatedQuantity =
                  initialOptionQuantity - quantity - selectedQuantity;
              } else {
                updatedQuantity = initialOptionQuantity - selectedQuantity;
              }
            }

            updateOptionQuantity(id, groupId, optionId, updatedQuantity);
            remainingOptions += updatedQuantity;

            if (!isRequired) continue;
            if (remainingMaxQuantity < updatedQuantity)
              remainingMaxQuantity = updatedQuantity;

            continue;
          }

          if (radioOptionIds.includes(optionId.toString())) {
            let updatedQuantity = initialOptionQuantity - selectedQuantity;
            // 3. update options quantity
            // as initialQuantity - selectedQuantity, update the optionQuantityLeft in store
            for (let l = 0; l < relatedorderOptionIds.length; l++) {
              const currRelatedOption = relatedorderOptionIds[l];
              const { optionId: relatedOptionId, quantity } = currRelatedOption;

              if (relatedOptionId == optionId) {
                updatedQuantity =
                  initialOptionQuantity - quantity - selectedQuantity;
              } else {
                updatedQuantity = initialOptionQuantity - selectedQuantity;
              }
            }

            updateOptionQuantity(id, groupId, optionId, updatedQuantity);
            remainingOptions += updatedQuantity;

            if (!isRequired) continue;
            if (remainingMaxQuantity < updatedQuantity)
              remainingMaxQuantity = updatedQuantity;

            continue;
          }

          if (
            orderOptionIdsRemoved.length > 0 &&
            orderOptionIdsRemoved.includes(optionId.toString())
          ) {
            // todo: have ot check if related product inc artk dont update that one
            const updatedRemovedOptionQuantity = optionQuantityLeft + quantity;

            updateOptionQuantity(
              id,
              groupId,
              optionId,
              updatedRemovedOptionQuantity
            );
          }

          remainingOptions += optionQuantityLeft;
          if (!isRequired) continue;
          if (remainingMaxQuantity < optionQuantityLeft)
            remainingMaxQuantity = optionQuantityLeft;
        }
      }
    }

    // 1. update remainingMax
    // 2. update optionsRemainingTotal
    //as looping through optionStore and making above calculations, add up the totalQuantityAvailable for all options, and update optionsRemainingTotal in store.
    updateRemainingOptions(id, remainingOptions);
    updateRemainingMax(id, remainingMaxQuantity);
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
      const similarProductsInCart = cart.filter(
        (item) => item.productId === id
      );

      const filterForAdditionalProduct = similarProductsInCart.filter(
        (item) => item.addToCartTempItemId !== productInCartId
      );

      let totalQuantityOfProductInCart = 0;

      for (let i = 0; i < filterForAdditionalProduct.length; i++) {
        const currProduct = filterForAdditionalProduct[i];
        const { quantity } = currProduct;
        totalQuantityOfProductInCart += quantity;
      }

      if (totalQuantityOfProductInCart > 0) {
        productData.quantity =
          quantity - totalQuantityOfProductInCart - selectedQuantityNum;
      }

      removeProduct(id);
      setProductsStore(productData);
    }
  };

  const structureOrderData = () => {
    const addToCartTempItemId = productInCartId;

    const pricePenny = parseInt(parseFloat(itemTotal.slice(1)) * 100);

    const updatedDataStructureRadio = radioOptionValues.map((item) => {
      const {
        groupId,
        optionGroupName,
        optionName,
        optionId,
        price,
        pricePenny,
        selectionType,
        optionQuantity,
      } = item;

      const optionsDisplay = optionName + " (" + price + ")";

      const data = {
        groupId,
        selectionType,
        optionGroupName: optionGroupName ? optionGroupName : null,
        optionsDisplay,
        options: [
          {
            optionName,
            price,
            pricePenny,
            optionQuantity,
            optionId,
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
      productId: id,
      productTaxCode: taxCode ? taxCode : account.defaultProductTaxCode,
      addToCartTempItemId,
      setQuantityByProduct,
      defaultImage,
      productType,
      productTypeDisplay,
      productName: productName,
      pricePenny,
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
          const { id, selectionType } = group;

          if (selectionType === 0) {
            const findExistingRadioOption = radioOptionValues.find(
              (item) => item.groupId == id
            );

            let selectedValue = "";
            let radioCheckedOption;

            if (findExistingRadioOption) {
              const {
                optionName,
                price,
                groupId,
                optionQuantity,
                optionGroupName,
                optionId,
              } = findExistingRadioOption;

              radioCheckedOption = optionId;

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
                totalQuantityOfItemInCart={totalQuantityOfItemInCart}
                currentAddedToCartOptionIds={currentAddedToCartOptionIds}
                selectedValue={selectedValue}
                hasUnlimitedQuantity={hasUnlimitedQuantity}
                radioCheckedOption={radioCheckedOption}
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
                totalQuantityOfItemInCart={totalQuantityOfItemInCart}
                currentAddedToCartOptionIds={currentAddedToCartOptionIds}
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
          name="customerNote"
          id="customerNote"
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
            name="questions"
            id="questions"
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
          <h4>Cart updated</h4>
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
            href={`/${site}`}
            className=" text-center px-4 flex justify-center rounded items-center h-10 border border-[color:var(--black-design-extralight)] font-light text-[color:var(--black-design-extralight)] w-full active:bg-[color:var(--gray-light-med)] "
          >
            Continue Shopping
          </Link>
        </div>
        <p className="mt-4">
          Back to shop in
          <b> {seconds}</b>
          ...
        </p>
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
              Home
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
            defaultImage ? (
              <div
                className={`min-w-full relative aspect-square md:col-span-2`}
              >
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
              <div
                className={`min-w-full relative aspect-square md:col-span-2`}
              >
                <Image
                  src={"https://fl-1.cdn.flockler.com/embed/no-image.svg"}
                  alt="product image"
                  fill
                  priority
                  className="object-cover snap-center rounded"
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
          ) : (
            <div key={id} className={`min-w-full relative aspect-square`}>
              <Image
                src={"https://fl-1.cdn.flockler.com/embed/no-image.svg"}
                alt="product image"
                fill
                priority
                className="object-cover snap-center"
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
        {isSoldOut ? (
          <h4 className="text-[color:var(--sale-text)] px-6">Sold out</h4>
        ) : (
          salePriceStr &&
          salePriceStr !== "" && (
            <h4 className="text-[color:var(--sale-text)] px-6">Sale</h4>
          )
        )}
        <div className="flex flex-col gap-2 px-6 pb-4 border-b border-[color:var(--gray-light)]">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">{productName}</h3>
              <div className="flex items-center gap-2">
                <Rating
                  name="read-only"
                  value={parseInt(product.rating)}
                  readOnly
                  sx={{ fontSize: "0.75rem" }}
                />
                <p className="text-[color:var(--gray-text)] font-extralight text-xs">
                  ({product.reviewCount})
                </p>
              </div>
            </div>
            <p className="">
              {salePriceStr && salePriceStr !== "" ? (
                <span>
                  <span className=" line-through text-xs font-extralight mr-2 text-gray-500">
                    {priceStr}
                  </span>
                  <span>{salePriceStr}</span>
                </span>
              ) : (
                <span className="font-medium">{priceStr}</span>
              )}
            </p>
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
        <div className="relative px-6 pb-4 mt-3">
          <label
            htmlFor="quantitySelect"
            className="block mb-1 font-medium text-sm text-[color:var(--black-design-extralight)] "
            ref={selectRef}
          >
            {hasUnlimitedQuantity
              ? "Item Quantity:"
              : setQuantityByProduct
              ? "Item Quantity: (" + `${productQuantity.length}` + " in stock)"
              : "Item Quantity: (" + `${optionsQuantity.length}` + " in stock)"}
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
        <div className="md:hidden">
          <ReviewComponent
            getReviews={getReviews}
            product={product}
            account={account}
            reviews={reviews}
            handleOpenSnackbar={handleOpenSnackbar}
            shopperAccount={shopperAccount}
          />
        </div>
        <div className="sticky bottom-0 p-4 mt-20 flex flex-col gap-2 bg-white border-t border-[color:var(--gray-light-med)] md:border-none md:mt-8">
          <div className="h-10">
            <ButtonPrimaryStorefront
              name={isLoading ? "Updating ..." : "Update"}
              type="submit"
              disabled={isLoading}
            />
          </div>

          <Link
            href={`/${site}`}
            className=" text-center flex justify-center items-center h-10 border border-[color:var(--black-design-extralight)] font-light text-[color:var(--black-design-extralight)] w-full active:bg-[color:var(--gray-light-med)] "
          >
            Continue Shopping
          </Link>
        </div>
        <div className="hidden md:block">
          <ReviewComponent
            getReviews={getReviews}
            product={product}
            account={account}
            reviews={reviews}
            handleOpenSnackbar={handleOpenSnackbar}
            shopperAccount={shopperAccount}
          />
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
  try {
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
        reviews: {
          orderBy: {
            createdAt: "desc",
          },
        },
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
  } catch (error) {
    console.log("error", error);
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
}
