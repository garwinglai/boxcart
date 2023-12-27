import React from "react";
import AppLayout from "@/components/layouts/AppLayout";
import etsy_icon from "@/public/images/icons/account/etsy_icon.png";
import Image from "next/image";
import { useRouter } from "next/router";
import { IconButton } from "@mui/material";
import { ChevronLeft } from "@mui/icons-material";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";

function Etsy() {
  const { push } = useRouter();

  const handleBackToProducts = () => {
    push("/app/account/inventory/products");
  };

  return (
    <div>
      <div className="flex items-center p-1">
        <IconButton onClick={handleBackToProducts}>
          <ChevronLeft fontSize="small" />
        </IconButton>
        <button onClick={handleBackToProducts} className="text-xs">
          Back to products
        </button>
      </div>

      <div>
        <h2 className="text-base p-4">
          How to import products from your Etsy store.
        </h2>
        <div className="px-10 py-4 mb-24">
          <ol class="relative border-s border-gray-200 dark:border-gray-700">
            <li class="mb-10 ms-6">
              <span class="absolute flex items-center justify-center w-8 h-8 bg-purple-200 rounded-full -start-4 ring-2 ring-white dark:ring-gray-900 ">
                <p>1</p>
              </span>
              <h3 class="font-medium leading-tight">Etsy</h3>
              <p class="text-sm font-light">
                Log in to your{" "}
                <a href="https://www.etsy.com/" target="_blank">
                  <u>Etsy account</u>
                </a>
                .
              </p>
            </li>
            <li class="mb-10 ms-6">
              <span class="absolute flex items-center justify-center w-8 h-8 bg-purple-200 rounded-full -start-4 ring-2 ring-white dark:ring-gray-900 ">
                <p>2</p>
              </span>
              <h3 class="font-medium leading-tight">Shop manager</h3>
              <p class="text-sm font-light">Navigate to your shop manager.</p>
            </li>
            <li class="mb-10 ms-6">
              <span class="absolute flex items-center justify-center w-8 h-8 bg-purple-200 rounded-full -start-4 ring-2 ring-white dark:ring-gray-900 ">
                <p>3</p>
              </span>
              <h3 class="font-medium leading-tight">Settings</h3>
              <p class="text-sm font-light">
                Click on
                <b> settings</b>.
              </p>
            </li>
            <li class="mb-10 ms-6">
              <span class="absolute flex items-center justify-center w-8 h-8 bg-purple-200 rounded-full -start-4 ring-2 ring-white dark:ring-gray-900 ">
                <p>4</p>
              </span>
              <h3 class="font-medium leading-tight">Option</h3>
              <p class="text-sm font-light">
                Click on <b>options</b>.
              </p>
            </li>
            <li class="mb-10 ms-6">
              <span class="absolute flex items-center justify-center w-8 h-8 bg-purple-200 rounded-full -start-4 ring-2 ring-white dark:ring-gray-900 ">
                <p>5</p>
              </span>
              <h3 class="font-medium leading-tight">Download</h3>
              <p class="text-sm font-light">
                Click <b>Download Data</b>, then
              </p>
              <p class="text-sm font-light">
                <b>Download CSV </b>
                under "Currently for Sale Listings".
              </p>
            </li>
            <li class="mb-4 ms-6">
              <span class="absolute flex items-center justify-center w-8 h-8 bg-purple-200 rounded-full -start-4 ring-2 ring-white dark:ring-gray-900 ">
                <p>6</p>
              </span>
              <h3 class="font-medium leading-tight">Upload CSV</h3>
              <p class="text-sm font-light">Drag your csv below.</p>
              <div className="py-4 ">
                <div class="flex items-center justify-center w-full">
                  <label
                    for="dropzone-file"
                    class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div class="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p class="mb-2 text-sm text-gray-500 text-center dark:text-gray-400">
                        <span class="font-semibold">Click to upload</span> or
                        drag and drop
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        (CSV only)
                      </p>
                    </div>
                    <input id="dropzone-file" type="file" class="hidden" />
                  </label>
                </div>
              </div>
            </li>
            <li class="ms-6">
              <span class="absolute flex items-center justify-center w-8 h-8 bg-purple-200 rounded-full -start-4 ring-2 ring-white dark:ring-gray-900 ">
                <p>7</p>
              </span>
              <h3 class="font-medium leading-tight">Complete</h3>
              <div className="w-fit h-8 mt-2">
                <ButtonPrimary name="Complete upload" />
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
