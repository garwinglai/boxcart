import React, { useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import etsy_icon from "@/public/images/icons/account/etsy_icon.png";
import Image from "next/image";
import { useRouter } from "next/router";
import { IconButton, CircularProgress, Divider } from "@mui/material";
import { ChevronLeft, DeleteOutline } from "@mui/icons-material";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import Papa from "papaparse";
import { useAccountStore } from "@/lib/store";
import BoxLoader from "@/components/global/loaders/BoxLoader";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import success_icon from "@/public/images/icons/account/success_icon.png";
import error_icon from "@/public/images/icons/account/error_icon.png";
import Alert from "@mui/material/Alert";
import ButtonThird from "@/components/global/buttons/ButtonThird";
import { nanoid } from "nanoid";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  "@media (min-width: 426px)": {
    width: "400px",
  },
  maxHeight: "80%",
  overflow: "scroll",
  bgcolor: "var(--white)",
  border: "1px solid var(--black-design-extralight)",
  borderRadius: "4px",
  boxShadow: "var(--modal-shadow)",
};

function Etsy() {
  const accountStore = useAccountStore((state) => state.account);

  const [highlightDropZone, setHighlightDropZone] = useState(false);
  const [uploadedCSVProduct, setUploadedCSVProduct] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonNavClicked, setIsButtonNavClicked] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [error, setError] = useState(false);

  const { push, reload } = useRouter();

  const handleBackToProducts = () => {
    push("/app/account/inventory/products");
  };

  const handleOpenUploadModal = () => setOpenUploadModal(true);
  const handleCloseUploadModal = () => setOpenUploadModal(false);

  const handleRemoveCSVProduct = () => {
    setUploadedCSVProduct();
    setHighlightDropZone(false);
  };

  const handleDragOverProduct = (e) => {
    e.preventDefault();
    setHighlightDropZone(true);
  };

  const handleDropProduct = (e) => {
    e.preventDefault();
    const files = event.dataTransfer.files;
    handleCSVFileChangeProduct(files[0]);
    setHighlightDropZone(false);
  };

  const handleCSVFileChangeProduct = (file) => {
    setHighlightDropZone(false);
    if (!file) return;

    setUploadedCSVProduct(file);
  };

  const handleCSVUpload = () => {
    setIsLoading(true);
    handleOpenUploadModal();

    Papa.parse(uploadedCSVProduct, {
      skipEmptyLines: true,
      header: true,
      complete: async function (results) {
        const { data } = results;

        await uploadProducts(data);
        if (error) setError(true);
        setIsLoading(false);
      },
    });
  };

  const uploadProducts = async (data) => {
    const builtCsvData = buildUploadData(data);

    const batchProductImportAPI =
      "/api/private/inventory/product/import-from-third-party";
    const response = await fetch(batchProductImportAPI, {
      method: "POST",
      body: JSON.stringify(builtCsvData),
    });

    return await response.json();
  };

  const buildUploadData = (data) => {
    const csvProducts = [];

    for (let i = 0; i < data.length; i++) {
      const currItem = data[i];

      const images = createImageData(currItem);
      const optionGroups = createOptionGroups(currItem);

      const priceIntPenny = Number(currItem[`PRICE`]) * 100;
      let priceStr = `$${(priceIntPenny / 100).toString()}`;
      const quantity = Number(currItem[`QUANTITY`]);

      if (!priceStr.includes(".")) {
        priceStr += ".00";
      } else {
        const priceArr = priceStr.split(".");
        if (priceArr[1].length === 1) {
          priceStr += "0";
        }
      }

      const boxcartProduct = {
        accountId: parseInt(accountStore.accountId),
        product: {
          productId: nanoid(),
          productName: currItem[`TITLE`],
          description: currItem[`DESCRIPTION`],
          priceIntPenny,
          priceStr,
          defaultImage: currItem[`IMAGE1`],
          hasUnlimitedQuantity: quantity === 0 ? true : false,
          quantity: quantity === 0 ? undefined : quantity,
        },
        images,
        optionGroups,
        relatedCategories: [],
      };

      const prismProductSchema = buildProductSchema(boxcartProduct);
      csvProducts.push(prismProductSchema);
    }

    return csvProducts;
  };

  const createImageData = (currItem) => {
    const images = [];
    if (Boolean(currItem[`IMAGE1`]))
      images.push({
        image: currItem[`IMAGE1`],
        imagePosition: "1",
        imported: true,
      });
    if (Boolean(currItem[`IMAGE2`]))
      images.push({
        image: currItem[`IMAGE2`],
        imagePosition: "2",
        imported: true,
      });
    if (Boolean(currItem[`IMAGE3`]))
      images.push({
        image: currItem[`IMAGE3`],
        imagePosition: "3",
        imported: true,
      });
    if (Boolean(currItem[`IMAGE4`]))
      images.push({
        image: currItem[`IMAGE4`],
        imagePosition: "4",
        imported: true,
      });
    if (Boolean(currItem[`IMAGE5`]))
      images.push({
        image: currItem[`IMAGE5`],
        imagePosition: "5",
        imported: true,
      });
    if (Boolean(currItem[`IMAGE6`]))
      images.push({
        image: currItem[`IMAGE6`],
        imagePosition: "6",
        imported: true,
      });
    if (Boolean(currItem[`IMAGE7`]))
      images.push({
        image: currItem[`IMAGE7`],
        imagePosition: "7",
        imported: true,
      });
    if (Boolean(currItem[`IMAGE8`]))
      images.push({
        image: currItem[`IMAGE8`],
        imagePosition: "8",
        imported: true,
      });
    if (Boolean(currItem[`IMAGE9`]))
      images.push({
        image: currItem[`IMAGE9`],
        imagePosition: "9",
        imported: true,
      });
    if (Boolean(currItem[`IMAGE10`]))
      images.push({
        image: currItem[`IMAGE10`],
        imagePosition: "10",
        imported: true,
      });

    return images;
  };

  const createOptionGroups = (currItem) => {
    const optionGroups = [];

    if (
      Boolean(currItem[`VARIATION 1 NAME`]) &&
      Boolean([`VARIATION 1 VALUES`])
    ) {
      const optionGroup1 = {
        productName: currItem[`TITLE`],
        optionGroupName: currItem[`VARIATION 1 NAME`],
        isRequired: true,
        isRequiredDisplay: "required",
        options: currItem[`VARIATION 1 VALUES`].split(",").map((option) => {
          return {
            optionGroupName: currItem[`VARIATION 1 NAME`],
            optionName: option,
          };
        }),
      };

      optionGroups.push(optionGroup1);
    }

    if (
      Boolean(currItem[`VARIATION 2 NAME`]) &&
      Boolean([`VARIATION 2 VALUES`])
    ) {
      const optionGroup2 = {
        productName: currItem[`TITLE`],
        optionGroupName: currItem[`VARIATION 2 NAME`],
        isRequired: true,
        isRequiredDisplay: "required",
        options: currItem[`VARIATION 2 VALUES`].split(",").map((option) => {
          return {
            optionGroupName: currItem[`VARIATION 2 NAME`],
            optionName: option,
          };
        }),
      };

      optionGroups.push(optionGroup2);
    }

    return optionGroups;
  };

  const buildProductSchema = (boxcartProduct) => {
    const { accountId, product, relatedCategories, images, optionGroups } =
      boxcartProduct;

    return {
      ...product,
      optionGroups: {
        create:
          optionGroups.length > 0
            ? optionGroups.map((optionGroup) => {
                return {
                  ...optionGroup,
                  options: {
                    create: optionGroup.options.map((option) => {
                      return {
                        ...option,
                      };
                    }),
                  },
                };
              })
            : undefined,
      },
      images: {
        create:
          images.length > 0
            ? images.map((image) => {
                return {
                  ...image,
                };
              })
            : undefined,
      },
      relatedCategories: {
        connectOrCreate:
          relatedCategories.length > 0
            ? relatedCategories.map((category) => {
                const category_identifier = {
                  accountId,
                  categoryName: category,
                };

                return {
                  where: {
                    category_identifier,
                  },
                  create: {
                    categoryName: category,
                    account: {
                      connect: {
                        id: accountId,
                      },
                    },
                  },
                };
              })
            : undefined,
      },
      account: {
        connect: {
          id: accountId,
        },
      },
    };
  };

  return (
    <div>
      <Modal
        open={openUploadModal}
        // onClose={handleClose}
        aria-labelledby="Uploading Shopify Modal"
        aria-describedby="Modal is currently loading while shopify products are importing."
      >
        <Box sx={style}>
          <div className="flex flex-col justify-center items-center py-8">
            {!isLoading ? (
              error ? (
                <React.Fragment>
                  <div className="w-16 h-16 aspect-square relative">
                    <Image
                      src={error_icon}
                      alt="error icon"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <h2 className="text-xl font-semibold">Error!</h2>
                  <p className="text-sm">
                    Whoops, looks like something went wrong.
                  </p>
                  <div className="px-4 pb-8 pt-4">
                    <Alert severity="error" sx={{ fontSize: "14px" }}>
                      <p className="font-medium">
                        Please refresh and try again. If error persists, contact
                        hello@boxcart.shop for support.
                      </p>
                    </Alert>
                  </div>
                  <div className="w-fit">
                    <ButtonThird
                      handleClick={() => reload()}
                      name="Reload page"
                    />
                  </div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div className="w-16 h-16 aspect-square relative">
                    <Image
                      src={success_icon}
                      alt="success icon"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <h2 className="text-xl font-semibold">Success!</h2>
                  <p className="text-sm">
                    Products were successfully imported.
                  </p>
                  <div className="px-4 py-8">
                    <Alert severity="warning" sx={{ fontSize: "14px" }}>
                      <ol>
                        <li className="mb-2">
                          <p className=" font-medium">
                            Product variant pricing and variant quantities is
                            not supported by Etsy on import.
                          </p>
                          <p className="font-medium mt-2">
                            Please check and manually update variant prices and
                            variant quantities.
                          </p>
                        </li>
                      </ol>
                    </Alert>
                  </div>
                  <div className="w-fit">
                    {isButtonNavClicked ? (
                      <CircularProgress color="secondary" size="2rem" />
                    ) : (
                      <ButtonPrimary
                        handleClick={() => {
                          setIsButtonNavClicked(true);
                          push("/app/account/inventory/products");
                        }}
                        name="Go to products"
                      />
                    )}
                  </div>
                </React.Fragment>
              )
            ) : (
              <React.Fragment>
                <BoxLoader />
                <h2>Importing products from Etsy</h2>
                <p>This can take a few minutes...</p>
              </React.Fragment>
            )}
          </div>
        </Box>
      </Modal>
      <div className="flex items-center p-1">
        <IconButton onClick={handleBackToProducts}>
          <ChevronLeft fontSize="small" />
        </IconButton>
        <button onClick={handleBackToProducts} className="text-xs">
          Back to products
        </button>
      </div>
      <div>
        <h2 className="text-base px-4 py-2">
          How to import <u>physical products</u> from your Etsy store.
        </h2>
        <div className="px-10 py-4 mb-24">
          <ol className="relative border-s border-gray-200 dark:border-gray-700">
            <li className="mb-10 ms-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-purple-200 rounded-full -start-4 ring-2 ring-white dark:ring-gray-900 ">
                <p>1</p>
              </span>
              <h3 className="font-medium leading-tight">Etsy</h3>
              <p className="text-sm font-light">
                Log in to your{" "}
                <a href="https://www.etsy.com/" target="_blank">
                  <u>Etsy account</u>
                </a>
                .
              </p>
            </li>
            <li className="mb-10 ms-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-purple-200 rounded-full -start-4 ring-2 ring-white dark:ring-gray-900 ">
                <p>2</p>
              </span>
              <h3 className="font-medium leading-tight">Shop manager</h3>
              <p className="text-sm font-light">
                Navigate to your shop manager.
              </p>
            </li>
            <li className="mb-10 ms-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-purple-200 rounded-full -start-4 ring-2 ring-white dark:ring-gray-900 ">
                <p>3</p>
              </span>
              <h3 className="font-medium leading-tight">Settings</h3>
              <p className="text-sm font-light">
                Click on
                <b> settings</b>.
              </p>
            </li>
            <li className="mb-10 ms-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-purple-200 rounded-full -start-4 ring-2 ring-white dark:ring-gray-900 ">
                <p>4</p>
              </span>
              <h3 className="font-medium leading-tight">Option</h3>
              <p className="text-sm font-light">
                Click on <b>options</b>.
              </p>
            </li>
            <li className="mb-10 ms-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-purple-200 rounded-full -start-4 ring-2 ring-white dark:ring-gray-900 ">
                <p>5</p>
              </span>
              <h3 className="font-medium leading-tight">Download</h3>
              <p className="text-sm font-light">
                Click the <b>Download Data</b> tab.
              </p>
              <p className="text-sm font-light">
                Under
                <b> Currently for Sale Listings</b>, click<b> Download CSV </b>
              </p>
            </li>
            <li className="mb-10 ms-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-purple-200 rounded-full -start-4 ring-2 ring-white dark:ring-gray-900 ">
                <p>6</p>
              </span>
              <h3 className="font-medium leading-tight">Remove digital products</h3>
              <p className="text-sm font-light">
                In your .csv file, delete the rows that contain digital
                products, if any.
              </p>
            </li>
            <li className="mb-4 ms-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-purple-200 rounded-full -start-4 ring-2 ring-white dark:ring-gray-900 ">
                <p>7</p>
              </span>
              <h3 className="font-medium leading-tight">Upload CSV</h3>
              <p className="text-sm font-light">Drag your csv below.</p>
              <div className="py-4 ">
                {!uploadedCSVProduct ? (
                  <div
                    onDragLeave={() => setHighlightDropZone(false)}
                    onDragOver={handleDragOverProduct}
                    onDrop={handleDropProduct}
                    className="flex items-center justify-center w-full"
                  >
                    <label
                      htmlFor="dropzone-file"
                      className={`flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 ${
                        highlightDropZone
                          ? "border-purple-500 dark:bg-purple-200"
                          : ""
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 text-center dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          (CSV only)
                        </p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        accept=".csv"
                        onChange={(event) =>
                          handleCSVFileChangeProduct(event.target.files[0])
                        }
                      />
                    </label>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 border border-gray-400 rounded px-2 w-fit">
                    <p className="text-sm font-light">
                      {uploadedCSVProduct.name}
                    </p>
                    <IconButton onClick={handleRemoveCSVProduct}>
                      <DeleteOutline fontSize="small" />
                    </IconButton>
                  </div>
                )}
              </div>
            </li>
            <li className="ms-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-purple-200 rounded-full -start-4 ring-2 ring-white dark:ring-gray-900 ">
                <p>8</p>
              </span>
              <h3 className="font-medium leading-tight">Complete</h3>
              <div className="w-fit h-8 mt-2">
                <ButtonPrimary
                  handleClick={handleCSVUpload}
                  type="button"
                  name="Complete upload"
                />
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default Etsy;

Etsy.getLayout = function getLayout(
  page,
  pageTitle,
  pageIcon,
  pageRoute,
  mobilePageRoute
) {
  return (
    <AppLayout
      pageTitle={pageTitle}
      pageIcon={pageIcon}
      pageRoute={pageRoute}
      mobilePageRoute={mobilePageRoute}
    >
      {page}
    </AppLayout>
  );
};

Etsy.pageTitle = "Import Etsy Products";
Etsy.pageIcon = (
  <div className="relative w-6 h-6">
    <Image
      src={etsy_icon}
      alt="shopify logo"
      fill
      className=""
      priority
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  </div>
);
Etsy.pageRoute = "import-etsy";
Etsy.mobilePageRoute = "import-etsy";
