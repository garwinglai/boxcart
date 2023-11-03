import React, { useState, useEffect } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import {
  csvProductTemplate,
  csvSampleProductTemplate,
} from "@/helper/temp/tempData";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import ButtonSecondary from "@/components/global/buttons/ButtonSecondary";
import { Divider } from "@mui/material";
import Papa from "papaparse";
import ButtonThird from "@/components/global/buttons/ButtonThird";
import { useAccountStore } from "@/lib/store";
import BoxLoader from "@/components/global/loaders/BoxLoader";
import Alert from "@mui/material/Alert";

function BatchProductUpload() {
  const accountStore = useAccountStore((state) => state.account);

  const [uploadedCsvFile, setUploadedCsvFile] = useState(null);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [uploadedFileCount, setUploadedFileCount] = useState(0);
  const [uploadError, setUploadError] = useState(false);
  const [uploadErrorMessage, setUploadErrorMessage] = useState("");
  const [failedProductsUploaded, setFailedProductsUploaded] = useState([]);
  const [isDeviceOnMobile, setIsDeviceOnMobile] = useState(true);

  useEffect(() => {
    // device is considered mobile if it's a tablet or smaller
    const windowWidth = window.innerWidth;
    if (windowWidth <= 768) {
      setIsDeviceOnMobile(true);
    } else {
      setIsDeviceOnMobile(false);
    }
  }, []);

  const handleFileUploadChange = (e) => {
    const file = e.target.files[0];
    setUploadErrorMessage("");

    if (!file) {
      setUploadedCsvFile(null);
      return;
    }

    Papa.parse(file, {
      skipEmptyLines: true,
      complete: function (results) {
        const { data } = results;
        setUploadedCsvFile(data);
      },
    });
  };

  const handleDownloadTemplateCSV = (csvProductTemplate, isExample) => (e) => {
    const template = buildCSV(csvProductTemplate);
    downloadCSVTemplate(template, isExample);
  };

  const buildCSV = (csvProductTemplate) => {
    const csvRows = [];

    const tableNames = buildTableNames(csvProductTemplate);
    csvRows.push(tableNames);

    const tableValues = Object.values(csvProductTemplate).join(",");
    csvRows.push(tableValues);

    const buildCSVRows = csvRows.join("\n");
    return buildCSVRows;
  };

  const buildTableNames = (csvProductTemplate) => {
    const tableNames = Object.keys(csvProductTemplate)
      .map((name) => {
        if (name == "productName") return "product name";
        if (name == "quantity") return "quantity ('unlimited' or number)";
        if (name == "category1") return "category 1 (optional)";
        if (name == "category2") return "category 2 (optional)";
        if (name == "category3") return "category 3 (optional)";
        if (name == "customNote")
          return "(yes or no) allow customers to leave a note?";
        if (name == "customerUploads")
          return "(yes or no) allow customers to upload images?";
        if (name == "question1")
          return "question 1 (ask your customer a question) (optional)";
        if (name == "question2") return "question 2 (optional)";
        if (name == "question3") return "question 3 (optional)";
        if (name == "question4") return "question 4 (optional)";
        if (name == "question5") return "question 5 (optional)";

        return name;
      })
      .join(",");

    return tableNames;
  };

  const downloadCSVTemplate = (template, isExample) => {
    const csvProductTemplateBlob = new Blob([template], {
      type: "text/csv",
    });

    const fileName = isExample ? "example_template.csv" : "batch_template.csv";
    const csvProductTemplateUrl = URL.createObjectURL(csvProductTemplateBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = csvProductTemplateUrl;
    downloadLink.download = fileName;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleUploadProductsFromCsv = (uploadedCsvFile) => async (e) => {
    setIsUploadingFiles(true);
    const builtCsvData = buildUploadData(uploadedCsvFile);

    const batchProductUploadApiEndPoint =
      "/api/private/inventory/product/create-batch-products";

    const res = await fetch(batchProductUploadApiEndPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(builtCsvData),
    });
    const data = await res.json();
    const { savedCount, errorCount, savedProducts, productWithErrors } = data;

    setUploadedCsvFile(null);

    if (errorCount > 0) {
      setUploadError(true);
      setUploadErrorMessage(
        "Some products did not upload. Please check your csv file and re-uploade the products."
      );
      const failedProductNames = productWithErrors.map(
        (item) => item.product.productName
      );
      setFailedProductsUploaded(failedProductNames);
      setIsUploadingFiles(false);
      return;
    }

    setUploadedFileCount(savedCount);
  };

  const buildUploadData = (data) => {
    const csvProducts = [];

    for (let i = 0; i < data.length; i++) {
      const currRow = data[i];
      const product = {
        productName: "",
        description: "",
        priceIntPenny: 0,
        priceStr: "",
        hasUnlimitedQuantity: false,
        quantity: "",
        enableCustomNote: false,
        enableCustomerImageUploads: false,
      };
      const relatedCategories = [];
      const questions = [];
      //Skip the first iteration. 1st iteration is file name and 2nd iteraton is table names
      if (i == 0 || i == 1) continue;

      for (let j = 0; j < currRow.length; j++) {
        const rowText = currRow[j];

        switch (j) {
          case 0: //* Product Name
            product.productName = rowText;
            break;

          case 1: //* Product description
            product.description = rowText;
            break;

          case 2: //* Product price
            const priceIntPenny = parseFloat(rowText.slice(1)) * 100;
            product.priceIntPenny = priceIntPenny;
            product.priceStr = rowText;
            break;

          case 3: //* Product quantity
            const rowTextLower = rowText.toLowerCase();

            if (rowTextLower == "unlimited") {
              product.hasUnlimitedQuantity = true;
              product.quantity = null;
            } else {
              product.quantity = parseInt(rowText);
              product.hasUnlimitedQuantity = false;
            }
            break;

          case 4: //* 4-6 Related Categories
            if (rowText != "") {
              relatedCategories.push({ categoryName: rowText });
            }
            break;
          case 5:
            if (rowText != "") {
              relatedCategories.push({ categoryName: rowText });
            }
            break;
          case 6:
            if (rowText != "") {
              relatedCategories.push({ categoryName: rowText });
            }
            break;

          case 7: //* 7-11 Questions
            if (rowText != "") {
              questions.push({
                question: rowText,
                productName: product.productName,
              });
            }
            break;
          case 8:
            if (rowText != "") {
              questions.push({
                question: rowText,
                productName: product.productName,
              });
            }
            break;
          case 9:
            if (rowText != "") {
              questions.push({
                question: rowText,
                productName: product.productName,
              });
            }
            break;
          case 10:
            if (rowText != "") {
              questions.push({
                question: rowText,
                productName: product.productName,
              });
            }
            break;
          case 11:
            if (rowText != "") {
              questions.push({
                question: rowText,
                productName: product.productName,
              });
            }
            break;

          case 12: //* 12 Enable custom note
            if (rowText == "yes") {
              product.enableCustomNote = true;
            } else {
              product.enableCustomNote = false;
            }
            break;

          case 13: //* 13 Enable customer image uploads
            if (rowText == "yes") {
              product.enableCustomerImageUploads = true;
            } else {
              product.enableCustomerImageUploads = false;
            }
            break;

          default:
            break;
        }
      }

      const csvData = {
        accountId: parseInt(accountStore.accountId),
        product,
        questions,
        relatedCategories,
      };

      csvProducts.push(csvData);
    }

    const batchData = csvProducts.map((batch) => {
      const { accountId, product, questions, relatedCategories } = batch;

      const builtBatch = {
        ...product,
        questions: {
          create: questions,
        },
        relatedCategories: {
          connectOrCreate: relatedCategories.map((category) => {
            const { categoryName } = category;

            const category_identifier = {
              accountId,
              categoryName,
            };

            return {
              where: {
                category_identifier,
              },
              create: {
                categoryName,
                account: {
                  connect: {
                    id: accountId,
                  },
                },
              },
            };
          }),
        },
        account: {
          connect: {
            id: accountId,
          },
        },
      };

      return builtBatch;
    });

    return batchData;
  };

  return (
    <div className="p-4">
      <div className="">
        <h4>How to upload your products in a batch:</h4>
        <ul className="mt-2">
          <li className="text-sm indent-4">
            1. Download the template csv file.
          </li>
          <li className="text-sm indent-4">
            2. Input your product details in the file.
          </li>
          <li className="text-sm indent-4">3. Upload the file below.</li>
        </ul>
      </div>
      <div className="my-4">
        <h4>Important notes:</h4>
        <ul>
          <li className="text-sm indent-4">• Images uploads not supported.</li>
          <li className="text-sm indent-4">• Product options not supported.</li>
          <li className="text-xs indent-8">• ex: sizes, flavor, etc.</li>
          <li className="text-sm indent-4">
            • Upload images &amp; options individually.
          </li>
          <li className="text-sm indent-4">
            • Please make sure to upload a .csv file.
          </li>
        </ul>
      </div>
      <Divider />
      <div className="mt-4">
        {!isDeviceOnMobile ? (
          <React.Fragment>
            <div>
              <h4>Download template csv:</h4>
              <div className="flex gap-8 justify-center mt-4 lg:justify-start">
                <div>
                  <ButtonSecondary
                    handleClick={handleDownloadTemplateCSV(
                      csvSampleProductTemplate,
                      "isExample"
                    )}
                    name="Example .csv"
                  />
                </div>
                <div>
                  <ButtonPrimary
                    handleClick={handleDownloadTemplateCSV(csvProductTemplate)}
                    name="Template .csv"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col">
              <label
                htmlFor="csvFile"
                className="text-[color:var(--black-design-extralight)] font-medium"
              >
                Upload file
              </label>
              <input
                type="file"
                id="csvFile"
                accept=".csv"
                onChange={handleFileUploadChange}
                className="mt-1 text-sm"
              />
            </div>
          </React.Fragment>
        ) : (
          <div className="mt-8">
            <h5>*Batch upload only works on desktop.</h5>
          </div>
        )}
        {uploadedFileCount > 0 && (
          <div className="mt-4">
            <Alert severity="success">
              Success. {uploadedFileCount} uploaded.
            </Alert>
          </div>
        )}
        {uploadError && (
          <div className="mt-4">
            <Alert severity="error">{uploadErrorMessage}</Alert>
          </div>
        )}
        {failedProductsUploaded.length > 0 && (
          <div className="mt-4">
            <h5>Failed product uploads:</h5>
            <ul>
              {failedProductsUploaded.map((product, index) => {
                return (
                  <li key={index} className="text-sm">
                    • {product}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        {uploadedCsvFile && (
          <div className="w-fit mt-4">
            {isUploadingFiles ? (
              <div className="p-4">
                <BoxLoader />
                <div className="mt-5">
                  <p>Uploading...</p>
                  <p>Please do not leave this page or refresh.</p>
                  <p className="">This may take a few minutes.</p>
                </div>
              </div>
            ) : (
              <ButtonThird
                name="Upload"
                handleClick={handleUploadProductsFromCsv(uploadedCsvFile)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BatchProductUpload;

BatchProductUpload.getLayout = function getLayout(
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

BatchProductUpload.pageTitle = "Batch Product";
BatchProductUpload.pageIcon = <DriveFolderUploadIcon />;
BatchProductUpload.pageRoute = "batch-products";
BatchProductUpload.mobilePageRoute = "batch-products";
