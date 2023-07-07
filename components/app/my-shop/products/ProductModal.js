import React from "react";
import { Box } from "@mui/system";
import Modal from "@mui/material/Modal";
import Image from "next/image";
import { IconButton } from "@mui/material";
import { IOSSwitch } from "@/components/global/switches/IOSSwitch";
import CloseIcon from "@mui/icons-material/Close";
import candle_4 from "@/public/images/temp/candle_4.jpeg";
import candle_2 from "@/public/images/temp/candle_2.jpeg";
import custom_mug from "@/public/images/temp/custom_mug.jpg";
import ButtonFilter from "@/components/global/buttons/ButtonFilter";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  maxHeight: "80%",
  overflow: "scroll",
  bgcolor: "var(--white)",
  border: "1px solid var(--black-design-extralight)",
  borderRadius: "8px",
  boxShadow: "var(--modal-shadow)",
  p: 2,
};

function ProductModal({
  isCardModalOpen,
  handleClickListenerExpand,
  isItemEnabled,
  toggleDrawer,
  state,
  handleSwitchChange,
  product,
  categories,
}) {
  const {
    id,
    isEnabled,
    productName,
    priceIntPenny,
    priceStr,
    defaultImgStr,
    imgArrJson,
    description,
    quantity,
    isQuantityByProduct,
    questions,
    optionGroups,
    relatedCategories,
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
          <div className="flex overflow-x-scroll w-full gap-2 my-1">
            <div className={`relative h-[8rem] min-w-[8rem] inline-block $`}>
              <Image
                src={candle_4}
                alt="candle image"
                fill
                className="object-cover rounded inline-block"
              />
            </div>
            <div className={`relative h-[8rem] min-w-[8rem] inline-block $`}>
              <Image
                src={candle_2}
                alt="product image"
                fill
                className="object-cover rounded inline-block"
              />
            </div>
            <div className={`relative h-[8rem] min-w-[8rem] inline-block $`}>
              <Image
                src={custom_mug}
                alt="product image"
                fill
                className="object-cover rounded inline-block"
              />
            </div>
          </div>
          <p className="text-xs text-right text-[color:var(--gray)] font-light mt-4">
            3 images uploaded.
          </p>
        </div>
        <div className="flex justify-between items-start relative w-full">
          <div className="flex flex-col gap-2 py-2 px-4">
            <h4 className="font-medium lg:text-base">{productName}</h4>
            <div className="flex gap-2 items-end text-xs font-light lg:text-sm ">
              <p className="font-medium">Price:</p>
              <p>{priceStr}</p>
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
        <div className="flex items-center justify-end gap-1 mt-4 border-y py-2 mx-4">
          <p
            className={`text-xs  ${
              isItemEnabled
                ? "text-[color:var(--primary-dark-med)] "
                : "text-[color:var(--gray-text)] "
            }`}
          >
            Visible in store
          </p>
          <IOSSwitch checked={isItemEnabled} onChange={handleSwitchChange} />
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
                const { optionGroupName, options, id: groupId } = group;

                return (
                  <div className="px-8 pt-2" key={groupId}>
                    <h5 className="text-sm mb-2">{optionGroupName}:</h5>
                    {options.map((option) => {
                      const {
                        id: optionId,
                        optionName,
                        priceStr,
                        imgStr,
                        optionGroupId,
                        quantityStr,
                        quantityInt,
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
                              {quantityStr && (
                                <p className="font-extralight">
                                  ({quantityStr} left)
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
                    <p key={id} className="font-extralight text-xs md:text-sm">
                      {question}
                    </p>
                  );
                })
              )}
            </div>
          </div>
          <div className="flex gap-4">
            <ButtonFilter
              name="Close"
              handleClick={handleClickListenerExpand}
            />
            <ButtonPrimary name="Edit" handleClick={handleEditClick} />
          </div>
        </div>
      </Box>
    </Modal>
  );
}

export default ProductModal;
