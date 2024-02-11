import React, { useState } from "react";
import AdminLayout from "@/components/layouts/admin/AdminLayout";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import ButtonSecondary from "@/components/global/buttons/ButtonSecondary";
import Papa from "papaparse";
import { IconButton, CircularProgress, Divider, Box } from "@mui/material";
import { ChevronLeft, DeleteOutline, Try } from "@mui/icons-material";
import ButtonFourth from "@/components/global/buttons/ButtonFourth";
import BoxLoader from "@/components/global/loaders/BoxLoader";

function Email() {
  const [uploadedData, setUploadedData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [highlightDropZone, setHighlightDropZone] = useState(false);
  const [uploadedCSVProduct, setUploadedCSVProduct] = useState();
  const [fromEmail, setFromEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [senderName, setSenderName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingSendEmails, setIsLoadingSendEmails] = useState(false);

  const handleInputUpdate = (e) => {
    const { name, value } = e.target;

    if (name === "sender") {
      setSenderName(value);
    }

    if (name === "email") {
      setFromEmail(value);
    }

    if (name === "subject") {
      setSubject(value);
    }
  };

  const handleRemoveCSVProduct = () => {
    setUploadedCSVProduct();
    setHighlightDropZone(false);
    setUploadedData();
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

  const submitCSV = () => {
    setIsLoadingData(true);
    setSuccessMessage("");
    setErrorMessage("");

    Papa.parse(uploadedCSVProduct, {
      skipEmptyLines: true,
      header: true,
      complete: async function (results) {
        const { data } = results;

        const csvSellers = buildData(data);
        setUploadedData(csvSellers);
        setIsLoadingData(false);
      },
    });
  };

  const buildData = (data) => {
    const csvSellers = [];

    for (let i = 0; i < data.length; i++) {
      const currItem = data[i];

      const sellerInfo = {
        receiverName: currItem[`Full name`],
        toEmail: currItem[`Public email`],
      };

      csvSellers.push(sellerInfo);
    }

    return csvSellers;
  };

  const sendEmails = async (e) => {
    e.preventDefault();
    setIsLoadingSendEmails(true);
    setSuccessMessage("");
    setErrorMessage("");

    const promises = [];
    const api = "/api/admin/sendgrid/send-email";

    for (let i = 0; i < uploadedData.length; i++) {
      const currSeller = uploadedData[i];

      const emailData = {
        senderName,
        fromEmail,
        toEmail: currSeller.toEmail,
        receiverName: currSeller.receiverName,
        subject,
      };

      const res = fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      promises.push(res);
    }

    Promise.all(promises)
      .then((data) => {
        let errors = false;
        data.forEach((res) => {
          if (!res.ok) {
            errors = true;
          }
        });

        if (!errors) {
          setSuccessMessage("Emails sent successfully");
          setIsLoadingSendEmails(false);
        } else {
          throw new Error("Error sending emails");
        }
      })
      .catch((error) => {
        console.error("Error sending emails", error);
        setErrorMessage("Error sending emails");
        setIsLoadingSendEmails(false);
      });
  };

  return (
    <div>
      <div className="text-right p-4 absolute right-4">
        {successMessage && <p>{successMessage}</p>}
        {errorMessage && <p>{errorMessage}</p>}
      </div>
      <form onSubmit={sendEmails} className="flex flex-col gap-2 p-4 w-fit">
        <div className="flex gap-2 items-center justify-between">
          <label className="text-black">Sender name:</label>
          <input
            required
            type="text"
            name="sender"
            className="border rounded border-black"
            value={senderName}
            onChange={handleInputUpdate}
          />
        </div>
        <div className="flex gap-2 items-center justify-between">
          <label className="text-black">Sender email:</label>
          <input
            required
            type="email"
            name="email"
            className="border rounded border-black"
            value={fromEmail}
            onChange={handleInputUpdate}
          />
        </div>
        <div className="flex gap-2 items-center justify-between">
          <label className="text-black">Subject:</label>
          <input
            required
            type="text"
            name="subject"
            className="border rounded border-black"
            value={subject}
            onChange={handleInputUpdate}
          />
        </div>
        <p>CSV Column Values (Full name, email)</p>

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
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
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
            <div className="flex items-center gap-2 rounded px-2 w-fit">
              <p className="text-sm font-light">{uploadedCSVProduct.name}</p>
              <ButtonFourth
                type="button"
                name="remove"
                handleClick={handleRemoveCSVProduct}
              />
            </div>
          )}
        </div>

        <div className="w-fit">
          {isLoadingData ? (
            <BoxLoader />
          ) : (
            uploadedCSVProduct &&
            !uploadedData && (
              <ButtonSecondary
                type="button"
                handleClick={submitCSV}
                name="Upload CSV"
              />
            )
          )}
        </div>
        {uploadedData && (
          <div className="w-fit">
            {isLoadingSendEmails ? (
              <BoxLoader />
            ) : (
              <ButtonPrimary name="Send Emails" type="submit" />
            )}
          </div>
        )}
      </form>
    </div>
  );
}

export default Email;

Email.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
