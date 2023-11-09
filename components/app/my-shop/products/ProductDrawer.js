import React, { useState, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import product_tag_icon from "@/public/images/icons/product_tag_icon.png";
import Image from "next/image";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { IOSSwitch } from "@/components/global/switches/IOSSwitch";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import ButtonFilter from "@/components/global/buttons/ButtonFilter";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Snackbar from "@mui/material/Snackbar";
import SaveCancelButtons from "../../design/SaveCancelButtons";
import {
  createProductClient,
  updateProductClient,
} from "@/helper/client/api/inventory/product-schema";
import ButtonSecondary from "@/components/global/buttons/ButtonSecondary";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import {
  updateIsChecklistComplete,
  updateProductVerifiedChecklist,
} from "@/helper/client/api/checklist";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "@/firebase/fireConfig";
import { nanoid } from "@/utils/generateId";
import { useAccountStore, useChecklistStore } from "@/lib/store";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "0.25rem",
};

function ProductDrawer({
  state,
  toggleDrawer,
  product,
  categories,
  isCreateProduct,
  isEditProduct,
  accountId,
  updateProductList,
  handleOpenSnackbarGlobal,
  getAllProducts,
}) {
  const account = useAccountStore((state) => state.account);
  const { subdomain } = account;
  const checklistStore = useChecklistStore((state) => state.checklist);
  const setChecklistStore = useChecklistStore((state) => state.setChecklist);

  const [isSaveProductLoading, setIsSaveProductLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    isSnackbarOpen: false,
    snackbarMessage: "",
  });
  const [hasUnlimitedQuantity, setHasUnlimitedQuantity] = useState(
    product ? product.hasUnlimitedQuantity : true
  );
  const [showOptionInputs, setShowOptionInputs] = useState({
    optionGroupPositions: [],
    optionGroupTitles: [],
    optionPositions: [],
    groupOfOptions: [],
  });
  const [groupOptionSettings, setGroupOptionSettings] = useState([]);
  const [customerQuestions, setCustomerQuestions] = useState(
    product ? product.questions : []
  );
  const [customerQuestionInput, setCustomerQuestionInput] = useState("");
  const [variantPhotos, setVariantPhotos] = useState([]);
  const [productPhotos, setProductPhotos] = useState(
    product
      ? product.images
        ? product.images.length > 0
          ? product.images
          : []
        : []
      : []
  );
  const [defaultImageValues, setDefaultImageValues] = useState(null);
  const [productValues, setProductValues] = useState({
    productName: product ? product.productName : "",
    description: product ? product.description : "",
    priceInt: product ? (product.priceIntPenny / 100).toFixed(2) : "",
    priceStr: product ? product.priceStr : "",
    defaultImgStr: product ? product.defaultImageFileName : "",
    imgArrJson: product ? product.imgArrJson : "",
    quantity: product ? (!product.quantity ? 0 : product.quantity) : 1,
    setQuantityByProduct: product ? product.setQuantityByProduct : true,
    id: product ? product.id : "",
    isSampleProduct: product ? product.isSampleProduct : false,
    relatedCategories: product ? product.relatedCategories : [],
    enableCustomNote: product
      ? product.enableCustomNote
        ? product.enableCustomNote
        : false
      : false,
    enableCustomerImageUploads: product
      ? product.enableCustomerImageUploads
        ? product.enableCustomerImageUploads
        : false
      : false,
  });
  const [allCategories, setAllCategories] = useState(
    categories ? categories : []
  );
  const [selectedCategory, setselectedCategory] = useState("");
  const [initialRelatedProducts, setInitialRelatedProducts] = useState(
    product ? product.relatedCategories : []
  );
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [holdTempCategoriesToAdd, setHoldTempCategoriesToAdd] = useState([]);
  const [removedCategories, setRemovedCategories] = useState([]);
  const [newCategories, setNewCategories] = useState([]);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [removedQuestions, setRemovedQuestions] = useState([]);
  const [removedOptions, setRemovedOptions] = useState([]);
  const [removedOptionGroups, setRemovedOptionGroups] = useState([]);
  const [newQuestionsAdded, setNewQuestionsAdded] = useState([]);

  const {
    productName,
    description,
    priceInt,
    priceStr,
    defaultImgStr,
    imgArrJson,
    quantity,
    setQuantityByProduct,
    id,
    isSampleProduct,
    relatedCategories,
    enableCustomNote,
    enableCustomerImageUploads,
  } = productValues;

  const {
    optionGroupPositions,
    optionGroupTitles,
    optionPositions,
    groupOfOptions,
  } = showOptionInputs;
  const { isSnackbarOpen, snackbarMessage } = snackbar;

  // useEffect to structure optionGroup variables from product edit

  useEffect(() => {
    if (isCreateProduct) return;
    if (!product) return;

    setOptions(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setOptions = (updatedProduct) => {
    const { optionGroups } = updatedProduct ? updatedProduct : product;
    const optionsArr = [];

    for (let i = 0; i < optionGroups.length; i++) {
      const currOption = optionGroups[i];
      const { options } = currOption;

      optionsArr.push(...options);
    }

    // optionGroupPosition
    const oGPositions = optionGroups.map((item) => item.id);

    // optionGroupTitle
    const oGTitles = optionGroups.map((item) => ({
      position: item.id,
      title: item.optionGroupName,
      groupId: item.id,
    }));

    // optionGroupSettings
    const groupSettings = optionGroups.map((item) => {
      const {
        id: position,
        isRequired,
        isRequiredDisplay,
        selectionType,
        selectionDisplay,
      } = item;

      const data = {
        position,
        isRequired,
        isRequiredDisplay,
        selectionType,
        selectionDisplay,
      };

      return data;
    });

    // optionPosition
    const oPositions = optionGroups.map((item) => {
      const { id: groupPosition } = item;

      const dataArr = [];

      for (let i = 0; i < optionsArr.length; i++) {
        const currOption = optionsArr[i];
        const { id: optionPosition, optionGroupId } = currOption;

        if (optionGroupId === groupPosition) {
          dataArr.push({ groupPosition, optionPosition });
        }
      }

      return dataArr;
    });
    const oPositionsArr = oPositions.flat();

    // groupOfOptions
    const groupOptions = optionGroups.map((item) => {
      const { id: groupPosition } = item;

      const dataArr = [];

      for (let i = 0; i < optionsArr.length; i++) {
        const currOption = optionsArr[i];
        const {
          id: optionPosition,
          optionGroupId,
          optionName,
          priceStr,
          quantity,
        } = currOption;

        if (groupPosition === optionGroupId) {
          dataArr.push({
            groupPosition,
            optionPosition,
            optionName,
            price: priceStr.slice(1),
            quantity,
            optionId: optionPosition,
            groupId: groupPosition,
          });
        }
      }

      return dataArr;
    });
    const groupOptionsArr = groupOptions.flat();

    const optionInputs = {
      optionGroupPositions: oGPositions,
      optionGroupTitles: oGTitles,
      optionPositions: oPositionsArr,
      groupOfOptions: groupOptionsArr,
    };

    setGroupOptionSettings(groupSettings);
    setShowOptionInputs(optionInputs);
  };

  const handleCategoryNameChange = (e) => {
    const { value } = e.target;

    // Change value to have uppercase first letter
    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
    setNewCategoryInput(capitalizedValue);
  };

  const handleOpenCategoryModal = () => setOpenCategoryModal(true);
  const handleCloseCategoryModal = () => setOpenCategoryModal(false);

  const handleCancelNewCategory = () => {
    setNewCategoryInput("");
    setOpenCategoryModal(false);
  };

  const handleAddNewCategory = () => {
    if (!newCategoryInput) {
      handleOpenSnackbar("Enter a category name");
      return;
    }

    const newCategory = {
      id: null,
      categoryName: newCategoryInput,
    };

    // if the value is already in the allCategories array, return
    const allCategoriesArr = allCategories.map((item) => item.categoryName);
    if (allCategoriesArr.includes(newCategoryInput)) {
      handleOpenSnackbar("Category already exists");
      return;
    }

    const relatedCategoriesArr = relatedCategories.map(
      (item) => item.categoryName
    );

    if (relatedCategoriesArr.includes(newCategoryInput)) {
      handleOpenSnackbar("Category already exists");
      return;
    }

    const categoryData = {
      categoryName: newCategoryInput,
    };

    setAllCategories((prev) => [...prev, newCategory]);
    setHoldTempCategoriesToAdd((prev) => [...prev, newCategory]);
    setNewCategoryInput("");
    setProductValues((prev) => ({
      ...prev,
      relatedCategories: [...prev.relatedCategories, categoryData],
    }));
    setOpenCategoryModal(false);
  };

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

  // create openproductimagemode function
  const handleOpenProductImageModal = () => {
    // setOpenProductImageModal(true);
  };

  const handleIsQtyUnlimitedChange = () => {
    setHasUnlimitedQuantity((prev) => !prev);
    setProductValues((prev) => ({
      ...prev,
      setQuantityByProduct: true,
      quantity: 0,
    }));
  };

  const handleAddCustomerQuestions = (e) => {
    if (!customerQuestionInput) return;

    if (isEditProduct) {
      const initialQuestions = product.questions.map((item) => item.question);
      const data = {
        question: customerQuestionInput,
        isRequired: true,
      };

      if (!initialQuestions.includes(customerQuestionInput)) {
        // if customerQuesetionInput is not already in newQuestionsAdded, add it to newQuestionsAdded
        if (!newQuestionsAdded.includes(customerQuestionInput)) {
          setNewQuestionsAdded((prev) => [...prev, data]);
        }
      }
    }

    // removedQuestions is an array of {id, question}, map through removed Question to see if it includes customerQuestionInput
    const removedQuestionsArr = removedQuestions.map((item) => item.question);

    if (removedQuestionsArr.includes(customerQuestionInput)) {
      const newRemovedQuestions = removedQuestions.filter(
        (item) => item.question !== customerQuestionInput
      );

      setRemovedQuestions(newRemovedQuestions);
    }

    // Create an array of all the questions within customerQuestions
    const customerQuestionsArr = customerQuestions.map((item) => item.question);
    // check if customerQuestionsArr includes customerQuestionInput, if it does, return
    if (customerQuestionsArr.includes(customerQuestionInput)) {
      handleOpenSnackbar("Question already exists");
      setCustomerQuestionInput("");
      return;
    }

    if (isEditProduct) {
      const initialCustomerQuestionsArr = product.questions.map(
        (item) => item.question
      );

      // if customerQuestionInput is in initialCustomerQuestionsArr, add the original item to setCustomerQUestions
      if (initialCustomerQuestionsArr.includes(customerQuestionInput)) {
        const initialCustomerQuestions = product.questions.filter(
          (item) => item.question === customerQuestionInput
        );

        setCustomerQuestions((prev) => [...prev, ...initialCustomerQuestions]);
        setCustomerQuestionInput("");
        return;
      }
    }

    setCustomerQuestions((prev) => [
      ...prev,
      { question: customerQuestionInput, isRequired: true },
    ]);

    setCustomerQuestionInput("");
  };

  const handleCustomerQuestionInputChange = (e) => {
    const { value } = e.target;

    // Value is a string, capitalize first letter only, even if it is a sentence.
    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);

    setCustomerQuestionInput(capitalizedValue);
  };

  const handleQuestionRequired = (currQuestion) => (e) => {
    // check if currQuestion is in newQuestionsAdded, if it is, change isRequired to !isRequired
    if (isEditProduct) {
      const newQuestionsAddedArr = newQuestionsAdded.map((item) => {
        if (item.question === currQuestion) {
          return { ...item, isRequired: !item.isRequired };
        }

        return item;
      });

      setNewQuestionsAdded(newQuestionsAddedArr);
    }

    const updatedQuestionArray = customerQuestions.map((item) => {
      if (item.question === currQuestion)
        return { ...item, isRequired: !item.isRequired };

      return item;
    });

    setCustomerQuestions(updatedQuestionArray);
  };

  const handleCustomNoteChange = (e) => {
    const { checked } = e.target;

    setProductValues((prev) => ({ ...prev, enableCustomNote: checked }));
  };

  const handleCustomerUploadSampleImagesChange = (e) => {
    const { checked } = e.target;

    setProductValues((prev) => ({
      ...prev,
      enableCustomerImageUploads: checked,
    }));
  };

  const handlePhotoFileChange = (e) => {
    const { name, files } = e.target;
    const filesLen = files.length;
    const productPhotosLen = productPhotos.length;

    const totalImages = filesLen + productPhotosLen;
    if (totalImages > 8) {
      handleOpenSnackbar("Maximum of 8 images allowed");
      return;
    }
    if (files.length < 1) return;

    const imgData = [];
    let defaultFileName;
    let defaultImageData;

    const productPhotosArr = productPhotos.map((item) => {
      const fName = item.imgFileName ? item.imgFileName : item.fileName;
      return fName;
    });

    for (let i = 0; i < files.length; i++) {
      const currFile = files[i];
      const fileName = currFile.name;

      if (productPhotosArr.includes(fileName)) {
        continue;
      }

      const isDefault = productPhotosLen === 0 && i === 0;
      const image = URL.createObjectURL(currFile);

      const currImageData = {
        image,
        fileName,
        imageFile: currFile,
        isDefault,
      };

      if (isDefault) {
        defaultFileName = fileName;
        defaultImageData = currImageData;
      }

      imgData.push(currImageData);
    }

    setProductPhotos((prev) => [...prev, ...imgData]);

    if (defaultFileName) {
      setProductValues((prev) => ({
        ...prev,
        defaultImgStr: defaultFileName,
      }));
      setDefaultImageValues(imgData);
    }
  };

  const removeImageClick = (file) => (e) => {
    const { image, isDefault } = file;

    const photoArrayAfterRemoval = productPhotos.filter(
      (currFiles) => currFiles.image !== image
    );

    if (productPhotos.length === 1) {
      setProductPhotos(photoArrayAfterRemoval);
      return;
    }

    if (isDefault) {
      const newDefault = photoArrayAfterRemoval[0];
      newDefault.isDefault = true;
      const newDefaultFileName = newDefault.imgFileName
        ? newDefault.imgFileName
        : newDefault.fileName;

      setDefaultImageValues(newDefault);
      setProductValues((prev) => ({
        ...prev,
        defaultImgStr: newDefaultFileName,
      }));

      // photoArrayAfterRemoval[0].isDefault = true;
    }

    setProductPhotos(photoArrayAfterRemoval);
  };

  const handleAddOptionGroup = () => {
    if (optionGroupPositions.length === 0) {
      setShowOptionInputs((prev) => ({ ...prev, optionGroupPositions: [0] }));
      setGroupOptionSettings((prev) => [
        {
          position: 0,
          isRequired: true,
          isRequiredDisplay: "required",
          selectionType: 0,
          selectionDisplay: "select one",
        },
      ]);
      return;
    }

    const highestNumber = Math.max(...optionGroupPositions);
    const higherNumber = highestNumber + 1;

    setShowOptionInputs((prev) => ({
      ...prev,
      optionGroupPositions: [...prev.optionGroupPositions, higherNumber],
    }));
    setGroupOptionSettings((prev) => [
      ...prev,
      {
        position: higherNumber,
        isRequired: true,
        isRequiredDisplay: "required",
        selectionType: 0,
        selectionDisplay: "select one",
      },
    ]);
  };

  const handleAddVariantClick = (position) => (e) => {
    // * Throw error if title is empty
    const optionGroupTitleLen = optionGroupTitles.length;

    // Get position of group title
    const currPositionTitleArr = optionGroupTitles.filter((item) => {
      if (position === item.position) return item.title;
    });

    const currPositionTitleLen = currPositionTitleArr.length;

    if (optionGroupTitleLen < 1 || currPositionTitleLen < 1) {
      handleOpenSnackbar("Add a title for the option group first");
      return;
    }

    // Check if optionGroupTitles has duplicates. If it does, throw error
    const optionGroupTitleArr = optionGroupTitles.map((item) => item.title);
    const optionGroupTitleSet = new Set(optionGroupTitleArr);

    if (optionGroupTitleArr.length !== optionGroupTitleSet.size) {
      handleOpenSnackbar("Duplicate group title.");
      return;
    }

    const optionPositionArrPerGroupPosition = optionPositions.filter(
      (item) => item.groupPosition === position
    );

    const optionPositionsArrLen = optionPositionArrPerGroupPosition.length;

    // if there are no option positions, then the first option position is 0
    if (optionPositionsArrLen === 0) {
      const data = {
        groupPosition: position,
        optionPosition: 0,
      };

      setShowOptionInputs((prev) => ({
        ...prev,
        optionPositions: [...optionPositions, data],
      }));
      return;
    }

    // If there is option positions, but no options per group, then the first option position is 0 for the group
    const groupPositionsArr = optionPositions.map((item) => item.groupPosition);
    if (!groupPositionsArr.includes(position)) {
      const data = {
        groupPosition: position,
        optionPosition: 0,
      };

      setShowOptionInputs((prev) => ({
        ...prev,
        optionPositions: [...optionPositions, data],
      }));
      return;
    }

    // If options exists in the position, increment that position
    const existingOptionInCurrPosition = optionPositions.filter(
      (item) => item.groupPosition === position
    );
    const optionPositionsArr = existingOptionInCurrPosition.map(
      (item) => item.optionPosition
    );

    const highestNumber = Math.max(...optionPositionsArr);
    const higherNumber = highestNumber + 1;

    const data = {
      groupPosition: position,
      optionPosition: higherNumber,
    };

    setShowOptionInputs((prev) => ({
      ...prev,
      optionPositions: [...optionPositions, data],
    }));
  };

  const handleRemoveOptionGroup = (e) => {
    //value is current position
    const { value } = e.target;

    // remove the option group from the array
    // this is so that the option group number is unique
    const newFilteredOptionGroupArr = optionGroupPositions.filter(
      (item) => item != value
    );

    // filter optionGroupTitles to remove the options with the same position as value
    const newFilteredOptionGroupTitles = optionGroupTitles.filter(
      (item) => item.position != value
    );

    // filter groupOfOptions to remove the options wiht the same position
    const newGroupOfOptions = groupOfOptions.filter(
      (item) => item.groupPosition != value
    );

    // filter optionPositions
    const newOptionPositions = optionPositions.filter(
      (item) => item.groupPosition != value
    );

    // Remove option settings
    const newGroupOptionSettings = groupOptionSettings.filter(
      (item) => item.position != value
    );

    setGroupOptionSettings(newGroupOptionSettings);

    if (isEditProduct) {
      // check optionGroupTitles to see if value matches any of the positions, if it does, check if groupId exists. If groupId exists, add the groupId to removedOptionGroups
      const newRemovedOptionGroups = optionGroupTitles.filter((item) => {
        if (item.position == value) {
          if (item.groupId) return item.groupId;
        }
      });

      if (newRemovedOptionGroups.length > 0) {
        const newRemovedOptionGroupsArr = newRemovedOptionGroups.map(
          (item) => item.groupId
        );

        setRemovedOptionGroups((prev) => [
          ...prev,
          ...newRemovedOptionGroupsArr,
        ]);
      }
    }

    setShowOptionInputs((prev) => ({
      ...prev,
      groupOfOptions: newGroupOfOptions,
      optionGroupPositions: newFilteredOptionGroupArr,
      optionGroupTitles: newFilteredOptionGroupTitles,
      optionPositions: newOptionPositions,
    }));
  };

  const handleOptionGroupChange = (position) => (e) => {
    const { value } = e.target;
    const optionGroupTitleLen = optionGroupTitles.length;

    if (optionGroupTitleLen === 0) {
      setShowOptionInputs((prev) => ({
        ...prev,
        optionGroupTitles: [{ position, title: value }],
      }));
      return;
    }

    const hasPosition = optionGroupTitles.map((item) => {
      if (item.position === position) return "exists";
      return "notExist";
    });

    if (hasPosition.includes("exists")) {
      setShowOptionInputs((prev) => ({
        ...prev,
        optionGroupTitles: optionGroupTitles.map((item, idx) => {
          if (position === item.position) {
            return { ...item, title: value };
          }

          return item;
        }),
      }));
      return;
    }

    setShowOptionInputs((prev) => ({
      ...prev,
      optionGroupTitles: [...optionGroupTitles, { position, title: value }],
    }));
  };

  const handleOptionGroupSettingsChange = (position) => (e) => {
    const { name, value } = e.target;
    let selectionType;
    let selectionDisplay;
    let isRequired;
    let isRequiredDisplay;

    if (name === "selectionQuantity") {
      selectionType = value === "one" ? 0 : 1;
      selectionDisplay = value === "one" ? "select one" : "select many";

      setGroupOptionSettings((prev) =>
        prev.map((item) => {
          if (item.position === position) {
            return {
              ...item,
              selectionType,
              selectionDisplay,
            };
          }

          return item;
        })
      );
    }

    if (name === "selectionRequirement") {
      isRequired = value === "required" ? true : false;
      isRequiredDisplay = value === "required" ? "required" : "optional";

      setGroupOptionSettings((prev) =>
        prev.map((item) => {
          if (item.position === position) {
            return { ...item, isRequired, isRequiredDisplay };
          }

          return item;
        })
      );
    }
  };

  const removeOptionPosition = (item) => (e) => {
    const { groupPosition, optionPosition } = item;

    const newOptionPositions = optionPositions.filter((item) => {
      if (item.groupPosition === groupPosition) {
        if (item.optionPosition === optionPosition) return false;
      }
      return true;
    });

    // filter through groupOfOptions to remove the options with the same position
    const newGroupOfOptions = groupOfOptions.filter((item) => {
      if (item.groupPosition === groupPosition) {
        if (item.optionPosition === optionPosition) return false;
      }
      return true;
    });

    if (isEditProduct) {
      // check groupOfOptions to see if value matches any of the positions, if it does, check if optionId exists. If optionId exists, check if optionId equals optionPosition, if it does, add option to removedOptions

      const newRemovedOptions = groupOfOptions.filter((item) => {
        if (item.groupPosition == groupPosition) {
          if (item.optionId == optionPosition) return item.optionId;
        }
      });

      if (newRemovedOptions.length > 0) {
        const newRemovedOptionsArr = newRemovedOptions.map(
          (item) => item.optionId
        );

        setRemovedOptions((prev) => [...prev, ...newRemovedOptionsArr]);
      }
    }

    setShowOptionInputs((prev) => ({
      ...prev,
      optionPositions: newOptionPositions,
      groupOfOptions: newGroupOfOptions,
    }));
  };

  const handleOptionChange = (optionPositions) => (e) => {
    const { optionPosition, groupPosition } = optionPositions;
    const { name, value } = e.target;

    const groupOfOptionsLen = groupOfOptions.length;

    if (groupOfOptionsLen === 0) {
      setShowOptionInputs((prev) => ({
        ...prev,
        groupOfOptions: [{ ...optionPositions, [name]: value }],
      }));
      return;
    }
    let groupId = null;

    const hasGroupPosition = groupOfOptions.map((item) => {
      if (item.groupPosition !== groupPosition) return "notExist";
      if (item.groupId) groupId = item.groupId;
      return "exists";
    });

    const hasPosition = groupOfOptions.map((item) => {
      if (item.groupPosition === groupPosition) {
        if (item.optionPosition !== optionPosition) return "notExist";

        return "exists";
      }
    });

    if (hasGroupPosition.includes("exists")) {
      if (hasPosition.includes("exists")) {
        setShowOptionInputs((prev) => ({
          ...prev,
          groupOfOptions: groupOfOptions.map((item) => {
            const data = {
              ...item,
              [name]: value,
            };

            if (
              groupPosition === item.groupPosition &&
              optionPosition === item.optionPosition
            ) {
              return data;
            }

            return item;
          }),
        }));
        return;
      }

      // if groupPosition exists but optionPosition does not exist, we have to add new [name]:value pair to the same groupPosition
      const data = {
        ...optionPositions,
        groupId,
        [name]: value,
      };

      setShowOptionInputs((prev) => ({
        ...prev,
        groupOfOptions: [...groupOfOptions, data],
      }));
      return;
    }

    // if groupPosition does not exist, we have to add new name:value pair to groupPosition
    setShowOptionInputs((prev) => ({
      ...prev,
      groupOfOptions: [
        ...groupOfOptions,
        { ...optionPositions, [name]: value },
      ],
    }));
  };

  const handleRemoveQuestion = (item) => () => {
    const { id, question } = item;

    // check if question is in newQuestionsAdded, if it is, remove question from newQuestionsAdded
    if (isEditProduct) {
      const newQuestionsAddedArr = newQuestionsAdded.filter(
        (item) => item.question !== question
      );
      setNewQuestionsAdded(newQuestionsAddedArr);
    }

    // if edit, check if question is in product.questions, if it is, add question to removedQuestions
    if (isEditProduct) {
      const initialQuestionsArr = product.questions.map((item) => item.id);

      if (initialQuestionsArr.includes(id)) {
        setRemovedQuestions((prev) => [...prev, item]);
      }
    }

    const newQuestionsArr = customerQuestions.filter(
      (i) => i.question !== question
    );
    setCustomerQuestions(newQuestionsArr);
  };

  const handleInputCategoryChange = (e) => {
    const { value } = e.target;

    if (!value) return;

    const parsedJsonValue = JSON.parse(value);
    const { id, categoryName } = parsedJsonValue;

    // if the value is already in the relatedCategories array, return
    const relatedCategoriesArr = relatedCategories.map(
      (item) => item.categoryName
    );
    if (relatedCategoriesArr.includes(categoryName)) return;

    // check if categoryName is in newCategories, if it is, filter from newCategories
    const newCategoriesArr = newCategories.filter(
      (item) => item !== categoryName
    );

    setNewCategories(newCategoriesArr);
    setselectedCategory("");
    setProductValues((prev) => ({
      ...prev,
      relatedCategories: [...prev.relatedCategories, parsedJsonValue],
    }));
  };

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "priceInt") {
      // Create a regex check to make sure it's price format, else open snackbar with message
      const regex = /^$|^(?!0\d)\d*(\.\d{1,2})?$/;
      const isPriceFormat = regex.test(value);

      if (!isPriceFormat) {
        return;
      }

      setProductValues((prev) => ({ ...prev, priceInt: value }));
    }

    if (name === "setQuantity") {
      if (value === "product") {
        setProductValues((prev) => ({
          ...prev,
          setQuantityByProduct: true,
          quantity: 0,
        }));
      }

      if (value === "option") {
        setProductValues((prev) => ({
          ...prev,
          setQuantityByProduct: false,
          quantity: 0,
        }));
      }

      return;
    }

    if (name === "quantity") {
      const regex = /^(?!0)\d*$/;
      const isQuantityFormat = regex.test(value);

      if (!isQuantityFormat) {
        setProductValues((prev) => ({ ...prev, quantity: 0 }));
        return;
      }
    }

    setProductValues((prev) => ({ ...prev, [name]: value }));
  };

  const removeAddedCategory = (category) => (e) => {
    const { categoryName, id } = category;

    // Filter out removed value from relatedCategories
    const newRelatedCategories = relatedCategories.filter(
      (item) => item.categoryName !== categoryName
    );

    setProductValues((prev) => ({
      ...prev,
      relatedCategories: newRelatedCategories,
    }));

    // check if categoryName is in holdTempCategoriesToAdd, if it is, add categoryName back to newCategories
    const holdTempCategoriesToAddArr = holdTempCategoriesToAdd.map(
      (item) => item.categoryName
    );

    if (holdTempCategoriesToAddArr.includes(categoryName)) {
      setNewCategories((prev) => [...prev, categoryName]);
    }

    // check if categoryName is in initialRelatedProducts, if it is, add categoryName to removedCategories
    const initialRelatedProductsArr = initialRelatedProducts.map(
      (item) => item.categoryName
    );

    if (initialRelatedProductsArr.includes(categoryName)) {
      setRemovedCategories((prev) => [...prev, id]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (productPhotos.length === 0) {
      handleOpenSnackbar("Please upload at least one photo.");
      return;
    }

    setIsSaveProductLoading(true);

    // Create regex to make sure quantity doesn't have decimal places
    if (setQuantityByProduct) {
      const regex = /^\d+$/;
      const isQuantityFormat = regex.test(quantity);
      if (!isQuantityFormat) {
        handleOpenSnackbar("Quantity must be a whole number");
        setIsSaveProductLoading(false);
        return;
      }
    }

    // Check if optionGroupTitles has duplicates. If it does, throw error
    const optionGroupTitleArr = optionGroupTitles.map((item) => item.title);
    const optionGroupTitleSet = new Set(optionGroupTitleArr);

    if (optionGroupTitleArr.length !== optionGroupTitleSet.size) {
      handleOpenSnackbar("Duplicate group title.");
      setIsSaveProductLoading(false);
      return;
    }

    const productSchema = structureProductSchema();
    const questionSchema = structureQuestionSchema();
    const structuredOptions = structureOptionGroupSchema();

    if (!structuredOptions) {
      setIsSaveProductLoading(false);
      return;
    } // this is for if priceError or quantityError, return.

    const { optionGroupSchema, optionSchema } = structuredOptions;
    const optionGroupSchemaLength = optionGroupSchema.length;

    if (optionGroupSchemaLength > 0) {
      // get the optionGroupNames from optionGroupSchema and check if the optionGroupName exists in optionSchema. If not, open snackbar with message
      const optionGroupNames = optionGroupSchema.map(
        (item) => item.optionGroupName
      );
      const optionGroupNamesInOptionSchema = optionSchema.map(
        (item) => item.optionGroupName
      );

      const missingVariants = optionGroupNames.filter(
        (item) => !optionGroupNamesInOptionSchema.includes(item)
      );

      if (missingVariants.length > 0) {
        handleOpenSnackbar(
          "Missing variants. Add variants or remove option group."
        );
        setIsSaveProductLoading(false);
        return;
      }
    }

    if (!setQuantityByProduct && optionGroupSchemaLength === 0) {
      handleOpenSnackbar("Update quantity settings.");
      setIsSaveProductLoading(false);
      return;
    }

    let productObject = {
      productSchema,
      optionGroupSchema,
      optionSchema,
      questionSchema,
    };

    if (isCreateProduct) {
      let uploadProductImageError = false;
      const productImageUrls = [];
      const fireStorageId = nanoid();

      for (let i = 0; i < productPhotos.length; i++) {
        const currPhoto = productPhotos[i];
        const { fileName, imageFile, isDefault } = currPhoto;

        const { photoUrl, error } = await saveProductImagesToFirebase(
          fileName,
          imageFile,
          subdomain,
          fireStorageId
        );

        if (error) {
          uploadProductImageError = true;
        }

        const photoData = {
          fileName,
          isDefault,
          image: photoUrl,
          fireStorageId,
        };

        productImageUrls.push(photoData);
      }

      if (uploadProductImageError) {
        handleOpenSnackbarGlobal("Error uploading images.");
        // TODO: delete photos that were already stored into firebase before error.
        return;
      }

      productObject.imageSchema = productImageUrls;
      productObject.productSchema.defaultImage = productImageUrls[0].image;
      productObject.productSchema.fireStorageId = fireStorageId;

      const resProductCreate = await createProductClient(productObject);
      const { success, value } = resProductCreate;
      const { createdProduct, createdCategories } = value;

      if (!success) {
        for (let i = 0; i < productPhotos.length; i++) {
          const currPhoto = productPhotos[i];
          const { fileName } = currPhoto;

          await deleteProductImagesFromFirebase(
            fileName,
            subdomain,
            fireStorageId
          );
        }
        handleOpenSnackbar("Error creating product.");
        setIsSaveProductLoading(false);
        return;
      }

      if (createdCategories && createdCategories.length > 0) {
        setAllCategories((prev) => [...prev, ...createdCategories]);
      }

      handleOpenSnackbarGlobal("Product created.");
      unsetAllStates();
    }

    if (isEditProduct) {
      const removedPhotos = product.images.filter((item) => {
        const productPhotosArr = productPhotos.map((item) => item.image);
        if (!productPhotosArr.includes(item.image)) return item;
      });

      if (removedPhotos.length > 0) {
        for (let i = 0; i < removedPhotos.length; i++) {
          const currPhoto = removedPhotos[i];
          const { imgFileName: fileName, fireStorageId } = currPhoto;

          await deleteProductImagesFromFirebase(
            fileName,
            subdomain,
            fireStorageId
          );
          // ? Need to catch error, but not detrimental, still let pass.
        }
      }

      const newProductPhotos = productPhotos.filter((item) => {
        if (!item.fireStorageId) return item;
      });

      let uploadProductImageError = false;
      const newProductImages = [];
      const { fireStorageId } = product;

      if (newProductPhotos.length > 0) {
        for (let i = 0; i < newProductPhotos.length; i++) {
          const currPhoto = newProductPhotos[i];
          const { fileName, imageFile, isDefault } = currPhoto;

          const { photoUrl, error } = await saveProductImagesToFirebase(
            fileName,
            imageFile,
            subdomain,
            fireStorageId
          );

          if (error) {
            uploadProductImageError = true;
          }

          const photoData = {
            imgFileName: fileName,
            isDefault,
            image: photoUrl,
            fireStorageId,
          };
          newProductImages.push(photoData);
        }

        productObject.imageSchema = newProductImages;
      }

      if (defaultImageValues) {
        if (newProductImages.length === 0) {
          newProductImages.push(defaultImageValues);

          productObject.productSchema.defaultImage = defaultImageValues.image;
          productObject.updatedImages = [defaultImageValues];
        } else {
          // check if default image is in productImageUrls, if is not, add it to productImageUrls
          const defaultImageFileName = defaultImageValues.imgFileName
            ? defaultImageValues.imgFileName
            : defaultImageValues.fileName;

          const newProductImagesFileNames = newProductImages.map(
            (item) => item.imgFileName
          );

          if (!newProductImagesFileNames.includes(defaultImageFileName)) {
            productObject.productSchema.defaultImage = defaultImageValues.image;
            productObject.updatedImages = [defaultImageValues];
          } else {
            // Loop through newProductImages to find the default image and set to object below.
            for (let i = 0; i < newProductImages.length; i++) {
              const currPhoto = newProductImages[i];
              const { imgFileName, image, isDefault } = currPhoto;
              if (isDefault) {
                productObject.productSchema.defaultImage = image;
              }
            }
          }
        }
      }

      if (uploadProductImageError) {
        handleOpenSnackbarGlobal("Error uploading images.");
        // TODO: remove images that were uploaded already
        return;
      }

      productObject.removedImages = removedPhotos;

      const resProductUpdate = await updateProductClient(productObject);
      const { success, value } = resProductUpdate;
      const { updatedProduct } = value;

      if (!success) {
        if (newProductPhotos.length > 0) {
          for (let i = 0; i < newProductPhotos.length; i++) {
            const currPhoto = newProductPhotos[i];
            const { fileName } = currPhoto;

            await deleteProductImagesFromFirebase(
              fileName,
              subdomain,
              fireStorageId
            );
          }
        }

        handleOpenSnackbar("Error updating product.");
        setIsSaveProductLoading(false);
        return;
      }

      handleOpenSnackbarGlobal("Product updated.");
      unsetAllStates(updatedProduct);
      updateProductList(updatedProduct);
    }
    setIsSaveProductLoading(false);
    getAllProducts(accountId);
    updateChecklist();
    toggleDrawer("right", false)(e);
  };

  const deleteProductImagesFromFirebase = async (
    fileName,
    subdomain,
    fireStorageId
  ) => {
    const photoRef = ref(
      storage,
      `account/${subdomain}/products/${fireStorageId}/productImages/${fileName}`
    );

    try {
      await deleteObject(photoRef);
    } catch (error) {
      console.log("error deleting images from firebase:", error);
    }
  };

  const saveProductImagesToFirebase = async (
    fileName,
    imageFile,
    subdomain,
    fireStorageId
  ) => {
    const photoRef = ref(
      storage,
      `account/${subdomain}/products/${fireStorageId}/productImages/${fileName}`
    );

    try {
      await uploadBytes(photoRef, imageFile);
    } catch (error) {
      console.log("error uploading product image:", error);
      return { error };
    }

    try {
      const photoUrl = await getDownloadURL(photoRef);
      return { photoUrl };
    } catch (error) {
      console.log("error getting download url");
      return { error };
    }
  };

  const updateChecklist = async () => {
    const {
      id,
      accountId,
      isProductsUploaded,
      isEmailVerified,
      isDeliverySet,
      isPaymentsSet,
      hasLogo,
      hasBanner,
      requireAvailability,
      isAvailabilitySet,
      isChecklistComplete,
    } = checklistStore;

    if (isChecklistComplete || isProductsUploaded) return;

    setChecklistStore({ isProductsUploaded: true });

    const { success, value, error } = updateProductVerifiedChecklist(accountId);

    if (!success) {
      console.log("error updating checklist for product:", error);
      //TODO: handle error for not being able to update checklist.
    }

    if (
      isEmailVerified &&
      isDeliverySet &&
      isPaymentsSet &&
      ((requireAvailability && isAvailabilitySet) || !requireAvailability)
    ) {
      const checklistCompleted = true;
      updateIsChecklistComplete(accountId, checklistCompleted);
      setChecklistStore({ isChecklistComplete: checklistCompleted });
    }
  };

  const unsetAllStates = async (updatedProduct) => {
    if (isCreateProduct) {
      setProductValues({
        productName: "",
        description: "",
        priceInt: "",
        priceStr: "",
        defaultImgStr: "",
        imgArrJson: "",
        quantity: 1,
        setQuantityByProduct: true,
        id: "",
        isSampleProduct: false,
        relatedCategories: [],
        enableCustomNote: false,
        enableCustomerImageUploads: false,
      });

      setShowOptionInputs({
        optionGroupPositions: [],
        optionGroupTitles: [],
        optionPositions: [],
        groupOfOptions: [],
      });

      setCustomerQuestions([]);
      setVariantPhotos([]);
      setProductPhotos([]);
      setCustomerQuestionInput("");
      setHasUnlimitedQuantity(true);
      setAllCategories(categories ? categories : []);
      setGroupOptionSettings([
        {
          position: 0,
          isRequired: true,
          selectionType: 0,
          selectionDisplay: "select one",
        },
      ]);
    }

    if (isEditProduct) {
      // reset all states to original values
      const {
        productName,
        description,
        priceIntPenny,
        priceStr,
        defaultImgStr,
        defaultImageFileName,
        imgArrJson,
        quantity,
        setQuantityByProduct,
        id,
        isSampleProduct,
        relatedCategories,
        questions,
        hasUnlimitedQuantity,
        optionGroups,
        images,
        enableCustomNote,
        enableCustomerImageUploads,
      } = updatedProduct ? updatedProduct : product;

      setProductValues({
        productName,
        description,
        priceInt: priceIntPenny / 100,
        priceStr: priceStr.slice(1),
        defaultImgStr: defaultImageFileName,
        imgArrJson,
        quantity,
        setQuantityByProduct,
        id,
        isSampleProduct,
        relatedCategories,
        enableCustomNote: enableCustomNote ? enableCustomNote : false,
        enableCustomerImageUploads: enableCustomerImageUploads
          ? enableCustomerImageUploads
          : false,
      });

      setOptions(updatedProduct);
      setCustomerQuestions(questions);
      setVariantPhotos([]);
      setProductPhotos(images ? (images.length > 0 ? images : []) : []);
      setCustomerQuestionInput("");
      setHasUnlimitedQuantity(hasUnlimitedQuantity);
      setAllCategories(categories ? categories : []);
      setDefaultImageValues(null);

      const groupSettings = optionGroups.map((item) => {
        const {
          id: position,
          isRequired,
          isRequiredDisplay,
          selectionType,
          selectionDisplay,
        } = item;

        const data = {
          position,
          isRequired,
          isRequiredDisplay,
          selectionType,
          selectionDisplay,
        };

        return data;
      });

      setGroupOptionSettings(groupSettings);
    }

    setRemovedCategories([]);
    setRemovedQuestions([]);
    setNewQuestionsAdded([]);
    setRemovedOptions([]);
    setRemovedOptionGroups([]);
    setNewCategories([]);
    setHoldTempCategoriesToAdd([]);
  };

  const structureProductSchema = () => {
    const priceIntPenny = parseInt((priceInt * 100).toFixed(2));
    let priceValue = priceInt.toString();

    if (priceValue.includes(".") && priceValue.split(".")[1].length === 1) {
      priceValue += "0";
    }

    if (!priceValue.includes(".")) {
      priceValue += ".00";
    }

    const convertToPriceStr = `$${priceValue}`;

    const productSchema = {
      id,
      accountId,
      isSampleProduct: false,
      productName,
      description,
      defaultImageFileName: defaultImgStr,
      priceIntPenny,
      priceStr: convertToPriceStr,
      quantity: quantity ? (quantity === 0 ? 0 : parseInt(quantity)) : 0,
      hasUnlimitedQuantity,
      setQuantityByProduct,
      relatedCategories,
      removedCategories,
      newCategories,
      removedQuestions,
      newQuestionsAdded,
      removedOptionGroups,
      removedOptions,
      enableCustomNote,
      enableCustomerImageUploads,
    };

    return productSchema;
  };
  const structureImageSchema = (images) => {
    const photoDatatArr = [];

    for (let i = 0; i < productPhotos.length; i++) {
      const currPhoto = productPhotos[i];

      const { fileName, imageFile, isDefault } = currPhoto;
      const newPhotoData = { fileName, imageFile, isDefault };

      photoDatatArr.push(newPhotoData);
    }

    return photoDatatArr;
  };

  const structureOptionGroupSchema = () => {
    const optionGroupSchema = optionGroupTitles.map((group) => {
      const { position, title: optionGroupName, groupId } = group;

      const data = {
        productName,
        optionGroupName,
        groupId,
      };

      for (let i = 0; i < groupOptionSettings.length; i++) {
        const currSettings = groupOptionSettings[i];
        const {
          selectionType,
          selectionDisplay,
          isRequired,
          isRequiredDisplay,
        } = currSettings;

        if (position === currSettings.position) {
          data.selectionType = selectionType;
          data.selectionDisplay = selectionDisplay;
          data.isRequired = isRequired;
          data.isRequiredDisplay = isRequiredDisplay;
        }
      }

      if (isEditProduct) {
        data.groupPosition = position;
      }

      return data;
    });

    let groupOfOptionsInsertGroupTitles = [];

    for (let i = 0; i < groupOfOptions.length; i++) {
      let currOption = groupOfOptions[i];
      const { groupPosition } = currOption;

      for (let j = 0; j < optionGroupTitles.length; j++) {
        const currGroup = optionGroupTitles[j];
        const { position, title } = currGroup;

        if (groupPosition === position) currOption.optionGroupName = title;
      }
      groupOfOptionsInsertGroupTitles.push(currOption);
    }

    let priceError = false; // invalid price value.
    let quantityError = false; // has decimal in qty.

    const optionSchema = groupOfOptions.map((group) => {
      const {
        groupPosition,
        optionName,
        optionPosition,
        price,
        quantity,
        optionGroupName,
        groupId,
        optionId,
      } = group;

      let priceIntPenny = 0;
      let priceStr = "$0.00";

      if (price && priceStr !== "") {
        const regex = /^$|^(?!0\d)\d*(\.\d{1,2})?$/;
        const isPriceFormat = regex.test(price);

        if (!isPriceFormat) priceError = true;
        priceIntPenny = price
          ? parseInt((parseFloat(price) * 100).toFixed(2))
          : 0;

        let priceValue = price;
        if (priceValue.includes(".") && priceValue.split(".")[1].length === 1) {
          priceValue += "0";
        }

        if (!priceValue.includes(".")) {
          priceValue += ".00";
        }

        if (priceIntPenny !== 0) {
          priceStr = `$${priceValue}`;
        }
      }

      let qty = 0;

      if (quantity && quantity !== 0 && quantity !== "") {
        if (!setQuantityByProduct) {
          // const regex = /^(?!0)\d*$/;
          const regex = /^\d*$/;
          const isQuantityFormat = regex.test(quantity);

          if (!isQuantityFormat) quantityError = true;

          qty = parseInt(quantity);
        }
      }

      if (isCreateProduct) {
        return {
          optionName,
          optionGroupName,
          priceStr,
          priceIntPenny,
          quantity: qty === 0 ? null : qty,
        };
      }

      if (isEditProduct) {
        return {
          optionName,
          optionGroupName,
          priceStr,
          priceIntPenny,
          quantity: qty === 0 ? null : qty,
          groupId: groupPosition,
          optionId,
        };
      }
    });

    if (priceError) {
      handleOpenSnackbar("Invalid prices in options.");

      return null;
    }

    if (quantityError) {
      handleOpenSnackbar("Invalid quantity in options.");

      return null;
    }

    return { optionGroupSchema, optionSchema };
  };

  const structureQuestionSchema = () => {
    const questionSchema = customerQuestions.map((questionObj) => {
      return {
        ...questionObj,
        productName,
      };
    });

    return questionSchema;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleCloseDrawer = (e) => {
    toggleDrawer("right", false)(e);
    unsetAllStates();
    setIsSaveProductLoading(false);
  };

  // * Display
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

  function getOptionTitle(position) {
    const titleArr = optionGroupTitles.filter((item) => {
      if (item.position === position) return item.title;
    });

    let title = "";

    if (titleArr.length !== 0) {
      title = titleArr[0].title;
    }

    return title;
  }

  const getOptionValueName = (item) => {
    const { groupPosition, optionPosition } = item;
    let name = "";

    for (let i = 0; i < groupOfOptions.length; i++) {
      const currOption = groupOfOptions[i];
      const {
        groupPosition: groupId,
        optionPosition: optionId,
        optionName,
      } = currOption;

      if (groupPosition === groupId && optionPosition === optionId) {
        if (optionName) name = optionName;
      }
    }

    return name;
  };

  function getOptionValuePrice(item) {
    const { groupPosition, optionPosition } = item;

    let pricing = "";

    for (let i = 0; i < groupOfOptions.length; i++) {
      const currOption = groupOfOptions[i];
      const {
        groupPosition: groupId,
        optionPosition: optionId,
        price,
      } = currOption;

      if (groupPosition === groupId && optionPosition === optionId) {
        pricing = price;
      }
    }

    return pricing;
  }

  function getOptionvalueQuantity(item) {
    const { groupPosition, optionPosition } = item;

    let quantityValue = "";

    for (let i = 0; i < groupOfOptions.length; i++) {
      const currOption = groupOfOptions[i];
      const {
        groupPosition: groupId,
        optionPosition: optionId,
        quantity,
      } = currOption;

      if (groupPosition === groupId && optionPosition === optionId) {
        if (quantity != 0) {
          quantityValue = quantity;
        }
      }
    }

    return quantityValue;
  }

  return (
    <Drawer anchor={"right"} open={state["right"]} onClose={handleCloseDrawer}>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        action={action}
      />
      <form
        onSubmit={handleSave}
        className=" w-screen bg-[color:var(--gray-light)] min-h-screen p-4 flex flex-col gap-4 overflow-y-scroll pb-28 md:w-[60vw] lg:w-[45vw] xl:w-[35vw]"
      >
        <div className="flex justify-between items-center">
          <span className="flex gap-4 items-center">
            <Image
              src={product_tag_icon}
              alt="bardcode icon"
              className="w-[3rem] h-[3rem]"
            />
            <h2>Product details:</h2>
          </span>
          <button
            className="flex text-[color:var(--third-dark)] "
            onClick={handleCloseDrawer}
            type="button"
          >
            <ChevronLeftIcon />
            <p>close</p>
          </button>
        </div>
        <div className="rounded p-4 w-full shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)] bg-white relative">
          <div className="w-full relative ">
            <span className="flex items-end justify-between gap-2">
              <div className="flex items-center gap-2">
                <h4 className="text-black font-semibold text-sm ">Photos:</h4>
                <p className="text-xs text-[color:var(--gray)] font-light">
                  8 images max.
                </p>
              </div>
              <p className="text-xs text-[color:var(--gray)] font-light">
                * png or jpeg files only.
              </p>
            </span>

            <div className="flex overflow-x-scroll w-full mt-4 gap-2 pb-4">
              {productPhotos.length !== 0 ? (
                productPhotos.map((photo, idx) => {
                  const { image, fileName, isDefault } = photo;

                  return (
                    <div
                      key={idx}
                      className={`relative h-[8rem] min-w-[8rem] inline-block`}
                    >
                      <Image
                        src={image}
                        alt="product image"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover rounded inline-block"
                      />
                      <div className="absolute bg-[color:var(--black-design-extralight)] rounded-full right-1 top-1 opacity-70">
                        <IconButton onClick={removeImageClick(photo)}>
                          <CloseIcon
                            sx={{ color: "var(--white)", fontSize: "1rem" }}
                          />
                        </IconButton>
                      </div>
                      {isDefault && (
                        <p className="absolute font-extralight bottom-1 left-1 text-white rounded text-sm px-1 bg-[color:var(--black-design-extralight)]">
                          Default
                        </p>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="h-32 w-32 border roudned flex justify-center items-center text-[color:var(--gray-text)] text-sm font-light">
                  Image
                </div>
              )}
            </div>
            <span className="flex justify-between">
              <p className="text-sm text-[color:var(--gray)] font-light">
                {productPhotos.length} images uploaded.
              </p>
              {productPhotos.length < 8 && (
                <div>
                  <span>
                    <span className="bg-[color:var(--primary)] py-1 rounded ">
                      <label
                        htmlFor="productImageInput"
                        className=" -translate-y-[2px] bg-white text-[color:var(--primary)] border border-[color:var(--primary)] rounded py-1 px-2 active:bg-[color:var(--priamry-dark)] active:text-white hover:cursor-pointer"
                      >
                        Upload
                      </label>
                    </span>
                    <input
                      onChange={handlePhotoFileChange}
                      value=""
                      type="file"
                      name="productImage"
                      id="productImageInput"
                      className="hidden"
                      multiple
                    />
                  </span>
                </div>
              )}
            </span>
          </div>
          <span className="flex flex-col gap-2 mt-4">
            <div className="flex items-center gap-2">
              <label
                htmlFor="title"
                className="text-black font-medium text-base "
              >
                Product name:
              </label>
              <span>
                <p className="font-extralight text-xs">(required)</p>
              </span>
            </div>
            <input
              type="text"
              onKeyDown={handleKeyDown}
              required
              id="name"
              value={productName}
              name="productName"
              onChange={handleProductInputChange}
              className={`transition-colors duration-300 border border-[color:var(--gray-light-med)] rounded w-full py-2 focus:outline-none focus:border focus:border-[color:var(--primary-light-med)] indent-4 font-light text-xs`}
            />
          </span>
          <span className="flex flex-col gap-2 mt-4">
            <div className="flex items-center gap-2">
              <label
                htmlFor="description"
                className="text-black font-medium text-base "
              >
                Description:
              </label>
              <span>
                <p className="font-extralight text-xs">(required)</p>
              </span>
            </div>
            <textarea
              required
              type="text"
              id="description"
              value={description}
              name="description"
              onChange={handleProductInputChange}
              className={`transition-colors duration-300 border border-[color:var(--gray-light-med)] rounded w-full py-2 px-4 focus:outline-none focus:border focus:border-[color:var(--primary-light-med)]  font-light text-xs overflow-hidden`}
            />
          </span>
          <span className="flex flex-col gap-2 mt-4 relative">
            <div className="flex items-center gap-2">
              <label
                htmlFor="price"
                className="text-black font-medium text-base "
              >
                Price:
              </label>
              <span>
                <p className="font-extralight text-xs">(required)</p>
              </span>
            </div>
            <span className="text-[color:var(--gray-light-med)] text-sm font-light absolute bottom-2 left-4">
              $
            </span>
            {/* //create an input for price so that it only has 2 decimals */}
            <input
              onKeyDown={handleKeyDown}
              required
              type="number"
              name="priceInt"
              id="price"
              value={priceInt}
              onChange={handleProductInputChange}
              className={`transition-colors duration-300 border border-[color:var(--gray-light-med)] rounded w-full py-2 focus:outline-none focus:border focus:border-[color:var(--primary-light-med)] indent-8 font-light text-xs`}
            />
          </span>
          <span className="flex flex-col gap-2 mt-6 relative">
            <div className="flex justify-between items-center">
              <label
                htmlFor="price"
                className="text-black font-medium text-base flex gap-2 items-center"
              >
                Categories:
                <span>
                  <p className="font-extralight text-xs">(optional)</p>
                </span>
              </label>
              <div>
                <ButtonFilter
                  type="button"
                  handleClick={handleOpenCategoryModal}
                  name="+ Category"
                />
                <Modal
                  open={openCategoryModal}
                  onClose={handleCloseCategoryModal}
                  aria-labelledby="Create category modal"
                >
                  <Box sx={style}>
                    <div className="">
                      <span className="flex flex-col gap-2">
                        <label
                          htmlFor="newCategoryInput"
                          className="text-black font-semibold text-sm "
                        >
                          New category:
                        </label>
                        <input
                          onKeyDown={handleKeyDown}
                          type="text"
                          required
                          autoFocus
                          id="newCategoryInput"
                          name="newCategoryInput"
                          value={newCategoryInput}
                          onChange={handleCategoryNameChange}
                          className={`transition-colors duration-300 border border-[color:var(--primary)] rounded w-full py-2 focus:outline-none focus:border focus:border-[color:var(--primary-light-med)] indent-4 font-light text-xs`}
                        />
                      </span>
                      <div className="flex gap-2 mt-4">
                        <div className="w-1/2">
                          <ButtonSecondary
                            type="button"
                            name="Cancel"
                            handleClick={handleCancelNewCategory}
                          />
                        </div>
                        <div className="w-1/2">
                          <ButtonPrimary
                            type="button"
                            name="Add"
                            handleClick={handleAddNewCategory}
                          />
                        </div>
                      </div>
                    </div>
                  </Box>
                </Modal>
              </div>
            </div>
            <select
              name="category"
              id="category"
              value={selectedCategory}
              onChange={handleInputCategoryChange}
              className={`transition-colors duration-300 border border-[color:var(--gray-light-med)] rounded w-full py-2 px-4 focus:outline-none focus:border focus:border-[color:var(--primary-light-med)]  font-light text-xs overflow-hidden`}
            >
              {allCategories.length === 0 ? (
                <option value="">No categories added ...</option>
              ) : (
                <React.Fragment>
                  <option value="">Saved categories ...</option>
                  {allCategories.map((category) => (
                    <option
                      key={category.categoryName}
                      value={JSON.stringify(category)}
                    >
                      {category.categoryName}
                    </option>
                  ))}
                </React.Fragment>
              )}
            </select>
          </span>

          <div className="mt-4">
            <p className="font-medium text-sm">Added categories:</p>
            <ul>
              {relatedCategories.length !== 0 ? (
                relatedCategories.map((category) => (
                  <div
                    key={category.categoryName}
                    className="flex justify-between items-center"
                  >
                    <li
                      key={category.id}
                      className="text-xs list-disc font-light ml-12 md:text-sm"
                    >
                      {category.categoryName}
                    </li>
                    <IconButton onClick={removeAddedCategory(category)}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </div>
                ))
              ) : (
                <p className="font-extralight text-xs mt-1 ml-2">None added.</p>
              )}
            </ul>
          </div>

          <span className="flex flex-col gap-2 mt-6 relative">
            <span className="flex justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="quantity"
                    className="text-black font-medium text-base "
                  >
                    Quantity:
                  </label>
                  <span>
                    <p className="font-extralight text-xs">(optional)</p>
                  </span>
                </div>

                <p className="text-xs font-extralight">
                  If toggle is off, product has unlimited quantity.
                </p>
              </div>

              <IOSSwitch
                checked={!hasUnlimitedQuantity}
                onChange={handleIsQtyUnlimitedChange}
              />
            </span>
            {!hasUnlimitedQuantity && (
              <React.Fragment>
                {/* <ul className="my-2">
                  <li className="text-xs list-disc font-light ml-9 md:text-sm">
                    Set the quantity for your product, or for different product options.
                  </li>
                </ul> */}
                <FormControl>
                  <RadioGroup
                    aria-labelledby="radio buttons for setting quantity"
                    name="setQuantity"
                    value={setQuantityByProduct ? "product" : "option"}
                    onChange={handleProductInputChange}
                    sx={{ marginLeft: "1rem" }}
                  >
                    <FormControlLabel
                      value="product"
                      control={<Radio size="small" color="secondary" />}
                      label={
                        <p className="text-[color:var(--black-design)] text-sm">
                          How much quantity for this product?
                        </p>
                      }
                    />
                    {setQuantityByProduct && (
                      <input
                        onKeyDown={handleKeyDown}
                        required
                        type="number"
                        name="quantity"
                        id="quantity"
                        value={quantity}
                        onChange={handleProductInputChange}
                        placeholder="total quantity for this product ..."
                        className={`transition-colors duration-300 border border-[color:var(--gray-light-med)] rounded w-full py-2 px-4 my-1 focus:outline-none focus:border focus:border-[color:var(--primary-light-med)]  font-light text-xs overflow-hidden`}
                      />
                    )}
                    <FormControlLabel
                      value="option"
                      control={<Radio size="small" color="secondary" />}
                      label={
                        <p className="text-[color:var(--black-design)] text-sm">
                          Input quantity for each product option below.
                        </p>
                      }
                    />
                  </RadioGroup>
                </FormControl>
              </React.Fragment>
            )}
          </span>
        </div>
        <div>
          <div
            className={` p-4 w-full shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)] bg-white rounded `}
          >
            <span className="flex items-center justify-between">
              <div className="w-2/3">
                <div className="flex items-center gap-2">
                  <h4 className="text-base">Product options:</h4>
                  <span>
                    <p className="font-extralight text-xs">(optional)</p>
                  </span>
                </div>
                <p className="text-xs font-extralight">
                  Have different options for this product? <br /> i.e. (size,
                  flavor, etc.)
                </p>
              </div>
              <div className="">
                <ButtonPrimary
                  type="button"
                  name="Add"
                  handleClick={handleAddOptionGroup}
                />
              </div>
            </span>
          </div>
          <div>
            {optionGroupPositions.length !== 0 &&
              optionGroupPositions.map((position) => (
                <div
                  key={position}
                  className={` bg-[color:var(--brown-bg)]  p-4  my-1 shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)]`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-[color:var(--black-design-extralight)] font-medium text-base">
                        Option group
                      </h4>
                      <button
                        type="button"
                        value={position}
                        onClick={handleRemoveOptionGroup}
                        className="text-xs font-light text-[color:var(--third-dark)] underline rounded px-2 py-1"
                      >
                        remove group
                      </button>
                    </div>
                    <div className="flex flex-col py-2 pl-4 relative">
                      <label
                        htmlFor="optionTitle"
                        className="text-[color:var(--black-design-extralight)] font-medium text-sm "
                      >
                        Title
                      </label>
                      <input
                        onKeyDown={handleKeyDown}
                        required
                        type="text"
                        name="optionTitle"
                        id="optionTitle"
                        value={getOptionTitle(position)}
                        onChange={handleOptionGroupChange(position)}
                        placeholder="Size, flavor, toppings ... "
                        className={`transition-colors duration-300 border border-[color:var(--gray-light-med)] rounded w-full py-2 px-4 focus:outline-none focus:border focus:border-[color:var(--primary-light-med)]  font-light text-xs overflow-hidden`}
                      />
                    </div>
                    <div className="border-y py-4 mt-4">
                      {/* <h4 className="text-[color:var(--black-design-extralight)] font-medium text-base">
                        Settings
                      </h4> */}
                      {groupOptionSettings.map((groupSettingItem) => {
                        const { selectionType, isRequired } = groupSettingItem;
                        if (groupSettingItem.position === position) {
                          return (
                            <div key={groupSettingItem.position}>
                              <div>
                                <FormControl>
                                  <ul className="my-2">
                                    <li className="text-sm list-disc font-medium ml-5">
                                      Are customers required to select an
                                      option?
                                    </li>
                                  </ul>
                                  <RadioGroup
                                    aria-labelledby="radio buttons for setting quantity"
                                    name="selectionRequirement"
                                    value={isRequired ? "required" : "optional"}
                                    defaultValue="required"
                                    onChange={handleOptionGroupSettingsChange(
                                      position
                                    )}
                                    sx={{ marginLeft: "1rem" }}
                                  >
                                    <FormControlLabel
                                      value="required"
                                      control={
                                        <Radio size="small" color="secondary" />
                                      }
                                      label={
                                        <p className="text-[color:var(--black-design)] text-sm font-light">
                                          Required
                                        </p>
                                      }
                                    />

                                    <FormControlLabel
                                      value="optional"
                                      control={
                                        <Radio size="small" color="secondary" />
                                      }
                                      label={
                                        <p className="text-[color:var(--black-design)] text-sm font-light">
                                          Optional
                                        </p>
                                      }
                                    />
                                  </RadioGroup>
                                </FormControl>
                              </div>

                              <div>
                                <FormControl>
                                  <ul className="my-2">
                                    <li className="text-sm list-disc font-medium ml-5">
                                      How many can customers select?
                                    </li>
                                  </ul>
                                  <RadioGroup
                                    aria-labelledby="radio buttons for setting quantity"
                                    name="selectionQuantity"
                                    defaultValue="one"
                                    value={selectionType == 0 ? "one" : "many"}
                                    onChange={handleOptionGroupSettingsChange(
                                      position
                                    )}
                                    sx={{ marginLeft: "1rem" }}
                                  >
                                    <FormControlLabel
                                      value="one"
                                      control={
                                        <Radio size="small" color="secondary" />
                                      }
                                      label={
                                        <p className="text-[color:var(--black-design)] text-sm font-light">
                                          Select one
                                        </p>
                                      }
                                    />

                                    <FormControlLabel
                                      value="many"
                                      control={
                                        <Radio size="small" color="secondary" />
                                      }
                                      label={
                                        <p className="text-[color:var(--black-design)] text-sm font-light">
                                          Select many
                                        </p>
                                      }
                                    />
                                  </RadioGroup>
                                </FormControl>
                              </div>
                            </div>
                          );
                        }
                      })}
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <h4 className="text-[color:var(--black-design-extralight)] font-medium text-base">
                        Options:
                      </h4>

                      <div>
                        <ButtonFilter
                          type="button"
                          name="+ Variant"
                          handleClick={handleAddVariantClick(position)}
                        />
                      </div>
                    </div>
                    {optionPositions.length !== 0 &&
                      optionPositions.map((item, idx) => {
                        if (item.groupPosition === position)
                          return (
                            <div
                              key={item.optionPosition}
                              className="flex gap-5 items-center mt-4 pt-4 ml-4 border-t"
                            >
                              <div className="flex-grow">
                                <div className="flex gap-4 justify-center items-center">
                                  <span className="flex flex-col relative flex-grow">
                                    <div className="flex items-center gap-2">
                                      <label
                                        htmlFor="optionName"
                                        className="text-[color:var(--black-design-extralight)] font-medium text-xs "
                                      >
                                        Name
                                      </label>
                                      <span>
                                        <p className="font-extralight text-xs">
                                          (required)
                                        </p>
                                      </span>
                                    </div>
                                    <input
                                      onKeyDown={handleKeyDown}
                                      required
                                      type="text"
                                      name="optionName"
                                      id="optionName"
                                      defaultValue={getOptionValueName(item)}
                                      onChange={handleOptionChange(item)}
                                      placeholder="Small, med ..."
                                      className={`transition-colors duration-300 border border-[color:var(--gray-light-med)] rounded w-full py-2 px-4 focus:outline-none focus:border focus:border-[color:var(--primary-light-med)] placeholder:text-xs  font-light text-xs overflow-hidden`}
                                    />
                                  </span>
                                  <span className="flex flex-col relative flex-grow">
                                    <div className="flex items-center gap-2">
                                      <label
                                        htmlFor="priceStr"
                                        className="text-[color:var(--black-design-extralight)] font-medium text-xs "
                                      >
                                        Add on price
                                      </label>
                                      <span>
                                        <p className="font-extralight text-xs">
                                          (optional)
                                        </p>
                                      </span>
                                    </div>
                                    <span className="text-[color:var(--gray-light-med)] text-sm font-light absolute bottom-2 left-4">
                                      $
                                    </span>
                                    <input
                                      onKeyDown={handleKeyDown}
                                      type="number"
                                      name="price"
                                      id="price"
                                      step="0.01"
                                      placeholder="0"
                                      defaultValue={getOptionValuePrice(item)}
                                      onChange={handleOptionChange(item)}
                                      className={`transition-colors duration-300 border border-[color:var(--gray-light-med)] rounded w-full py-2 px-4  indent-4 focus:outline-none focus:border focus:border-[color:var(--primary-light-med)]  font-light text-xs overflow-hidden placeholder:text-xs`}
                                    />
                                  </span>
                                </div>
                                {!setQuantityByProduct && (
                                  <div className="flex flex-col relative flex-grow mt-4">
                                    <label
                                      htmlFor="quantity"
                                      className="text-[color:var(--black-design-extralight)] font-medium text-xs "
                                    >
                                      Quantity
                                    </label>
                                    <input
                                      onKeyDown={handleKeyDown}
                                      required
                                      step="1"
                                      type="number"
                                      name="quantity"
                                      id="quantity"
                                      defaultValue={getOptionvalueQuantity(
                                        item
                                      )}
                                      onChange={handleOptionChange(item)}
                                      className={`transition-colors duration-300 border border-[color:var(--gray-light-med)] rounded w-full py-2 px-4 focus:outline-none focus:border focus:border-[color:var(--primary-light-med)] placeholder:text-xs  font-light text-xs overflow-hidden`}
                                    />
                                  </div>
                                )}
                                <button
                                  type="button"
                                  onClick={removeOptionPosition(item)}
                                  className="h-fit mt-4 mb-2 block text-xs font-light text-[color:var(--black-design)] p-1 rounded ml-auto border border-[color:var(--black-design)] active:bg-[color:var(--black-design)] active:text-white "
                                >
                                  remove
                                </button>
                              </div>
                            </div>
                          );
                      })}
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="rounded p-4 w-full shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)] bg-white">
          <div className="mt-4">
            <span className="flex flex-col gap-2 mt-4">
              <span className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="customerQuestion"
                    className="text-black font-medium text-base "
                  >
                    Questions to ask customers:
                  </label>
                  <span>
                    <p className="font-extralight text-xs">(optional)</p>
                  </span>
                </div>
              </span>
              <input
                onKeyDown={handleKeyDown}
                type="text"
                id="customerQuestion"
                value={customerQuestionInput}
                onChange={handleCustomerQuestionInputChange}
                className={`transition-colors duration-300 border border-[color:var(--gray-light-med)] rounded w-full py-2 focus:outline-none focus:border focus:border-[color:var(--primary-light-med)] indent-4 font-light text-xs`}
                placeholder="ex: Do you have any allergies?"
              />
            </span>
            <div className="w-fit ml-auto mt-4">
              <ButtonPrimary
                name="Add"
                type="button"
                handleClick={handleAddCustomerQuestions}
              />
            </div>

            {customerQuestions.length !== 0 && (
              <div className="mt-4 py-4 border-t  ">
                <h4 className="text-black font-semibold text-sm mb-2">
                  Added questions:
                </h4>
                {customerQuestions.map((item, idx) => (
                  <div
                    key={item.question} // There will never be 2 same questions, cannot use id b/c we don't know the prisma id of newly added questions on client side b/c it has not been saved yet
                    className="flex items-cetner justify-between gap-3 mb-3"
                  >
                    <span className="flex items-center">
                      <IconButton onClick={handleRemoveQuestion(item)}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                      <p className="text-sm font-light">{item.question}</p>
                    </span>
                    <span className="flex items-center gap-2">
                      <p
                        className={`text-sm font-light ${
                          item.isRequired
                            ? "text-[color:var(--primary)] "
                            : "text-[color:var(--gray-light-med)]  "
                        }`}
                      >
                        required
                      </p>
                      <IOSSwitch
                        checked={item.isRequired}
                        onChange={handleQuestionRequired(item.question)}
                      />
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between rounded p-4 w-full shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)] bg-white">
          <div>
            <h4 className="text-[color:var(--black-design-extralight)] font-medium text-base">
              Enable custom note:
            </h4>
            <p className="text-xs font-extralight">
              Allow your customers to leave you a custom note.
            </p>
          </div>
          <IOSSwitch
            checked={enableCustomNote}
            onChange={handleCustomNoteChange}
          />
        </div>
        <div className="flex items-center justify-between rounded p-4 w-full shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)] bg-white">
          <div>
            <h4 className="text-[color:var(--black-design-extralight)] font-medium text-base">
              Enable customer image uploads:
            </h4>
            <p className="text-xs font-extralight">
              Allow your customers to upload a max of 3 images for reference.
            </p>
          </div>
          <IOSSwitch
            checked={enableCustomerImageUploads}
            onChange={handleCustomerUploadSampleImagesChange}
          />
        </div>

        <div className="absolute left-0 bottom-0 w-full bg-white p-4 shadow-inner md:w-[60vw] lg:w-[45vw] xl:w-[35vw]">
          <SaveCancelButtons
            handleCancel={handleCloseDrawer}
            saveButtonType="submit"
            cancelButtonType="button"
            isLoading={isSaveProductLoading}
          />
        </div>
      </form>
    </Drawer>
  );
}

export default ProductDrawer;
