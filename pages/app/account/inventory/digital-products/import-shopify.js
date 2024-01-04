import React, { useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import shopify_icon from "@/public/images/icons/account/shopify_icon.png";
import Image from "next/image";
import { useRouter } from "next/router";
import { CircularProgress, Divider, IconButton } from "@mui/material";
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

function Shopify() {
  const accountStore = useAccountStore((state) => state.account);

  const [highlightDropZone, setHighlightDropZone] = useState(false);
  const [uploadedCSVProduct, setUploadedCSVProduct] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonNavClicked, setIsButtonNavClicked] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [error, setError] = useState(false);

  const { push, reload } = useRouter();

  const handleOpenUploadModal = () => setOpenUploadModal(true);
  const handleCloseUploadModal = () => setOpenUploadModal(false);

  const handleBackToProducts = () => {
    push("/app/account/inventory/digital-products");
  };

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

    const inventoryData = [];

    Papa.parse(uploadedCSVProduct, {
      skipEmptyLines: true,
      header: true,
      complete: async function (results) {
        const { data } = results;
        const { error, products } = await uploadProducts(data);
        if (error) setError(true);
        setIsLoading(false);
      },
    });
  };

  const uploadProducts = async (data) => {
    const builtCsvData = buildUploadData(data);

    const batchProductImportAPI =
      "/api/private/inventory/digital-product/import-from-third-party";
    const response = await fetch(batchProductImportAPI, {
      method: "POST",
      body: JSON.stringify(builtCsvData),
    });

    return await response.json();
  };

  const buildUploadData = (data) => {
    const csvProducts = [];
    const organizedCSV = [];
    let sameProduct = [];
    let productHandle = "";

    // build an array from shopify "data" array that has the same product handle [[`same product`], [], []]
    for (let i = 0; i < data.length; i++) {
      const currItem = data[i];
      const currHandle = currItem.Handle;

      if (data.length === 1) {
        organizedCSV.push([currItem]);
        break;
      }

      if (productHandle === "") {
        sameProduct.push(currItem);
        productHandle = currHandle;
        continue;
      }

      if (productHandle === currHandle) {
        sameProduct.push(currItem);
      } else {
        organizedCSV.push(sameProduct);
        sameProduct = [];
        sameProduct.push(currItem);
        productHandle = currHandle;
      }

      if (i === data.length - 1) {
        organizedCSV.push(sameProduct);
        sameProduct = [];
        productHandle = "";
      }
    }

    for (let j = 0; j < organizedCSV.length; j++) {
      const currItemArray = organizedCSV[j];
      const currItemArrayLength = currItemArray.length;
      const boxcartProduct = {
        accountId: parseInt(accountStore.accountId),
        product: {
          digitalProductId: undefined,
          productName: undefined,
          description: undefined,
          salePricePenny: undefined,
          salePriceStr: undefined,
          priceIntPenny: undefined,
          priceStr: undefined,
          defaultImage: undefined,
          defaultImageAlt: undefined,
        },
        relatedCategories: [],
        images: [],
      };

      // destructure boxcartProduct
      const { product, relatedCategories, images } = boxcartProduct;

      // If product only has 1 variant
      if (currItemArrayLength === 1) {
        const item = currItemArray[0];

        for (let key in item) {
          //change the keys in the object currItem to all lowercase and no spaces.
          const newKey = key.toLowerCase().replace(/\s/g, "");
          item[newKey] = item[key];
          delete item[key];
        }

        if (item.status !== "active") continue;
        if (item.giftcard == "true") continue;

        const salePricePenny = item.variantcompareatprice
          ? parseInt(parseFloat(item.variantprice) * 100)
          : undefined;
        const salePriceStr = item.variantcompareatprice
          ? `$${item.variantprice}`
          : undefined;
        const priceIntPenny = item.variantcompareatprice
          ? parseInt(parseFloat(item.variantcompareatprice) * 100)
          : parseInt(parseFloat(item.variantprice) * 100);
        const priceStr = item.variantcompareatprice
          ? `$${item.variantcompareatprice}`
          : `$${item.variantprice}`;

        product.digitalProductId = nanoid();
        product.productName = item.title;
        product.description = item[`body(html)`];
        product.salePricePenny = salePricePenny;
        product.salePriceStr = salePriceStr;
        product.priceIntPenny = priceIntPenny;
        product.priceStr = priceStr;
        product.defaultImage = item.imagesrc;
        product.defaultImageAlt = item.imagealttext;

        if (item.type !== "") relatedCategories.push(item.type);

        if (item.imagesrc) {
          images.push({
            image: item.imagesrc,
            imagePosition: item.imageposition,
            imageAltText: item.imagealttext,
            imported: true,
          });
        }

        const prismaProductSchema = buildProductSchema(boxcartProduct);
        csvProducts.push(prismaProductSchema);
        // unset salePricePenny, salePriceStr, priceIntPenny, priceStr
        product.salePricePenny = undefined;
        product.salePriceStr = undefined;
        product.priceIntPenny = undefined;
        product.priceStr = undefined;
        images.slice(0, images.length);
        relatedCategories.slice(0, relatedCategories.length);
      } else {
        // If more than one variant, loop through each variant
        for (let k = 0; k < currItemArray.length; k++) {
          const currItem = currItemArray[k];

          for (let key in currItem) {
            //change the keys in the object currItem to all lowercase and no spaces.
            const newKey = key.toLowerCase().replace(/\s/g, "");
            currItem[newKey] = currItem[key];
            delete currItem[key];
          }

          if (currItem.imagesrc !== "") {
            images.push({
              image: currItem.imagesrc,
              imagePosition: currItem.imageposition,
              imageAltText: currItem.imagealttext,
              imported: true,
            });
          }

          if (currItem.imageposition == 1) {
            product.defaultImage = currItem.imagesrc;
            product.defaultImageAlt = currItem.imagealttext;
          }

          const priceIntPenny = parseInt(
            parseFloat(currItem.variantprice) * 100
          );
          const priceStr = `$${currItem.variantprice}`;

          if (k === 0) {
            if (currItem.status !== "active") break;
            if (currItem.giftcard == "true") continue;

            product.digitalProductId = nanoid();
            product.productName = currItem.title;
            product.description = currItem[`body(html)`];
            product.priceIntPenny = priceIntPenny;
            product.priceStr = priceStr;

            if (currItem.type !== "") relatedCategories.push(currItem.type);
          } else {
            product.priceIntPenny =
              priceIntPenny < product.priceIntPenny
                ? priceIntPenny
                : product.priceIntPenny;
            product.priceStr =
              priceIntPenny < product.priceIntPenny
                ? priceStr
                : product.priceStr;
          }
        }

        if (product.productName === undefined) continue;

        const prismaProductSchema = buildProductSchema(boxcartProduct);
        csvProducts.push(prismaProductSchema);

        // unset optionGroup1, optionGroup2, optiongroup3

        images.slice(0, images.length);
        relatedCategories.slice(0, relatedCategories.length);
      }
    }

    return csvProducts;
  };

  const buildProductSchema = (boxcartProduct) => {
    const { accountId, product, relatedCategories, images } = boxcartProduct;

    return {
      ...product,
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
                            Digital product variants are not supported. If you
                            have variants, please create them as separate
                            products manually.
                          </p>
                        </li>
                        <Divider />
                        <li className="mt-2">
                          <p className=" font-medium">
                            Digital product quantites are not imported.
                            Quantities are automatically set to unlimited.
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
                          push("/app/account/inventory/digital-products");
                        }}
                        name="Go to digital products"
                      />
                    )}
                  </div>
                </React.Fragment>
              )
            ) : (
              <React.Fragment>
                <BoxLoader />
                <h2>Importing products from Shopify</h2>
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
          Back to digital products
        </button>
      </div>

      <div>
        <h2 className="text-base px-4 py-2">
          How to import <u>digital products</u> from your Shopify store.
        </h2>
        <div className="px-10 py-4 mb-24">
          <ol className="relative border-s border-gray-200 dark:border-gray-700">
            <li className="mb-10 ms-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-purple-200 rounded-full -start-4 ring-2 ring-white dark:ring-gray-900 ">
                <p>1</p>
              </span>
              <h3 className="font-medium leading-tight">Shopify</h3>
              <p className="text-sm font-light">
                Log in to your{" "}
                <a href="https://www.shopify.com/" target="_blank">
                  <u>Shopify account</u>
                </a>
                .
              </p>
            </li>
            <li className="mb-10 ms-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-purple-200 rounded-full -start-4 ring-2 ring-white dark:ring-gray-900 ">
                <p>2</p>
              </span>
              <h3 className="font-medium leading-tight">Products</h3>
              <p className="text-sm font-light">
                Click on
                <b> products</b>.
              </p>
            </li>
            <li className="mb-10 ms-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-purple-200 rounded-full -start-4 ring-2 ring-white dark:ring-gray-900 ">
                <p>3</p>
              </span>
              <h3 className="font-medium leading-tight mb-1">Export</h3>
              <ol>
                <li className="list-disc">
                  <p className="text-sm font-light">
                    Click
                    <b> export </b>
                    and choose products to export.
                  </p>
                </li>
                <li className="list-disc">
                  {" "}
                  <p className="text-sm">
                    Export as
                    <b> Plain CSV file</b>.
                  </p>
                </li>
                <li className="list-disc">
                  <p className="text-sm">
                    Ensure that digital products are not selected.
                  </p>
                </li>
              </ol>
            </li>
            <li className="mb-4 ms-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-purple-200 rounded-full -start-4 ring-2 ring-white dark:ring-gray-900 ">
                <p>4</p>
              </span>
              <h3 className="font-medium leading-tight">Upload Product CSV</h3>
              <p className="text-sm font-light">
                Drag your csv below to import <b>products</b>.
              </p>
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
                <p>5</p>
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

export default Shopify;

Shopify.getLayout = function getLayout(
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

Shopify.pageTitle = "Import Shopify Products";
Shopify.pageIcon = (
  <div className="relative w-8 h-8">
    <Image
      src={shopify_icon}
      alt="shopify logo"
      fill
      className=""
      priority
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  </div>
);
Shopify.pageRoute = "import-shopify";
Shopify.mobilePageRoute = "import-shopify";
