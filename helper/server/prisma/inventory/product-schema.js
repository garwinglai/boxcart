import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function createProductServer(product) {
  const { productSchema } = product;

  const { newCategories, accountId } = productSchema;
  console.log("newCategories", newCategories);

  // const { isRequired, question, productName } = questionSchema;

  try {
    let data = {};
    if (newCategories && newCategories.length > 0) {
      const [createdProduct, createdCategories] = await prisma.$transaction([
        createProduct(product),
        createCategories(newCategories, accountId),
      ]);

      data = {
        createdProduct,
        createdCategories,
      };
    } else {
      console.log("does not go here");
      const createdProduct = await createProduct(product);
      data = {
        createdProduct,
      };
    }

    return { success: true, value: data };
  } catch (error) {
    console.log("create product server error:", error);
    return { success: false, error };
  }
}

const createCategories = (newCategories, accountId) => {
  console.log("newCategories", newCategories, accountId);
  return prisma.category.createMany({
    data: newCategories.map((categoryName) => {
      console.log("categoryName", categoryName);

      const data = {
        categoryName,
        accountId,
      };

      return data;
    }),
  });
};

const createProduct = (product) => {
  const {
    productSchema,
    imageSchmea,
    optionGroupSchema,
    optionSchema,
    questionSchema,
  } = product;

  const {
    accountId,
    categoryId,
    isSampleProduct,
    productName,
    description,
    priceIntPenny: productPricePenny,
    priceStr: productPriceStr,
    quantity,
    hasUnlimitedQuantity,
    setQuantityByProduct,
    relatedCategories,
    newCategories,
  } = productSchema;

  return prisma.product.create({
    data: {
      account: {
        connect: {
          id: accountId,
        },
      },
      relatedCategories: {
        connectOrCreate: relatedCategories.map((category) => {
          const { id, categoryName } = category;
          return {
            where: {
              categoryName,
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
      isSampleProduct,
      productName,
      description,
      priceIntPenny: productPricePenny,
      priceStr: productPriceStr,
      hasUnlimitedQuantity,
      setQuantityByProduct,
      quantity: quantity ? (quantity === "" ? null : quantity) : null,
      optionGroups: {
        create: optionGroupSchema.map((optionGroup) => {
          const { optionGroupName } = optionGroup;
          const optionGroupData = {
            optionGroupName: optionGroup.optionGroupName,
            productName,
            options: {
              create: optionSchema.filter((option) => {
                const {
                  optionName,
                  priceStr,
                  priceIntPenny,
                  quantityStr,
                  quantityInt,
                } = option;

                if (optionGroupName === option.optionGroupName) {
                  const optionData = {
                    optionGroupName,
                    optionName,
                    priceStr,
                    priceIntPenny,
                    quantityStr: quantityStr
                      ? quantityStr === ""
                        ? null
                        : quantityStr
                      : null,
                    quantityInt: quantityInt
                      ? quantityInt === ""
                        ? null
                        : quantityInt
                      : null,
                  };

                  return optionData;
                }
              }),
            },
          };
          return optionGroupData;
        }),
      },
      questions: {
        create: questionSchema.map((questionObj) => {
          const { isRequired, question } = questionObj;

          const questionData = {
            question,
            productName,
            isRequired,
          };

          return questionData;
        }),
      },
    },
    include: {
      questions: true,
      relatedCategories: true,
      optionGroups: {
        include: {
          options: true,
        },
      },
    },
  });
};

export async function updateProductServer(product) {
  const {
    productSchema,
    imageSchmea,
    optionGroupSchema,
    optionSchema,
    questionSchema,
  } = product;

  const {
    id,
    accountId,
    categoryId,
    isSampleProduct,
    productName,
    description,
    priceIntPenny: productPricePenny,
    priceStr: productPriceStr,
    quantity,
    hasUnlimitedQuantity,
    setQuantityByProduct,
  } = productSchema;

  const {
    optionName,
    optionGroupName,
    priceStr: optionPriceStr,
    priceIntPenny: optionPricePenny,
    quantityStr,
    quantityInt,
  } = optionSchema;

  // const { productName, optionGroupName } = optionGroupSchema;

  // const { isRequired, question, productName } = questionSchema;
  const { isRequired, question } = questionSchema;

  const updateProduct = await prisma.product.update({
    where: {
      id,
    },
    data: {
      isSampleProduct,
      productName,
      description,
      priceIntPenny: productPricePenny,
      priceStr: productPriceStr,
      hasUnlimitedQuantity,
      setQuantityByProduct,
      quantity,
      optionGroups: {
        upsert: {
          where: {},
        },
      },
    },
  });
}

export async function getProductsServer(accountId) {
  try {
    const products = await prisma.product.findMany({
      where: {
        accountId,
      },
      include: {
        optionGroups: {
          include: {
            options: true,
          },
        },
        questions: true,
        category: true,
      },
    });

    return { success: true, value: products };
  } catch (error) {
    console.log("get products server error:", error);
    return { success: false, error };
  }
}

export async function deleteProductServer(productId) {
  console.log("productId", productId);
  try {
    const deleteProduct = await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return { success: true, value: deleteProduct };
  } catch (error) {
    console.log("delete product server error:", error);
    return { success: false, error };
  }
}
