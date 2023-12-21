import React from "react";
import { Box } from "@mui/system";
import Modal from "@mui/material/Modal";
import Image from "next/image";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import candle_2 from "@/public/images/temp/candle_2.jpeg";
import ButtonFilter from "@/components/global/buttons/ButtonFilter";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import ReviewComponent from "@/components/storefront/reviews/ReviewComponent";

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

function ProductModal({
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
    isEnabled,
    productName,
    priceIntPenny,
    priceStr,
    salePriceStr,
    images,
    imgArrJson,
    description,
    quantity,
    isQuantityByProduct,
    questions,
    optionGroups,
    relatedCategories,
    reviews,
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
            <h3>Product Details</h3>
            <IconButton onClick={handleClickListenerExpand}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
          <div className="w-full relative px-4">
            <h4 className="text-black font-semibold text-sm lg:text-base ">
              Photos:
            </h4>

            <div className="flex overflow-x-scroll w-full mt-4 gap-2 pb-4">
              {images && images.length !== 0 ? (
                images.map((photo, idx) => {
                  const { image, imgFileName, isDefault } = photo;
                  return (
                    <div
                      key={idx}
                      className={`relative h-[7rem] min-w-[7rem] inline-block $`}
                    >
                      <Image
                        src={image}
                        alt={imgFileName}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover rounded inline-block"
                      />
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

            <p className="text-xs text-right text-[color:var(--gray)] font-light mt-2">
              {images && images.length} images uploaded.
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
                <b className=" font-medium">Qty: </b>
                {quantity ? quantity : "set for product options"}
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
          <div className="border-t border-[color:var(--gray-light)]">
            <div className="p-4 border-b border-[color:var(--gray-light)] ">
              <h4 className="text-sm font-medium">Product options</h4>
              {optionGroups.length === 0 ? (
                <p className="text-xs font-extralight text-[color:var(--gray-text)] text-center mt-4 md:text-sm">
                  No options available
                </p>
              ) : (
                optionGroups.map((group) => {
                  const {
                    optionGroupName,
                    options,
                    id: groupId,
                    selectionDisplay,
                    isRequiredDisplay,
                  } = group;

                  return (
                    <div className="px-8 pt-2" key={groupId}>
                      <div className="flex justify-between items-center  mb-2">
                        <span className="flex items-center gap-2">
                          <h5 className="text-sm">{optionGroupName}:</h5>
                        </span>
                        <p className="text-xs font-extralight">
                          {isRequiredDisplay} - ({selectionDisplay})
                        </p>
                      </div>
                      {options.map((option) => {
                        const {
                          id: optionId,
                          optionName,
                          priceStr,
                          imgStr,
                          optionGroupId,
                          quantity,
                        } = option;

                        if (optionGroupId == groupId) {
                          return (
                            <div
                              key={optionId}
                              className="flex justify-between items-center pl-2 font-light text-xs mb-1 md:text-sm"
                            >
                              <div className="flex items-center gap-2">
                                {imgStr && (
                                  <Image
                                    src={candle_2}
                                    alt="image"
                                    className="rounded object-cover w-10 h-10"
                                  />
                                )}
                                <p className="font-extralight">{optionName}</p>
                                {quantity && (
                                  <p className="font-extralight">
                                    ({quantity} left)
                                  </p>
                                )}
                              </div>
                              <p className="font-extralight">{priceStr}</p>
                            </div>
                          );
                        }
                      })}
                    </div>
                  );
                })
              )}
            </div>
            <div className="p-4">
              <h4 className="text-sm font-medium">Questions for customers</h4>
              <div className="px-8 pt-2">
                {questions.length === 0 ? (
                  <p className="text-xs font-extralight text-[color:var(--gray-text)] text-center mt-4 md:text-sm">
                    No questions
                  </p>
                ) : (
                  questions.map((item) => {
                    const { question, id } = item;

                    return (
                      <p
                        key={id}
                        className="font-extralight text-xs md:text-sm"
                      >
                        {question}
                      </p>
                    );
                  })
                )}
              </div>
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

export default ProductModal;
