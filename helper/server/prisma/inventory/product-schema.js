import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function createProductServer(product) {
  const { productSchema } = product;

  const { newCategories, accountId } = productSchema;

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
  return prisma.category.createMany({
    data: newCategories.map((categoryName) => {
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
    isSampleProduct,
    productName,
    description,
    priceIntPenny: productPricePenny,
    priceStr: productPriceStr,
    quantity,
    hasUnlimitedQuantity,
    setQuantityByProduct,
    relatedCategories,
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
  const { productSchema, questionSchema } = product;
  const { accountId, newCategories, removedQuestions } = productSchema;

  try {
    let data = {};
    if (newCategories && newCategories.length > 0) {
      const [updatedProduct, createdCategories] = await prisma.$transaction([
        updateProduct(product),
        createCategories(newCategories, accountId),
      ]);

      data = {
        updatedProduct,
        createdCategories,
      };
    } else {
      const updatedProduct = await updateProduct(product);
      data = {
        updatedProduct,
      };
    }

    return { success: true, value: data };
  } catch (error) {
    console.log("update product server error:", error);
    return { success: false, error };
  }
}

const updateProduct = (product) => {
  const {
    productSchema,
    imageSchmea,
    optionGroupSchema,
    optionSchema,
    questionSchema,
  } = product;

  const {
    accountId,
    id,
    isSampleProduct,
    productName,
    description,
    priceIntPenny,
    priceStr,
    quantity,
    hasUnlimitedQuantity,
    setQuantityByProduct,
    relatedCategories,
    removedCategories,
    removedQuestions,
    newQuestionsAdded,
    removedOptionGroups,
    removedOptions,
  } = productSchema;

  //  TODO:
  // 1. update product
  // console.log("relatedCategories", relatedCategories);
  // console.log("optionGroupSchema", optionGroupSchema);
  // console.log("optionSchema", optionSchema);
  console.log("serverside", questionSchema);

  return prisma.product.update({
    where: {
      id,
    },
    data: {
      productName,
      isSampleProduct,
      description,
      priceIntPenny,
      priceStr,
      // defaultImgStr,
      hasUnlimitedQuantity,
      setQuantityByProduct,
      quantity,
      relatedCategories: {
        disconnect: removedCategories.map((categoryName) => {
          return {
            categoryName,
          };
        }),
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
      questions: {
        update: questionSchema.map((questionObj) => {
          const { id, isRequired, question } = questionObj;
          console.log("inside question update", isRequired, id);
          if (!id) return;
          const questionData = {
            where: {
              id,
            },
            data: {
              isRequired,
            },
          };

          return questionData;
        }),
        create: newQuestionsAdded.map((item) => {
          const { isRequired, question } = item;
          console.log("isRequired", isRequired);
          const questionData = {
            question,
            productName,
            isRequired,
          };

          return questionData;
        }),
        deleteMany: removedQuestions.map(({ id, question }) => {
          return {
            id,
          };
        }),
      },
      optionGroups: {
        update: optionGroupSchema.map((optionGroup) => {
          const { optionGroupName, groupId } = optionGroup;

          if (!groupId) return;

          const optionGroupData = {
            where: {
              id: groupId,
            },
            data: {
              optionGroupName,
              options: {
                update: optionSchema.map((option) => {
                  const {
                    optionGroupName: groupName,
                    optionName,
                    priceIntPenny,
                    priceStr,
                    quantityInt,
                    quantityStr,
                    groupId: optionGroupId,
                    optionId,
                  } = option;

                  if (!optionId) return;
                  if (optionGroupId !== groupId) return;

                  const optionData = {
                    where: {
                      id: optionId,
                    },
                    data: {
                      optionGroupName: groupName,
                      optionName,
                      priceIntPenny,
                      priceStr,
                      quantityInt,
                      quantityStr,
                    },
                  };

                  return optionData;
                }),
                create: optionSchema.map((option) => {
                  const {
                    optionGroupName: groupName,
                    optionName,
                    priceIntPenny,
                    priceStr,
                    quantityInt,
                    quantityStr,
                    groupId: optionGroupId,
                    optionId,
                  } = option;

                  if (optionGroupId !== groupId) return;
                  if (optionId) return;

                  const optionData = {
                    optionGroupName: groupName,
                    optionName,
                    priceIntPenny,
                    priceStr,
                    quantityInt,
                    quantityStr,
                  };

                  return optionData;
                }),
                deleteMany: removedOptions.map((id) => {
                  return {
                    id,
                  };
                }),
              },
            },
          };

          return optionGroupData;
        }),
        create: optionGroupSchema.map((optionGroup) => {
          const { optionGroupName, groupId } = optionGroup;

          if (groupId) return;

          const data = {
            optionGroupName,
            productName,
            options: {
              create: optionSchema.map((option) => {
                const {
                  optionGroupName: groupName,
                  optionName,
                  priceIntPenny,
                  priceStr,
                  quantityInt,
                  quantityStr,
                  optionId,
                  groupId: optionGroupId,
                } = option;

                const optionGroupIdReformNull =
                  optionGroupId === null || optionGroupId === undefined
                    ? null
                    : optionGroupId;
                const groupIdReformNull =
                  groupId === null || groupId === undefined ? null : groupId;

                if (optionGroupIdReformNull !== groupIdReformNull) return;
                if (optionGroupName !== groupName) return;
                if (optionId) return;

                const optionData = {
                  optionGroupName: groupName,
                  optionName,
                  priceIntPenny,
                  priceStr,
                  quantityInt,
                  quantityStr,
                };

                return optionData;
              }),
            },
          };

          return data;
        }),
        deleteMany: removedOptionGroups.map((id) => {
          return {
            id,
          };
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

  // 2. update options groups: update original, create new, delete removed
  // 3. update questions: create new, delete removed
  // 4. update related categories: update original, delete removed
};

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
