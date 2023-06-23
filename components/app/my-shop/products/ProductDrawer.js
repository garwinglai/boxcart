import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import product_tag_icon from "@/public/images/icons/product_tag_icon.png";
import Image from "next/image";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import SaveCancelButtons from "../../design/SaveCancelButtons";
import { IOSSwitch } from "@/components/common/switches/IOSSwitch";
import PhotoSizeSelectActualIcon from "@mui/icons-material/PhotoSizeSelectActual";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import ButtonPrimary from "@/components/common/buttons/ButtonPrimary";
import candle_4 from "@/public/images/temp/candle_4.jpeg";
import candle_2 from "@/public/images/temp/candle_2.jpeg";
import custom_mug from "@/public/images/temp/custom_mug.jpg";
import ButtonFilter from "@/components/common/buttons/ButtonFilter";

function ProductDrawer({ state, toggleDrawer }) {
	const [isLimited, setIsLimited] = useState(false);
	const [hasOptions, setHasOptions] = useState(false);
	const [showOptionInputs, setShowOptionInputs] = useState([]);
	const [hasCustomerQuestions, setHasCustomerQuestions] = useState(false);
	const [customerQuestions, setCustomerQuestions] = useState([]);
	const [customerQuestionInput, setCustomerQuestionInput] = useState("");
	const [variantPhotos, setVariantPhotos] = useState([]);
	const [productPhotos, setProductPhotos] = useState([]);

	const handleIsQtyUnlimitedChange = () => {
		setIsLimited((prev) => !prev);
	};

	const handleChangeHasOptions = () => {
		setHasOptions((prev) => !prev);
	};

	const handleCustomerQuestionChange = () => {
		setHasCustomerQuestions((prev) => !prev);
	};

	const handleAddCustomerQuestions = (e) => {
		setCustomerQuestionInput("");

		if (!customerQuestions.includes(customerQuestionInput))
			setCustomerQuestions((prev) => [
				...prev,
				{ question: customerQuestionInput, isRequired: true },
			]);
	};

	const handleCustomerQuestionInputChange = (e) => {
		const { value } = e.target;
		setCustomerQuestionInput(value);
	};

	const handleQuestionRequired = (currQuestion) => (e) => {
		const updatedQuestionArray = customerQuestions.map((item) => {
			if (item.question === currQuestion)
				return { ...item, isRequired: !item.isRequired };

			return item;
		});

		setCustomerQuestions(updatedQuestionArray);
	};

	const handlePhotoFileChange = (e) => {
		const { name, files } = e.target;
		const selectedImage = files[0];
		console.log(name);

		if (!selectedImage) return;

		if (name === "variantImage") {
			const fileName = selectedImage.name;
			const imgUrl = URL.createObjectURL(selectedImage);
			const imgData = { imgUrl, fileName };

			if (!variantPhotos.includes(imgData))
				setVariantPhotos((prev) => [...prev, imgData]);
		}

		if (name === "productImage") {
			const fileName = selectedImage.name;
			const imgUrl = URL.createObjectURL(selectedImage);
			const imgData = { imgUrl, fileName };

			if (!productPhotos.includes(imgData))
				setProductPhotos((prev) => [...prev, imgData]);
		}
	};

	const removeImageClick = (file, state) => (e) => {
		if (state === "variantImage") {
			console.log(file.imgUrl);
			const photoArrayAfterRemoval = variantPhotos.filter(
				(currFiles) => currFiles.imgUrl !== file.imgUrl
			);

			setVariantPhotos(photoArrayAfterRemoval);
		}

		if (state === "productImage") {
			console.log(file.imgUrl);
			const photoArrayAfterRemoval = productPhotos.filter(
				(currFiles) => currFiles.imgUrl !== file.imgUrl
			);

			setProductPhotos(photoArrayAfterRemoval);
		}
	};

	const handleShowOptionInputs = () => {
		const options = {
			title: "test title",
		};
		setShowOptionInputs((prev) => [...prev, options]);
	};

	const handleAddVariantClick = (title) => (e) => {
		const variations = { images: [], name: "", price: "" };

		const addedVariationsArray = showOptionInputs.map((item) => {
			if (item.title === title) {
				if (item.variants && item.variants.length !== 0) {
					return { ...item, variants: [...item.variants, variations] };
				}
				return { ...item, variants: [variations] };
			}

			return item;
		});

		console.log(addedVariationsArray);

		setShowOptionInputs(addedVariationsArray);
	};

	const handleRemoveOptionGroup = (title, idx) => () => {
		const newFilteredOptionGroupArr = showOptionInputs.filter((item, index) => {
			if (title) return item.title !== title;

			return idx !== index;
		});
		setShowOptionInputs(newFilteredOptionGroupArr);
	};

	const handleRemoveQuestion = (question) => () => {
		const newQuestionsArr = customerQuestions.filter(
			(item) => item.question !== question
		);
		setCustomerQuestions(newQuestionsArr);
	};

	return (
		<Drawer
			anchor={"right"}
			open={state["right"]}
			onClose={toggleDrawer("right", false)}
		>
			<div className="w-screen bg-[color:var(--gray-light)] min-h-screen p-4 flex flex-col gap-4 overflow-y-scroll pb-28 md:w-[60vw] lg:w-[40vw] xl:w-[30vw]">
				<div className="flex justify-between items-center">
					<span className="flex gap-4 items-center">
						<Image
							src={product_tag_icon}
							alt="bardcode icon"
							className="w-[3rem] h-[3rem]"
						/>
						<h2>Product details:</h2>
					</span>
					<button
						className="flex text-[color:var(--third-dark)] "
						onClick={toggleDrawer("right", false)}
					>
						<ChevronLeftIcon />
						<p>close</p>
					</button>
				</div>
				<div className="rounded p-4 w-full shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)] bg-white relative">
					<div className="w-full relative ">
						<h4 className="text-black font-semibold text-sm ">Photos:</h4>
						<div className="flex overflow-x-scroll w-full mt-4 gap-2 pb-4">
							<div className={`relative h-[8rem] min-w-[8rem] inline-block $`}>
								<Image
									src={candle_4}
									alt="candle image"
									fill
									className="object-cover rounded inline-block"
								/>
								<IconButton
									// onClick={removeImageClick(file)}
									sx={{
										position: "absolute",
										backgroundColor: "var(--black)",
										opacity: "50%",
										right: "0.25rem",
										top: "0.25rem",
									}}
								>
									<CloseIcon
										sx={{ color: "var(--white)", fontSize: "0.75rem" }}
									/>
								</IconButton>
							</div>
							<div className={`relative h-[8rem] min-w-[8rem] inline-block $`}>
								<Image
									src={candle_2}
									alt="product image"
									fill
									className="object-cover rounded inline-block"
								/>
								<IconButton
									// onClick={removeImageClick(file)}
									sx={{
										position: "absolute",
										backgroundColor: "var(--black)",
										opacity: "50%",
										right: "0.25rem",
										top: "0.25rem",
									}}
								>
									<CloseIcon
										sx={{ color: "var(--white)", fontSize: "0.75rem" }}
									/>
								</IconButton>
							</div>
							<div className={`relative h-[8rem] min-w-[8rem] inline-block $`}>
								<Image
									src={custom_mug}
									alt="product image"
									fill
									className="object-cover rounded inline-block"
								/>
								<IconButton
									// onClick={removeImageClick(file)}
									sx={{
										position: "absolute",
										backgroundColor: "var(--black)",
										opacity: "50%",
										right: "0.25rem",
										top: "0.25rem",
									}}
								>
									<CloseIcon
										sx={{ color: "var(--white)", fontSize: "0.75rem" }}
									/>
								</IconButton>
							</div>
							{productPhotos.length !== 0 &&
								productPhotos.map((photo, idx) => (
									<div
										key={idx}
										className={`relative h-[8rem] min-w-[8rem] inline-block $`}
									>
										<Image
											src={photo.imgUrl}
											alt={photo.fileName}
											fill
											className="object-cover rounded inline-block"
										/>
										<IconButton
											onClick={removeImageClick(photo, "productImage")}
											sx={{
												position: "absolute",
												backgroundColor: "var(--black)",
												opacity: "50%",
												right: "0.25rem",
												top: "0.25rem",
											}}
										>
											<CloseIcon
												sx={{ color: "var(--white)", fontSize: "0.75rem" }}
											/>
										</IconButton>
									</div>
								))}
						</div>
						<span className="flex justify-between">
							<p className="text-sm text-[color:var(--gray)] font-light">
								3 images uploaded.
							</p>
							<span>
								<span className="bg-[color:var(--primary)] py-1 rounded ">
									<label
										htmlFor="productImageInput"
										className=" -translate-y-[2px] bg-white text-[color:var(--primary)] border border-[color:var(--primary)] rounded py-1 px-2 active:bg-[color:var(--priamry-dark)] active:text-white hover:cursor-pointer"
									>
										Upload
									</label>
								</span>
								<input
									onChange={handlePhotoFileChange}
									type="file"
									name="productImage"
									id="productImageInput"
									className="hidden"
								/>
							</span>
						</span>
					</div>
					<span className="flex flex-col gap-2 mt-4">
						<label
							htmlFor="title"
							className="text-black font-semibold text-sm "
						>
							Product name:
						</label>
						<input
							type="text"
							id="name"
							className={`transition-colors duration-300 border border-[color:var(--gray-light-med)] rounded w-full py-2 focus:outline-none focus:border focus:border-[color:var(--primary-light-med)] indent-4 font-light text-xs`}
						/>
					</span>
					<span className="flex flex-col gap-2 mt-4">
						<label
							htmlFor="description"
							className="text-black font-semibold text-sm"
						>
							Description:
						</label>
						<textarea
							type="text"
							id="description"
							className={`transition-colors duration-300 border border-[color:var(--gray-light-med)] rounded w-full py-2 px-4 focus:outline-none focus:border focus:border-[color:var(--primary-light-med)]  font-light text-xs overflow-hidden`}
						/>
					</span>
					<span className="flex flex-col gap-2 mt-4 relative">
						<label htmlFor="price" className="text-black font-semibold text-sm">
							Price:
						</label>
						<span className="text-[color:var(--gray-light-med)] text-sm font-light absolute bottom-2 left-4">
							$
						</span>
						<input
							type="number"
							name="price"
							id="price"
							className={`transition-colors duration-300 border border-[color:var(--gray-light-med)] rounded w-full py-2 focus:outline-none focus:border focus:border-[color:var(--primary-light-med)] indent-8 font-light text-xs`}
						/>
					</span>
					<span className="flex flex-col gap-2 mt-4 relative">
						<label htmlFor="price" className="text-black font-semibold text-sm">
							Category:
						</label>
						<select
							name="category"
							id="category"
							className={`transition-colors duration-300 border border-[color:var(--gray-light-med)] rounded w-full py-2 px-4 focus:outline-none focus:border focus:border-[color:var(--primary-light-med)]  font-light text-xs overflow-hidden`}
						>
							<option value="n/a">n / a</option>
							<option value="dessert">Desserts</option>
							<option value="drinks">Drinks</option>
						</select>
					</span>
					<span className="flex flex-col gap-2 mt-6 relative">
						<span className="flex justify-between">
							<div>
								<label
									htmlFor="quantity"
									className="text-black font-semibold text-sm "
								>
									Set Quantity:
								</label>

								<p className="font-light text-sm text-[color:var(--gray-text)] ">
									If toggle is off, product has unlimited quantity.
								</p>
							</div>

							<IOSSwitch
								checked={isLimited}
								onChange={handleIsQtyUnlimitedChange}
							/>
						</span>
						{isLimited && (
							<input
								type="number"
								name="quantity"
								id="quantity"
								className={`transition-colors duration-300 border border-[color:var(--gray-light-med)] rounded w-full py-2 px-4 focus:outline-none focus:border focus:border-[color:var(--primary-light-med)]  font-light text-xs overflow-hidden`}
							/>
						)}
					</span>
				</div>
				<div>
					<div
						className={` p-4 w-full shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)] bg-white ${
							hasOptions ? "rounded-t-3xl" : "rounded"
						} `}
					>
						<span className="flex justify-between">
							<h4>Product options:</h4>
							<IOSSwitch
								checked={hasOptions}
								onChange={handleChangeHasOptions}
							/>
						</span>
					</div>
					<div>
						{hasOptions &&
							showOptionInputs.length !== 0 &&
							showOptionInputs.map((option, idx) => (
								<div
									key={idx}
									className={` bg-white  p-4  my-3 shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)]`}
								>
									<div>
										<span className="flex justify-between items-center mb-2">
											<h4 className="text-[color:var(--black-design-extralight)] font-medium text-base">
												New group:
											</h4>

											<button
												onClick={handleRemoveOptionGroup(option.title, idx)}
												className="text-xs font-light text-[color:var(--gray)] underline rounded px-2 py-1"
											>
												remove group
											</button>
										</span>
										<span className="flex flex-col py-2 pl-4 relative">
											<label
												htmlFor="optionTitle"
												className="text-[color:var(--black-design-extralight)] font-medium text-sm "
											>
												Title
											</label>
											<input
												type="text"
												name="optionTitle"
												id="optionTitle"
												placeholder="Size, flavor, toppings ... "
												className={`transition-colors duration-300 border border-[color:var(--gray-light-med)] rounded w-full py-2 px-4 focus:outline-none focus:border focus:border-[color:var(--primary-light-med)]  font-light text-xs overflow-hidden`}
											/>
										</span>
										<span className="flex justify-between items-center mt-4">
											<h3 className="text-[color:var(--black-design-extralight)] font-medium text-base">
												Variations:
											</h3>

											{option.title !== "" && (
												<ButtonFilter
													name="+ Variant"
													handleClick={handleAddVariantClick("test title")}
												/>
											)}
										</span>
										{option.variants &&
											option.variants.length !== 0 &&
											option.variants.map((variant, idx) => (
												<div
													key={idx}
													className="my-4 ml-4 p-4 rounded border-2 border-[color:var(--third-light-soft)] "
												>
													<button className="mb-4 block text-xs font-light text-[color:var(--gray)] underline rounded ml-auto">
														remove variant
													</button>

													<div className="flex gap-4 justify-center items-center">
														<span className="flex flex-col relative flex-grow">
															<label
																htmlFor="optionTitle"
																className="text-[color:var(--black-design-extralight)] font-medium text-sm "
															>
																Name
															</label>
															<input
																type="text"
																name="optionName"
																id="optionName"
																placeholder="Small, medium, large ..."
																className={`transition-colors duration-300 border border-[color:var(--gray-light-med)] rounded w-full py-2 px-4 focus:outline-none focus:border focus:border-[color:var(--primary-light-med)]  font-light text-xs overflow-hidden`}
															/>
														</span>

														<span className="flex flex-col relative flex-grow">
															<label
																htmlFor="optionTitle"
																className="text-[color:var(--black-design-extralight)] font-medium text-sm "
															>
																Price
															</label>
															<span className="text-[color:var(--gray-light-med)] text-sm font-light absolute bottom-2 left-4">
																$
															</span>
															<input
																type="number"
																name="optionPrice"
																id="optionPrice"
																placeholder="$0, $1, $5 ..."
																className={`transition-colors duration-300 border border-[color:var(--gray-light-med)] rounded w-full py-2 px-4  indent-4 focus:outline-none focus:border focus:border-[color:var(--primary-light-med)]  font-light text-xs overflow-hidden`}
															/>
														</span>
													</div>
													<div className="flex flex-col mt-4">
														<span className="flex items-center gap-4">
															<h5 className=" text-[color:var(--black-design-extralight)] font-medium py-2  text-sm">
																Images:{" "}
																<span className="font-light text-xs text-[color:var(--gray-text)] ">
																	(Optional)
																</span>
															</h5>

															<label
																htmlFor="photos"
																className="hover:cursor-pointer flex-grow"
															>
																<input
																	type="file"
																	name="variantImage"
																	id="photos"
																	className="hidden"
																	onChange={handlePhotoFileChange}
																/>
																<span className="flex items-center justify-center px-2 py-1 gap-2 bg-[color:var(--gray-light)] rounded-xl">
																	<p className="text-[color:var(--gray)] text-xs font-light">
																		Upload photos
																	</p>
																	<div className="bg-white rounded-full p-2">
																		<PhotoSizeSelectActualIcon
																			sx={{ color: "var(--gray)" }}
																			fontSize="small"
																		/>
																	</div>
																</span>
															</label>
														</span>
														{variantPhotos.length !== 0 && (
															<div className="flex overflow-x-scroll w-full mt-4 gap-2 pb-4">
																{variantPhotos.map((file, idx) => (
																	<div
																		key={idx}
																		className="relative h-[5rem] min-w-[5rem] inline-block"
																	>
																		<Image
																			src={file.imgUrl}
																			alt={file.fileName}
																			fill={true}
																			className="object-cover rounded inline-block"
																		/>
																		<IconButton
																			onClick={removeImageClick(
																				file,
																				"variantImage"
																			)}
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
																))}
															</div>
														)}
													</div>
												</div>
											))}
									</div>
								</div>
							))}
						{hasOptions && (
							<div className="flex p-4 justify-between items-center  rounded-b-3xl bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)]">
								<p className="text-xs font-light text-[color:var(--gray-light-med)] ">
									Add all options before saving.
								</p>
								<div>
									<ButtonPrimary
										name="+ New group"
										handleClick={handleShowOptionInputs}
									/>
								</div>
							</div>
						)}
					</div>
				</div>
				<div className="rounded p-4 w-full shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)] bg-white">
					<span className="flex justify-between">
						<h4>Questions for customers:</h4>
						<IOSSwitch
							checked={hasCustomerQuestions}
							onChange={handleCustomerQuestionChange}
						/>
					</span>
					{hasCustomerQuestions && (
						<div className="mt-4">
							<p className="font-light text-xs text-[color:var(--gray-light-med)] pb-2">
								Create questions for your customers to answer.
							</p>
							<div className="mt-2 py-2 border-y border-[color:var(--gray-light)]  ">
								<h4 className="text-black font-semibold text-sm ">
									Added questions:
								</h4>

								{customerQuestions.length !== 0 ? (
									customerQuestions.map((item, idx) => (
										<div
											key={idx}
											className="flex items-center justify-between"
										>
											<span className="flex items-center">
												<IconButton
													onClick={handleRemoveQuestion(item.question)}
												>
													<CloseIcon fontSize="small" />
												</IconButton>
												<p className="text-sm font-light">{item.question}</p>
											</span>
											<span className="flex items-center gap-2">
												<p
													className={`text-sm font-light ${
														item.isRequired
															? "text-[color:var(--primary)] "
															: "text-[color:var(--gray-light-med)]  "
													}`}
												>
													required
												</p>
												<IOSSwitch
													checked={item.isRequired}
													onChange={handleQuestionRequired(item.question)}
												/>
											</span>
										</div>
									))
								) : (
									<p className=" mt-1 font-light text-xs text-[color:var(--gray)] ">
										No questions added.
									</p>
								)}
							</div>

							<span className="flex flex-col gap-2 mt-4">
								<span className="flex justify-between items-center">
									<label
										htmlFor="customerQuestion"
										className="text-black font-semibold text-sm "
									>
										Question:
									</label>
								</span>
								<input
									type="text"
									id="customerQuestion"
									value={customerQuestionInput}
									onChange={handleCustomerQuestionInputChange}
									className={`transition-colors duration-300 border border-[color:var(--gray-light-med)] rounded w-full py-2 focus:outline-none focus:border focus:border-[color:var(--primary-light-med)] indent-4 font-light text-xs`}
									placeholder="i.e. What topping would you like?"
								/>
							</span>
							<div className="flex pt-4 mt-4 justify-between items-center border-t border-[color:var(--gray-light-med)] ">
								<p className="text-xs font-light text-[color:var(--gray-light-med)] ">
									Add all questions before saving.
								</p>
								<div>
									<ButtonPrimary
										name="Add question"
										handleClick={handleAddCustomerQuestions}
									/>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
			{/* <SaveCancelButtons /> */}
		</Drawer>
	);
}

export default ProductDrawer;
