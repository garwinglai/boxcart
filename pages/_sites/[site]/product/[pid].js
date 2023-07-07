import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import ShareIcon from "@mui/icons-material/Share";
import { IconButton } from "@mui/material";
import { products } from "@/helper/temp/tempData";
import Image from "next/image";
import Rating from "@mui/material/Rating";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import RadioGroupComponent from "@/components/storefront/options/RadioGroupComponent";
import CheckGroupComponent from "@/components/storefront/options/CheckGroupComponent";
import ButtonPrimaryStorefront from "@/components/global/buttons/ButtonPrimaryStorefront";
import ButtonSecondaryStorefront from "@/components/global/buttons/ButtonSecondaryStorefront";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ShopLayout from "@/components/layouts/storefront/ShopLayout";

function Product() {
  const [selectedQuantity, setSelectedQuantity] = useState("1");
  const [exampleImages, setExampleImages] = useState([]);

  const product = products[0];
  const {
    id,
    name,
    description,
    priceStr,
    reviewStr,
    reviewDouble,
    reviewCountStr,
    quantity,
    options,
    enableNote,
    hasOptions,
    notePlaceHOlder,
  } = product;
  // Show default image first
  const imgArr = product.imgArr.sort((a, b) => b.isDefault - a.isDefault);

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

  function displayOptions() {
    return (
      <div className="">
        {options.map((option, index) => {
          const diffOptionsArr = Object.keys(option);

          return diffOptionsArr.map((optionName) => {
            const currOption = option[optionName];
            const selectOne = currOption.selectOne;
            const selectMany = currOption.selectMany;

            if (selectOne) {
              return (
                <RadioGroupComponent
                  key={currOption.id}
                  currOption={currOption}
                />
              );
            }

            if (selectMany) {
              return (
                <CheckGroupComponent
                  key={currOption.id}
                  currOption={currOption}
                />
              );
            }
          });
        })}
      </div>
    );
  }

  function displayNote() {
    return (
      <div className="flex flex-col px-6 py-4">
        <p className="font-medium">Personalization</p>
        <label
          htmlFor="customNote"
          className="text-[color:var(--gray-text)] font-extralight mb-2 text-sm"
        >
          Know exactly what you want? Let us know and share references.
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
        <div className="flex w-full overflow-x-scroll relative md:grid md:grid-cols-2 md:overflow-x-hidden md:gap-1">
          {imgArr.map((imgItem, index) => {
            if (imgItem.isDefault) {
              return (
                <Image
                  src={imgItem.imgStr}
                  alt={imgItem.imgAlt}
                  key={index}
                  className="object-cover md:col-span-2 md:w-full"
                />
              );
            } else {
              return (
                <Image
                  src={imgItem.imgStr}
                  alt={imgItem.imgAlt}
                  key={index}
                  className="object-cover md:col-span-1 md:w-full"
                />
              );
            }
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
            className="block mb-1 font-medium text-base text-[color:var(--black-design-extralight)] "
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
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        {hasOptions && displayOptions()}
        {enableNote && displayNote()}
        <div className="flex justify-between items-center px-6 pt-2">
          <p>3 uploads max</p>
          {exampleImages.length < 3 && (
            <label
              htmlFor="file"
              aria-disabled
              className="text-white bg-[color:var(--black-design-extralight)] font-extralight text-sm px-4 py-2 active:bg-black"
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
        <div className="flex overflow-x-scroll w-full gap-2 px-6 py-4">
          {exampleImages.length !== 0 &&
            exampleImages.map((item, idx) => (
              <div key={idx} className="flex flex-col max-w-[5rem] gap-1">
                <div
                  key={idx}
                  className="relative h-[5rem] min-w-[5rem] inline-block"
                >
                  <Image
                    src={item.imgUrl}
                    alt={item.fileName}
                    fill={true}
                    className="object-cover inline-block"
                  />
                  <IconButton
                    onClick={(e) => handleRemoveImage(e, item)}
                    sx={{
                      position: "absolute",
                      backgroundColor: "var(--black)",
                      opacity: "50%",
                      right: "0.25rem",
                      top: "0.25rem",
                    }}
                  >
                    <CloseIcon
                      sx={{
                        color: "var(--white)",
                        fontSize: "0.75rem",
                      }}
                    />
                  </IconButton>
                </div>
                <p className="truncate font-extralight text-xs">
                  {item.fileName}
                </p>
              </div>
            ))}
        </div>
        <div className="sticky bottom-0 p-4 flex flex-col gap-2 bg-white border-t border-[color:var(--gray-light-med)] md:border-none">
          <div className="h-10">
            <ButtonSecondaryStorefront name="1 Click Buy" />
          </div>
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
// export async function getServerSideProps(context) {
// 	console.log(context.query.pid);

// 	const user = await prisma.user.findFirst({
// 		where: {
// 			email: "garwingl@usc.edu",
// 		},
// 	});

// 	console.log(user);

// 	return { props: {} };
// }
