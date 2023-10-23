import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const createBatchProducts = async (builtBatchData) => {
  // console.log("build batch data", builtBatchData);
  // const { product, images, optionGroups, questions, relatedCategories } =
  //   builtBatchData;

  // const productLength = product.length;
  // const imagesLength = images.length;
  // const optionGroupsLength = optionGroups.length;
  // const questionsLength = questions.length;
  // const relatedCategoriesLength = relatedCategories.length;

  // if (
  //   productLength > 0 &&
  //   imagesLength > 0 &&
  //   optionGroupsLength > 0 &&
  //   questionsLength > 0 &&
  //   relatedCategoriesLength > 0
  // ) {
  //   const [
  //     createdProduct,
  //     createdImages,
  //     createdOptionGroups,
  //     createdQuestions,
  //     createdRelatedCategories,
  //   ] = await prisma.$transaction([
  //     createProduct(product),
  //     createImages(images),
  //     createOptionGroups(optionGroups),
  //     createdQuestions(questions),
  //     createdRelatedCategories(relatedCategories),
  //   ]);
  // }

  const savedProducts = [];
  const productWithErrors = [];

  for (let i = 0; i < builtBatchData.length; i++) {
    const currentProduct = builtBatchData[i];

    try {
      const product = await prisma.product.create({
        data: currentProduct,
      });

      savedProducts.push(product);
    } catch (error) {
      const errorData = {
        errorCode: "",
        errorMeta: "",
        errorMessage: "",
        clientVersion: "",
        product: currentProduct,
      };

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const { code, meta, message, clientVersion } = error;
        errorData.errorCode = code;
        errorData.errorMeta = meta;
        errorData.errorMessage = message;
        errorData.clientVersion = clientVersion;
      } else if (error instanceof Prisma.PrismaClientValidationError) {
        const { message, clientVersion } = error;
        errorData.errorMessage = message;
        errorData.clientVersion = clientVersion;
      }

      productWithErrors.push(errorData);
    }
  }

  const savedProductsLength = savedProducts.length;
  const productWithErrorsLength = productWithErrors.length;

  const returnData = {
    savedCount: savedProductsLength,
    errorCount: productWithErrorsLength,
    savedProducts,
    productWithErrors,
  };

  return returnData;
};

const createProduct = async (product) => {
  return prisma.product.createMany({ data: product });
};

const createImages = async (images) => {
  return prisma.image.createMany(images);
};
const createOptionGroups = async (optionGroups) => {
  return prisma.optionGroup.createMany(optionGroups);
};
const createdQuestions = async (questions) => {
  return prisma.question.createMany(questions);
};

const createdRelatedCategories = async (relatedCategories) => {};

export const getKintSugiRelatedAccounts = async (groupName) => {
  try {
    const accounts = await prisma.account.findMany({
      where: {
        referredFrom: groupName,
      },
    });

    const accountData = [];

    for (let i = 0; i < accounts.length; i++) {
      const currAccount = accounts[i];
      const { id, userName, businessName, fullDomain } = currAccount;
      const data = {
        id,
        userName,
        businessName,
        fullDomain,
      };
      accountData.push(data);
    }

    return { success: true, value: accountData };
  } catch (error) {
    return { success: false, error };
  }
};
