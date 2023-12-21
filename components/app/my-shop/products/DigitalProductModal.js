import React from "react";
import { Box } from "@mui/system";
import Modal from "@mui/material/Modal";
import Image from "next/image";
import { Divider, IconButton } from "@mui/material";
import pdf_download_icon from "@/public/images/icons/pdf_download_icon.png";
import CloseIcon from "@mui/icons-material/Close";
import ButtonFilter from "@/components/global/buttons/ButtonFilter";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import ReviewComponent from "@/components/storefront/reviews/ReviewComponent";
import Link from "next/link";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  "@media (min-width: 769px)": {
    width: "65%",
  },
  "@media (min-width: 1025px)": {
    width: "45%",
  },
  maxHeight: "80%",
  overflow: "scroll",
  bgcolor: "var(--white)",
  border: "1px solid var(--black-design-extralight)",
  borderRadius: "8px",
  boxShadow: "var(--modal-shadow)",
};

function DigitalProductModal({
  isCardModalOpen,
  handleClickListenerExpand,
  toggleDrawer,
  product,
  categories,
  account,
  handleOpenSnackbar,
}) {
  const {
    id,
    productName,
    priceStr,
    salePriceStr,
    digitalFiles,
    description,
    relatedCategories,
    reviews,
    defaultImage,
  } = product;

  const handleEditClick = (e) => {
    toggleDrawer("right", true)(e);
    handleClickListenerExpand();
  };

  return (
    <Modal
      open={isCardModalOpen}
      onClose={handleClickListenerExpand}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className="p-4">
          <div className="flex items-center justify-between border-b mb-2">
            <h3>Digial product details:</h3>
            <IconButton onClick={handleClickListenerExpand}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
          <div className="w-full relative px-4">
            <h4 className="mb-2 text-black font-semibold text-sm lg:text-base ">
              Cover image:
            </h4>
            <div className="self-start min-w-[30%] relative sm:w-[20%] lg:w-[30%]">
              <div className="w-full h-full relative aspect-square">
                <Image
                  src={defaultImage}
                  alt="pdf cover image"
                  fill
                  priority={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="rounded-ss object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
          <div className="my-2">
            <Divider />
          </div>
          <div className="w-full relative px-4">
            <h4 className="text-black font-semibold text-sm lg:text-base ">
              Files:
            </h4>

            <div className="flex overflow-x-scroll w-full mt-4 gap-2 pb-4">
              {digitalFiles && digitalFiles.length !== 0 ? (
                digitalFiles.map((file, idx) => {
                  const { name, uploadedFile } = file;
                  return (
                    <Link
                      href={uploadedFile}
                      target="_blank"
                      key={idx}
                      className="flex flex-col items-center w-1/3"
                    >
                      <div
                        className={`relative h-[7rem] min-w-[7rem] inline-block $`}
                      >
                        <Image
                          src={pdf_download_icon}
                          alt="pdf icon"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className=" object-scale-down rounded inline-block"
                        />
                      </div>
                      <p className="text-xs text-center font-extralight w-full truncate">
                        {name}
                      </p>
                    </Link>
                  );
                })
              ) : (
                <div className="h-32 w-32 border roudned flex justify-center items-center text-[color:var(--gray-text)] text-sm font-light">
                  Image
                </div>
              )}
            </div>

            <p className="text-xs text-right text-[color:var(--gray)] font-light mt-2">
              {digitalFiles && digitalFiles.length} files uploaded.
            </p>
          </div>
          <div className="flex justify-between items-start relative w-full">
            <div className="flex flex-col gap-2 pt-2 pb-4 px-4">
              <h4 className="font-medium lg:text-base">{productName}</h4>
              <div className="flex gap-2 items-end text-xs font-light lg:text-sm ">
                <p className="font-medium">Price:</p>
                {salePriceStr && salePriceStr !== "" ? (
                  <span>
                    <span>{salePriceStr}</span>
                    <span className=" line-through text-xs font-extralight ml-2 text-gray-500">
                      {priceStr}
                    </span>
                  </span>
                ) : (
                  <span>{priceStr}</span>
                )}
              </div>
              <p className="text-xs font-light lg:text-sm">
                <b className=" font-medium">Description: </b>
                {description}
              </p>

              <p className="text-xs font-light lg:text-sm">
                <b className=" font-medium">Category: </b>{" "}
                {relatedCategories && relatedCategories.length > 0
                  ? relatedCategories.map((category, idx) => {
                      const { categoryName } = category;
                      const relatedCategoriesLength = relatedCategories.length;
                      if (idx === relatedCategoriesLength - 1)
                        return <span key={categoryName}>{categoryName}</span>;

                      return <span key={categoryName}>{categoryName}, </span>;
                    })
                  : "n/a"}
              </p>
            </div>
          </div>

          <div className="border-t border-[color:var(--gray-light)] mb-8">
            <ReviewComponent
              // getReviews={getReviews}
              isOwner={true}
              product={product}
              account={account}
              reviews={reviews}
              handleOpenSnackbar={handleOpenSnackbar}
            />
          </div>
        </div>
        <div className="flex sticky z-10 p-4 bg-white bottom-0 gap-4 py-4 border-t">
          <ButtonFilter name="Close" handleClick={handleClickListenerExpand} />
          <ButtonPrimary name="Edit" handleClick={handleEditClick} />
        </div>
      </Box>
    </Modal>
  );
}

export default DigitalProductModal;
