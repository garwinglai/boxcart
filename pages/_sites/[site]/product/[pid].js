import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import ShareIcon from "@mui/icons-material/Share";
import { IconButton } from "@mui/material";
// import { products } from "@/helper/temp/tempData";
import Image from "next/image";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import RadioGroupComponent from "@/components/storefront/options/RadioGroupComponent";
import CheckGroupComponent from "@/components/storefront/options/CheckGroupComponent";
import ButtonPrimaryStorefront from "@/components/global/buttons/ButtonPrimaryStorefront";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ShopLayout from "@/components/layouts/storefront/ShopLayout";
import prisma from "@/lib/prisma";

// generate item quantity constant to 100 values in an array from 1
const unlimitedQuantity = Array.from({ length: 100 }, (_, i) => i + 1);

function Product({ product }) {
  // console.log("product", producted);
  const [selectedQuantity, setSelectedQuantity] = useState("1");
  const [exampleImages, setExampleImages] = useState([]);

  // const product = products[0];
  const {
    id,
    name,
    description,
    priceStr,
    reviewStr,
    reviewDouble,
    reviewCountStr,
    quantity,
    images,
    hasUnlimitedQuantity,
    setQuantityByProduct,
    optionGroups,
    questions,
    enableCustomNote,
  } = product;
  // Show default image first
  const imgArr = images.sort((a, b) => b.isDefault - a.isDefault);

  // create an array from 1 to quantity
  const productQuantity = Array.from({ length: quantity }, (_, i) => i + 1);

  const router = useRouter();
  const selectRef = useRef(null);

  function handleBack() {
    router.back();
  }

  function handleShare() {
    // window.alert("share clicked");
  }

  const handleArrowClick = () => {
    // selectRef.current.focus();
    selectRef.current.click();
  };

  const handleQuantityChange = (event) => {
    setSelectedQuantity(event.target.value);
  };

  function handleExampleFile(e) {
    const selectedImage = e.target.files[0];
    if (!selectedImage) return;

    const fileName = selectedImage.name;
    const imgUrl = URL.createObjectURL(selectedImage);
    const imgData = { imgUrl, fileName };

    if (exampleImages.length < 3) {
      setExampleImages((prev) => [...prev, imgData]);
    }
  }

  function handleRemoveImage(e, item) {
    const { fileName, imgUrl } = item;
    const remainingImages = exampleImages.filter(
      (item) => item.fileName !== fileName
    );

    setExampleImages(remainingImages);
  }

  function displayOptions(optionGroups) {
    return (
      <div className="">
        {optionGroups.map((group, index) => {
          const { id, selectionType, options, isRequired } = group;
          if (selectionType === 0) {
            return <RadioGroupComponent key={id} currOption={group} />;
          }

          if (selectionType === 1) {
            return <CheckGroupComponent key={id} currOption={group} />;
          }
        })}
      </div>
    );
  }

  function displayNote() {
    return (
      <div className="flex flex-col pt-4 pb-6 px-6">
        <h4 className="font-medium text-sm">Custom note:</h4>
        <label
          htmlFor="customNote"
          className="text-[color:var(--gray-text)] font-extralight mb-2 text-sm"
        >
          Have something to add? Let us know here!
        </label>
        <textarea
          name="customNote"
          id="customNote"
          rows={5}
          className="border border-[color:var(--black-design-extralight)] focus:outline-[color:var(--black)] p-2 "
        />
      </div>
    );
  }

  function displayQuestions(questions) {
    return questions.map((item) => {
      const { id, question, isRequired } = item;

      return (
        <div key={id} className="flex flex-col pt-4 pb-6 px-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-sm">{question}</h4>
            <p className="text-xs font-extralight opacity-70">
              {isRequired ? "required" : "optional"}
            </p>
          </div>
          <textarea
            name="customNote"
            id="customNote"
            rows={1}
            className="border border-[color:var(--black-design-extralight)] focus:outline-[color:var(--black)] p-2 "
          />
        </div>
      );
    });
  }

  return (
    <div className="md:flex md:relative md:w-full md:px-8 md:pb-8 md:gap-4  md:overflow-hidden">
      <div className="md:w-[65%] md:overflow-y-scroll">
        <div className="flex justify-between items-center my-1 mx-2 md:ml-0 md:my-4">
          <IconButton onClick={handleBack} className="flex items-center">
            <ChevronLeftIcon
              fontSize="medium"
              sx={{ color: "var(--black-design-extralight)" }}
            />
            <p className="font-light text-sm text-[color:var(--black-design-extralight)]">
              Back
            </p>
          </IconButton>
          <div className="rounded-full">
            <IconButton onClick={handleShare}>
              <ShareIcon
                fontSize="small"
                sx={{ color: "var(--black-design-extralight)" }}
              />
            </IconButton>
          </div>
        </div>
        <div className="flex overflow-x-scroll w-full md:grid md:grid-cols-2 lg:w-5/6 lg:mx-auto xl:w-3/4">
          {images.map((imgItem, index) => {
            const { isDefault, image, id } = imgItem;

            return (
              <div
                key={id}
                className={`min-w-full relative aspect-square ${
                  isDefault ? "md:col-span-2" : "md:col-span-1 "
                }`}
              >
                <Image
                  src={image}
                  alt="product image"
                  fill
                  key={index}
                  className="object-cover snap-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            );
          })}
        </div>
        <div className="text-center md:hidden">
          <MoreHorizIcon
            fontSize="medium"
            sx={{ color: "var(--gray-light-med)" }}
          />
        </div>
      </div>
      <div className="md:w-[35%] md:pt-10 md:sticky md:top-0">
        <div className="flex flex-col gap-2 px-6 pb-4 mb-4 border-b border-[color:var(--gray-light)]">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">{name}</h3>
            <p className="font-medium">{priceStr}</p>
          </div>
          <div className="flex justify-between gap-4  md:flex-col-reverse md:items-start md:gap-2">
            <p className="font-light text-sm text-[color:var(--gray)] ">
              {description}
            </p>
            {/* <div className="flex flex-col items-end md:items-start">
							<p className="text-[color:var(--gray-text)] font-extralight text-xs">{`(${reviewCountStr})`}</p>

							<Rating
								name="read-only"
								defaultValue={reviewDouble}
								precision={0.5}
								readOnly
								size="small"
							/>
						</div> */}
          </div>
        </div>
        <div className="relative px-6 pb-6">
          <label
            htmlFor="quantitySelect"
            className="block mb-1 font-medium text-sm text-[color:var(--black-design-extralight)] "
            ref={selectRef}
          >
            Item Quantity:
          </label>
          <select
            id="quantitySelect"
            value={selectedQuantity}
            onChange={handleQuantityChange}
            className="appearance-none w-full px-4 py-2 border text-sm font-light border-gray-300 rounded focus:outline-[color:var(--third)] "
          >
            {hasUnlimitedQuantity ? (
              unlimitedQuantity.map((item, idx) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))
            ) : setQuantityByProduct ? (
              productQuantity.map((item, idx) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))
            ) : (
              <>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </>
            )}
          </select>
        </div>
        <div className="border-y py-8 my-4">{displayOptions(optionGroups)}</div>
        {displayQuestions(questions)}
        {enableCustomNote && displayNote()}
        <div className="border-t py-4">
          <div className="flex items-center justify-between px-6">
            <h4 className="font-medium text-sm">Upload examples:</h4>
            <p className="text-xs font-extralight opacity-70">optional</p>
          </div>
          <div className="flex flex-row-reverse justify-between gap-4 items-center px-6 pt-4">
            <p className="text-xs font-extralight">3 uploads max</p>
            {exampleImages.length < 3 && (
              <label
                htmlFor="file"
                aria-disabled
                className="text-white bg-[color:var(--black-design-extralight)] font-extralight text-xs px-4 py-2 active:bg-black"
              >
                Upload image
                <input
                  type="file"
                  id="file"
                  accept="image/"
                  onChange={handleExampleFile}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
        <div className="flex overflow-x-scroll w-full gap-2 px-6 py-4">
          {exampleImages.length !== 0 &&
            exampleImages.map((item, idx) => (
              <div key={idx} className="flex flex-col max-w-[5rem] gap-1">
                <div className="relative h-[5rem] min-w-[5rem] inline-block">
                  <Image
                    src={item.imgUrl}
                    alt={item.fileName}
                    fill
                    className="object-cover inline-block"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute bg-[color:var(--black-design-extralight)] rounded-full right-1 top-1 opacity-70">
                    <IconButton onClick={(e) => handleRemoveImage(e, item)}>
                      <CloseIcon
                        sx={{
                          color: "var(--white)",
                          fontSize: "0.75rem",
                        }}
                      />
                    </IconButton>
                  </div>
                </div>
                <p className="truncate font-extralight text-xs">
                  {item.fileName}
                </p>
              </div>
            ))}
        </div>
        <div className="sticky bottom-0 p-4 mt-20 flex flex-col gap-2 bg-white border-t border-[color:var(--gray-light-med)] md:border-none md:mt-8">
          {/* <div className="h-10">
            <ButtonSecondaryStorefront name="1 Click Buy" />
          </div> */}
          <div className="h-10">
            <ButtonPrimaryStorefront name="Add to Cart" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;

Product.getLayout = function getLayout(page) {
  return <ShopLayout>{page}</ShopLayout>;
};

// TODO: get products
export async function getServerSideProps(context) {
  const { pid } = context.query;
  const id = parseInt(pid);

  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      images: true,
      optionGroups: {
        include: {
          options: true,
        },
      },
      questions: true,
    },
  });

  const serializedProduct = JSON.parse(JSON.stringify(product));

  return {
    props: {
      product: serializedProduct,
    },
  };
}
