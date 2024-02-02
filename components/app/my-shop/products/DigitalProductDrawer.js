import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import pdf_icon from "@/public/images/icons/pdf_icon.png";
import pdf_download_icon from "@/public/images/icons/pdf_download_icon.png";
import Image from "next/image";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CloseIcon from "@mui/icons-material/Close";
import { Divider, IconButton } from "@mui/material";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import ButtonFilter from "@/components/global/buttons/ButtonFilter";
import Snackbar from "@mui/material/Snackbar";
import SaveCancelButtons from "../../design/SaveCancelButtons";
import {
  createDigitalProductClient,
  updateDigitalProductClient,
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
import PillTab from "./PillTab";

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

function DigitalProductDrawer({
  state,
  toggleDrawer,
  product,
  categories,
  isCreateProduct,
  isEditProduct,
  accountId,
  userAccount,
  updateProductList,
  handleOpenSnackbarGlobal,
  getAllProducts,
  getAllDigitalProducts,
  getProductsByCategory,
  currCategoryId,
  currCategory,
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
  const [digitalFiles, setDigitalFiles] = useState(
    product
      ? product.digitalFiles
        ? product.digitalFiles.length > 0
          ? product.digitalFiles
          : []
        : []
      : []
  );

  const [tagsInput, setTagsInput] = useState("");
  const [productValues, setProductValues] = useState({
    productName: product ? product.productName : "",
    description: product ? product.description : "",
    tags: product ? (product.tags ? product.tags.split(", ") : []) : [],
    salePriceInt: product
      ? product.salePricePenny
        ? (product.salePricePenny / 100).toFixed(2)
        : ""
      : "",
    salePriceStr: product
      ? product.salePriceStr
        ? product.salePriceStr
        : ""
      : "",
    priceInt: product ? (product.priceIntPenny / 100).toFixed(2) : "",
    priceStr: product ? product.priceStr : "",
    id: product ? product.id : "",
    digitalProductId: product
      ? product.digitalProductId
        ? product.digitalProductId
        : nanoid()
      : nanoid(),
    images: product ? (product.images ? product.images : []) : [],
    relatedCategories: product ? product.relatedCategories : [],
    defaultImage: product ? product.defaultImage : "",
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

  const {
    productName,
    description,
    tags,
    priceInt,
    salePriceInt,
    id,
    digitalProductId,
    relatedCategories,
    defaultImage,
    images,
  } = productValues;

  const { isSnackbarOpen, snackbarMessage } = snackbar;

  const handleCategoryNameChange = (e) => {
    const { value } = e.target;

    setNewCategoryInput(value);
  };

  const handleOpenCategoryModal = () => setOpenCategoryModal(true);
  const handleCloseCategoryModal = () => setOpenCategoryModal(false);

  const handleCancelNewCategory = () => {
    setNewCategoryInput("");
    setOpenCategoryModal(false);
  };

  const handleTagsInput = (e) => {
    const { value } = e.target;

    if (value.length > 40) {
      handleOpenSnackbar("Max characters reached.");
      return;
    }

    // check that tags cannot have symbols except for hypens "-"
    const regex = /^[a-zA-Z0-9- ]*$/;
    const isTagsFormat = regex.test(value);

    if (!isTagsFormat) {
      handleOpenSnackbar("Tags cannot have symbols except for hypens.");
      return;
    }

    setTagsInput(value);
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
      handleOpenSnackbar(
        "Category already exists. Select from saved categories."
      );
      return;
    }

    const relatedCategoriesArr = relatedCategories.map(
      (item) => item.categoryName
    );

    if (relatedCategoriesArr.includes(newCategoryInput)) {
      handleOpenSnackbar(
        "Category already exists. Select from saved categories."
      );
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

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const filesLen = files.length;

    if (filesLen < 1) return;

    const fileData = [];

    // check if fileName already exists in digitalFiles
    const digitalFilesArr = digitalFiles.map((item) => item.name);

    for (let i = 0; i < filesLen; i++) {
      const currFile = files[i];
      const fileName = currFile.name;

      if (digitalFilesArr.includes(fileName)) {
        continue;
      }

      fileData.push(currFile);
    }

    setDigitalFiles((prev) => [...prev, ...fileData]);
  };

  const handleCoverImageChange = (e) => {
    const { name, files } = e.target;
    const filesLen = files.length;

    if (filesLen < 1) return;

    const file = files[0];
    const image = URL.createObjectURL(file);

    const imageData = {
      image,
      imgFileName: file.name,
      imageFile: file,
    };

    setProductValues((prev) => ({
      ...prev,
      defaultImage: image,
      images: [imageData],
    }));
  };

  const handleRemoveFile = (file) => (e) => {
    const { name } = file;

    const fileArrayAfterRemoval = digitalFiles.filter(
      (currFiles) => currFiles.name !== name
    );

    setDigitalFiles(fileArrayAfterRemoval);
  };

  const handleRemoveCoverImage = (image) => (e) => {
    setProductValues((prev) => ({
      ...prev,
      defaultImage: "",
      images: [],
    }));
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

  const handleSave = async (e) => {
    e.preventDefault();

    if (digitalFiles.length === 0) {
      handleOpenSnackbar("Please upload at least one file.");
      return;
    }

    if (!defaultImage) {
      handleOpenSnackbar("Please upload a cover image.");
      return;
    }

    setIsSaveProductLoading(true);

    const productSchema = structureProductSchema();

    // Incorrect product inputs
    if (!productSchema) {
      setIsSaveProductLoading(false);
      return;
    }

    let productObject = {
      productSchema,
    };

    if (isCreateProduct) {
      const fireStorageId = nanoid();

      const res = await saveFilesToFirebase(
        digitalFiles,
        fireStorageId,
        subdomain
      );

      if (!res.success || res.error) {
        handleOpenSnackbarGlobal("Error uploading files.");
        // TODO: delete photos that were already stored into firebase before error.
        return;
      }

      const filesUrls = res.fileUrls;

      productObject.fileSchema = filesUrls;
      productObject.productSchema.fireStorageId = fireStorageId;

      const resImage = await savePhotoToFirebase(
        images,
        fireStorageId,
        subdomain
      );

      if (!resImage.success || resImage.error) {
        handleOpenSnackbarGlobal("Error uploading cover image.");
        return;
      }

      const imageData = images[0];
      const { imgFileName } = imageData;

      productObject.imageSchema = resImage.photoData;
      productObject.productSchema.defaultImage = resImage.photoUrl;
      productObject.productSchema.defaultImageFileName = imgFileName;

      const resProductCreate = await createDigitalProductClient(productObject);
      const { success, value } = resProductCreate;
      const { createdProduct, createdCategories } = value;

      if (!success) {
        const resDelete = await deleteFilesFromFirebase(
          digitalFiles,
          subdomain,
          fireStorageId
        );

        const resImageDelete = await deleteCoverImageFromFirebase(
          images,
          subdomain,
          fireStorageId
        );

        // TODO: is !resDelete.success did not delete teh images

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
      const removedFiles = product.digitalFiles.filter((item) => {
        const digitalFilesArr = digitalFiles.map((item) => item.uploadedFile);
        if (!digitalFilesArr.includes(item.uploadedFile)) return item;
      });
      const removedImages = product.images.filter((item) => {
        const imagesArr = images.map((item) => item.image);
        if (!imagesArr.includes(item.image)) return item;
      });

      if (removedFiles.length > 0) {
        await deleteFilesFromFirebase(removedFiles, subdomain);
        // ? Need to catch error, but not detrimental, still let pass.
      }

      if (removedImages.length > 0) {
        const { fireStorageId } = removedImages[0];
        await deleteCoverImageFromFirebase(
          removedImages,
          subdomain,
          fireStorageId
        );
        // ? Need to catch error, but not detrimental, still let pass.
      }

      const newDigitalFiles = digitalFiles.filter((item) => {
        if (!item.fireStorageId) return item;
      });

      const newImages = images.filter((item) => {
        if (!item.fireStorageId && !item.imported) return item;
      });

      let uploadFileError = false;
      let uploadPhotoError = false;
      const newFiles = [];
      const { fireStorageId } = product;

      if (newDigitalFiles.length > 0) {
        const res = await saveFilesToFirebase(
          newDigitalFiles,
          fireStorageId,
          subdomain
        );

        if (!res.success || res.error) {
          uploadFileError = true;
          // TODO: log error
        }

        newFiles.push(...res.fileUrls);
        productObject.fileSchema = newFiles;
      }

      if (newImages.length > 0) {
        const resImage = await savePhotoToFirebase(
          newImages,
          fireStorageId,
          subdomain
        );

        if (!resImage.success || resImage.error) {
          uploadPhotoError = true;
          // TODO: log error
        }

        const imageData = images[0];
        const { imgFileName } = imageData;

        productObject.imageSchema = [resImage.photoData];
        productObject.productSchema.fireStorageId = fireStorageId;
        productObject.productSchema.defaultImage = resImage.photoUrl;
        productObject.productSchema.defaultImageFileName = imgFileName;
      }

      if (uploadFileError) {
        handleOpenSnackbarGlobal("Error uploading images.");
        // TODO: remove images that were uploaded already
        return;
      }

      if (uploadPhotoError) {
        handleOpenSnackbarGlobal("Error uploading images.");
        // TODO: remove images that were uploaded already
        return;
      }

      productObject.removedFiles = removedFiles;
      productObject.removedImages = removedImages;

      const resProductUpdate = await updateDigitalProductClient(productObject);
      const { success, value } = resProductUpdate;
      const { updatedProduct } = value;

      if (!success) {
        if (digitalFiles.length > 0) {
          await deleteFilesFromFirebase(digitalFiles, subdomain, fireStorageId);
        }

        if (images.length > 0) {
          await deleteCoverImageFromFirebase(images, subdomain, fireStorageId);
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

    if (currCategory === "All Products") {
      getAllProducts(accountId);
    } else if (currCategory === "All Digital") {
      getAllDigitalProducts(accountId);
    } else {
      getProductsByCategory(currCategoryId, currCategory);
    }

    updateChecklist();
    toggleDrawer("right", false)(e);
  };

  const deleteFilesFromFirebase = async (
    removedFiles,
    subdomain,
    fireStorageId
  ) => {
    const deletePromise = [];
    for (let i = 0; i < removedFiles.length; i++) {
      const currFile = removedFiles[i];
      const { name: fileName, fireStorageId: oldStorageId } = currFile;

      const fileRef = ref(
        storage,
        `account/${subdomain}/digital-products/${
          fireStorageId ? fireStorageId : oldStorageId
        }/files/${fileName}`
      );

      const deleteFile = deleteObject(fileRef);
      deletePromise.push(deleteFile);
    }

    try {
      await Promise.all(deletePromise);
      return { success: true };
    } catch (error) {
      console.log("error deleting images from firebase:", error);
      return { success: false };
    }
  };

  const deleteCoverImageFromFirebase = async (
    images,
    subdomain,
    fireStorageId
  ) => {
    const image = images[0];
    const { imgFileName: fileName } = image;

    const photoRef = ref(
      storage,
      `account/${subdomain}/digital-products/${fireStorageId}/productImages/${fileName}`
    );

    try {
      await deleteObject(photoRef);
    } catch (error) {
      console.log("error deleting images from firebase:", error);
    }
  };

  const savePhotoToFirebase = async (images, fireStorageId, subdomain) => {
    const imageData = images[0];
    const { imgFileName: fileName, imageFile } = imageData;

    const photoRef = ref(
      storage,
      `account/${subdomain}/digital-products/${fireStorageId}/productImages/${fileName}`
    );

    try {
      await uploadBytes(photoRef, imageFile);
    } catch (error) {
      console.log("error uploading product image:", error);
      return { success: false, error };
    }

    try {
      const photoUrl = await getDownloadURL(photoRef);

      const photoData = {
        imgFileName: fileName,
        image: photoUrl,
        fireStorageId,
      };

      return { success: true, photoUrl, photoData };
    } catch (error) {
      console.log("photo Url error", error);

      return { success: false, error };
    }
  };

  const saveFilesToFirebase = async (
    digitalFiles,
    fireStorageId,
    subdomain
  ) => {
    const uploadPromises = [];

    for (let i = 0; i < digitalFiles.length; i++) {
      const currFile = digitalFiles[i];

      const { name } = currFile;

      const fileRef = ref(
        storage,
        `account/${subdomain}/digital-products/${fireStorageId}/files/${name}`
      );

      const uploadTask = uploadBytes(fileRef, currFile);
      uploadPromises.push(uploadTask);
    }

    try {
      await Promise.all(uploadPromises);
    } catch (error) {
      console.log("error uploading product image:", error);
    }

    const filesUrlPromises = [];
    const filesData = [];

    for (let j = 0; j < digitalFiles.length; j++) {
      const currFile = digitalFiles[j];
      const { name } = currFile;

      const fileRef = ref(
        storage,
        `account/${subdomain}/digital-products/${fireStorageId}/files/${name}`
      );

      const fileData = {
        name,
        fireStorageId,
      };

      const fileUrl = getDownloadURL(fileRef);
      filesUrlPromises.push(fileUrl);
      filesData.push(fileData);
    }

    try {
      const fileUrls = await Promise.all(filesUrlPromises);
      const restructureFileData = filesData.map((item, idx) => {
        item.uploadedFile = fileUrls[idx];
        return item;
      });

      return { success: true, fileUrls: restructureFileData };
    } catch (error) {
      console.log("file Url error", error);

      return { success: false, error };
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
        tags: [],
        priceStr: "",
        salePriceInt: "",
        salePriceStr: "",
        id: "",
        relatedCategories: [],
        images: [],
        defaultImage: "",
      });

      setDigitalFiles([]);
      setAllCategories(categories ? categories : []);
    }

    if (isEditProduct) {
      // reset all states to original values
      const {
        productName,
        description,
        priceIntPenny,
        priceStr,
        tags,
        salePricePenny,
        salePriceStr,
        digitalFiles,
        id,
        relatedCategories,
        defaultImage,
        images,
      } = updatedProduct ? updatedProduct : product;

      setProductValues({
        productName,
        description,
        tags: tags ? tags.split(", ") : [],
        priceInt: priceIntPenny / 100,
        priceStr: priceStr.slice(1),
        salePriceInt:
          salePricePenny && salePricePenny !== "" ? salePricePenny / 100 : "",
        salePriceStr:
          salePriceStr && salePriceStr !== "" ? salePriceStr.slice(1) : "",
        digitalFiles,
        id,
        relatedCategories,
        defaultImage,
        images,
      });

      setDigitalFiles(
        digitalFiles ? (digitalFiles.length > 0 ? digitalFiles : []) : []
      );

      setAllCategories(categories ? categories : []);
    }

    setRemovedCategories([]);
    setNewCategories([]);
    setHoldTempCategoriesToAdd([]);
  };

  const structureProductSchema = () => {
    // Converting and checking sale price

    let salePricePenny = "";
    let convertToSalePriceStr = "";

    if (salePriceInt != "") {
      salePricePenny = parseInt((salePriceInt * 100).toFixed(2));
      let salePriceValue = salePriceInt.toString();

      if (
        salePriceValue.includes(".") &&
        salePriceValue.split(".")[1].length === 1
      ) {
        salePriceValue += "0";
      }

      if (!salePriceValue.includes(".")) {
        salePriceValue += ".00";
      }

      if (salePriceValue.split(".")[0] == "") {
        salePriceValue = "0" + salePriceValue;
      }

      convertToSalePriceStr = `$${salePriceValue}`;
    }

    const priceIntPenny = parseInt((priceInt * 100).toFixed(2));
    let priceValue = priceInt.toString();

    if (salePricePenny >= priceIntPenny) {
      handleOpenSnackbar("Sale price must be less than original price.");
      return null;
    }

    if (priceValue.includes(".") && priceValue.split(".")[1].length === 1) {
      priceValue += "0";
    }

    if (!priceValue.includes(".")) {
      priceValue += ".00";
    }

    if (priceValue.split(".")[0] == "") {
      priceValue = "0" + priceValue;
    }

    const convertToPriceStr = `$${priceValue}`;
    const productTags = tags.join(", ");
    const lat = account.lat;
    const lng = account.lng;
    const geohash = account.geohash;

    const productSchema = {
      id,
      digitalProductId,
      tags: productTags,
      lat,
      lng,
      geohash,
      accountId,
      productName,
      description,
      priceIntPenny,
      priceStr: convertToPriceStr,
      salePricePenny: salePricePenny ? salePricePenny : null,
      salePriceStr: convertToSalePriceStr,
      relatedCategories,
      removedCategories,
      newCategories,
    };

    return productSchema;
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

  return (
    <Drawer anchor={"right"} open={state["right"]}>
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
        className=" w-screen bg-[color:var(--gray-light)] min-h-screen p-4 flex flex-col gap-4 overflow-y-scroll pb-56 md:w-[60vw] lg:w-[45vw] xl:w-[35vw]"
      >
        <div className="flex justify-between items-center sticky top-0 z-10 bg-white rounded-full shadow-lg py-2 px-4">
          <span className="flex gap-1 items-center">
            <Image
              src={pdf_icon}
              alt="bardcode icon"
              className="w-[2rem] h-[2rem]"
            />
            <h2 className="text-base">Product details:</h2>
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
            <span className="flex items-start justify-between gap-1">
              <div className="flex items-center gap-1">
                <h4 className="text-black font-semibold text-sm ">Files:</h4>
              </div>
              <div>
                <p className="text-xs text-right text-[color:var(--gray)] font-light">
                  * .pdf files only
                </p>
              </div>
            </span>

            <div className="flex overflow-x-scroll w-full mt-4 gap-1 pb-4">
              {digitalFiles.length !== 0 ? (
                digitalFiles.map((file, idx) => {
                  const { name: fileName } = file;

                  return (
                    <div
                      key={idx}
                      className="flex flex-col justify-center w-1/3"
                    >
                      <div
                        className={`relative h-[8rem] min-w-[8rem] inline-block`}
                      >
                        <Image
                          src={pdf_download_icon}
                          alt="product image"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-scale-down rounded inline-block"
                        />
                        <div className="absolute bg-[color:var(--black-design-extralight)] rounded-full right-1 top-0 opacity-70">
                          <IconButton onClick={handleRemoveFile(file)}>
                            <CloseIcon
                              sx={{
                                color: "var(--white)",
                                fontSize: "0.70rem",
                              }}
                            />
                          </IconButton>
                        </div>
                      </div>
                      <p className="text-xs font-extralight truncate">
                        {fileName}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div>
                  <div className="h-32 w-32 border roudned flex justify-center items-center text-[color:var(--gray-text)] text-sm font-light">
                    File
                  </div>
                </div>
              )}
            </div>
            <span className="flex justify-end">
              <div>
                <span>
                  <span className="bg-[color:var(--primary)] py-1 rounded ">
                    <label
                      htmlFor="productImageInput"
                      className=" -translate-y-[2px] bg-white text-[color:var(--primary)] border border-[color:var(--primary)] rounded py-1 px-2 active:bg-[color:var(--priamry-dark)] active:text-white hover:cursor-pointer"
                    >
                      Upload Files
                    </label>
                  </span>
                  <input
                    onChange={handleFileChange}
                    value=""
                    type="file"
                    name="productImage"
                    id="productImageInput"
                    className="hidden"
                    multiple
                    accept=".pdf"
                  />
                </span>
              </div>
            </span>
          </div>
          <div className="my-4">
            <Divider />
          </div>
          <div className="w-full relative mt-4">
            <span className="flex items-start justify-between gap-1">
              <div className="flex items-center gap-1">
                <h4 className="text-black font-semibold text-sm ">
                  Cover image:
                </h4>
              </div>
            </span>

            <div className="flex items-center justify-between w-full mt-4">
              {defaultImage ? (
                <div className={`relative h-[8rem] min-w-[8rem] inline-block`}>
                  <Image
                    src={defaultImage}
                    alt="product image"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover rounded inline-block"
                  />
                  <div className="absolute bg-[color:var(--black-design-extralight)] rounded-full right-1 top-1 opacity-70">
                    <IconButton onClick={handleRemoveCoverImage(defaultImage)}>
                      <CloseIcon
                        sx={{ color: "var(--white)", fontSize: "1rem" }}
                      />
                    </IconButton>
                  </div>
                </div>
              ) : (
                <div className="h-32 w-32 border roudned flex justify-center items-center text-[color:var(--gray-text)] text-sm font-light">
                  Image
                </div>
              )}
              <span className="flex flex-col gap-4 justify-end">
                <div>
                  <p className="text-xs text-right text-[color:var(--gray)] font-light">
                    * .png, .jpeg, or .jpg
                  </p>
                  <p className="text-xs text-right text-[color:var(--gray)] font-light">
                    Min: 800px x 800px
                  </p>
                </div>
                {images.length < 1 && (
                  <div>
                    <span>
                      <span className="bg-[color:var(--primary)] py-1 rounded ">
                        <label
                          htmlFor="defaultImage"
                          className=" -translate-y-[2px] bg-white text-[color:var(--primary)] border border-[color:var(--primary)] rounded py-1 px-2 active:bg-[color:var(--priamry-dark)] active:text-white hover:cursor-pointer"
                        >
                          Upload Image
                        </label>
                      </span>
                      <input
                        onChange={handleCoverImageChange}
                        value=""
                        type="file"
                        name="defaultImage"
                        id="defaultImage"
                        className="hidden"
                        accept=".png, .jpg, .jpeg"
                      />
                    </span>
                  </div>
                )}
              </span>
            </div>
          </div>

          <span className="flex flex-col gap-1 mt-4">
            <div className="flex items-center gap-1">
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
          <span className="flex flex-col gap-1 mt-4">
            <div className="flex items-center gap-1">
              <label
                htmlFor="description"
                className="text-black font-medium text-base "
              >
                Description:
              </label>
              <span>
                <p className="font-extralight text-xs">(optional)</p>
              </span>
            </div>
            <textarea
              type="text"
              id="description"
              value={description}
              name="description"
              onChange={handleProductInputChange}
              className={`transition-colors duration-300 border border-[color:var(--gray-light-med)] rounded w-full py-2 px-4 focus:outline-none focus:border focus:border-[color:var(--primary-light-med)]  font-light text-xs overflow-hidden`}
            />
          </span>
          <div className="flex flex-col gap-1 mt-4 relative">
            <div className="flex items-center gap-1">
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
              step="0.01"
              name="priceInt"
              id="price"
              value={priceInt}
              onChange={handleProductInputChange}
              className={`transition-colors duration-300 border border-[color:var(--gray-light-med)] rounded w-full py-2 focus:outline-none focus:border focus:border-[color:var(--primary-light-med)] indent-8 font-light text-xs`}
            />
          </div>
          <div className="flex flex-col gap-1 mt-4 relative">
            <div className="flex items-center gap-1">
              <label
                htmlFor="price"
                className="text-black font-medium text-base "
              >
                Sale price:
              </label>
              <span>
                <p className="font-extralight text-xs">(optional)</p>
              </span>
            </div>
            <span className="text-[color:var(--gray-light-med)] text-sm font-light absolute bottom-2 left-4">
              $
            </span>
            {/* //create an input for price so that it only has 2 decimals */}
            <input
              onKeyDown={handleKeyDown}
              type="number"
              step="0.01"
              name="salePriceInt"
              id="sales-price"
              value={salePriceInt}
              onChange={handleProductInputChange}
              className={`transition-colors duration-300 border border-[color:var(--gray-light-med)] rounded w-full py-2 focus:outline-none focus:border focus:border-[color:var(--primary-light-med)] indent-8 font-light text-xs`}
            />
          </div>
          <div className="flex flex-col gap-1 mt-4">
            <div className="flex items-center gap-1">
              <label
                htmlFor="title"
                className="text-black font-medium text-base "
              >
                Search gags:
              </label>
              <span>
                <p className="font-extralight text-xs">(optional)</p>
              </span>
            </div>
            <p className="text-xs">
              Create <u>descriptive</u> tags to get found on search! Max: 28
              tags (Don&apos;t repeat tags)
            </p>
            {tags.length < 29 && (
              <div className="flex gap-2">
                <div className="flex-grow flex flex-col justify-end items-end">
                  <input
                    type="text"
                    onKeyDown={handleKeyDown}
                    id="tags"
                    value={tagsInput}
                    placeholder="gifts, kids toy, pants, etc."
                    name="tags"
                    onChange={handleTagsInput}
                    className={`transition-colors duration-300 border border-[color:var(--gray-light-med)] rounded w-full py-2 focus:outline-none focus:border focus:border-[color:var(--primary-light-med)] indent-4 font-light text-xs`}
                  />
                  <p className="text-gray-500 text-xs">{tagsInput.length}/40</p>
                </div>
                <div className="h-8">
                  <ButtonPrimary
                    type="button"
                    name="Add"
                    disabled={tagsInput === ""}
                    handleClick={() => {
                      // Check if tagsInput is within tags, if not, add it in.
                      const lowerCaseTag = tagsInput.toLowerCase();
                      if (!tags.includes(lowerCaseTag)) {
                        setProductValues((prev) => ({
                          ...prev,
                          tags: [...tags, lowerCaseTag],
                        }));
                      }
                      setTagsInput("");
                    }}
                  />
                </div>
              </div>
            )}
            {tags.length !== 0 && (
              <div className="flex gap-1 flex-wrap">
                {tags.map((tag, index) => (
                  <PillTab
                    key={index}
                    name={tag}
                    handleClick={() => {
                      setProductValues((prev) => ({
                        ...prev,
                        tags: tags.filter((t) => t !== tag),
                      }));
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 mt-6 relative">
            <div className="flex justify-between items-center">
              <label
                htmlFor="price"
                className="text-black font-medium text-base flex gap-1 items-center"
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
                      <span className="flex flex-col gap-1">
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
                      <div className="flex gap-1 mt-4">
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
                  <option value="">Select from saved categories ...</option>
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
          </div>
          {relatedCategories.length !== 0 && (
            <div className="mt-2 flex gap-1 flex-wrap">
              {relatedCategories.map((category, index) => (
                <PillTab
                  key={index}
                  name={category.categoryName}
                  handleClick={removeAddedCategory(category)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-inner md:absolute md:w-[60vw] lg:w-[45vw] xl:w-[35vw]">
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

export default DigitalProductDrawer;
