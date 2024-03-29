import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function createDigitalProductBatchFromThirdParty(batchData) {
  const batchPromises = [];

  for (let i = 0; i < batchData.length; i++) {
    const currentProduct = batchData[i];

    const product = prisma.digitalProduct.create({
      data: currentProduct,
    });

    batchPromises.push(product);
  }

  try {
    const results = await Promise.all(batchPromises);
    return { success: true, products: results };
  } catch (error) {
    console.log("error", error);
    const errorData = {
      errorCode: "",
      errorMeta: "",
      errorMessage: "",
      clientVersion: "",
      // product: currentProduct,
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
    } else {
      const { message, clientVersion } = error;
      errorData.errorMessage = message;
      errorData.clientVersion = clientVersion;
    }

    return { success: false, error: errorData };
  }
}

export async function createProductBatchFromThirdParty(batchData) {
  const batchPromises = [];

  for (let i = 0; i < batchData.length; i++) {
    const currentProduct = batchData[i];

    const product = prisma.product.create({
      data: currentProduct,
    });

    batchPromises.push(product);
  }

  try {
    const results = await Promise.all(batchPromises);
    return { success: true, products: results };
  } catch (error) {
    console.log("error", error);
    const errorData = {
      errorCode: "",
      errorMeta: "",
      errorMessage: "",
      clientVersion: "",
      // product: currentProduct,
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
    } else {
      const { message, clientVersion } = error;
      errorData.errorMessage = message;
      errorData.clientVersion = clientVersion;
    }

    return { success: false, error: errorData };
  }
}

export async function createBatchProductsInternal(batchData) {
  const savedProducts = [];
  const productWithErrors = [];

  for (let i = 0; i < batchData.length; i++) {
    const currentProduct = batchData[i];

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
      } else {
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
}

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
    imageSchema,
    optionGroupSchema,
    optionSchema,
    questionSchema,
  } = product;

  const {
    accountId,
    tags,
    isSampleProduct,
    productName,
    productId,
    description,
    lat,
    lng,
    geohash,
    priceIntPenny: productPricePenny,
    priceStr: productPriceStr,
    salePricePenny,
    salePriceStr,
    quantity,
    hasUnlimitedQuantity,
    setQuantityByProduct,
    relatedCategories,
    defaultImageFileName,
    fireStorageId,
    defaultImage,
    enableCustomNote,
    enableCustomerImageUploads,
    taxCode,
    taxCodeName,
    taxCodeDescription,
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
              category_identifier: {
                accountId,
                categoryName,
              },
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
      defaultImageFileName,
      taxCode,
      taxCodeName,
      taxCodeDescription,
      tags,
      productId,
      defaultImage,
      fireStorageId,
      images: {
        create: imageSchema.map((imageItem) => {
          const { fileName, imgFileName, isDefault, image, fireStorageId } =
            imageItem;
          return {
            imgFileName: imgFileName ? imgFileName : fileName,
            isDefault,
            image,
            fireStorageId,
          };
        }),
      },
      isSampleProduct,
      lat,
      lng,
      geohash,
      enableCustomNote,
      enableCustomerImageUploads,
      productName,
      description,
      salePricePenny,
      salePriceStr,
      priceIntPenny: productPricePenny,
      priceStr: productPriceStr,
      hasUnlimitedQuantity,
      setQuantityByProduct,
      quantity: quantity ? (quantity === "" ? null : quantity) : null,
      optionGroups: {
        create: optionGroupSchema.map((optionGroup) => {
          const {
            optionGroupName,
            isRequired,
            isRequiredDisplay,
            selectionType,
            selectionDisplay,
          } = optionGroup;
          const optionGroupData = {
            optionGroupName,
            productName,
            isRequired,
            isRequiredDisplay,
            selectionType,
            selectionDisplay,
            options: {
              create: optionSchema.filter((option) => {
                const { optionName, priceStr, priceIntPenny, quantity } =
                  option;

                if (optionGroupName === option.optionGroupName) {
                  const optionData = {
                    optionGroupName,
                    optionName,
                    priceStr,
                    priceIntPenny,
                    quantity: quantity
                      ? quantity === ""
                        ? null
                        : quantity
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
      reviews: true,
      images: true,
    },
  });
};

const createDigitalProduct = (product) => {
  const { productSchema, fileSchema, imageSchema } = product;

  const {
    accountId,
    productName,
    digitalProductId,
    description,
    tags,
    lat,
    lng,
    geohash,
    priceIntPenny: productPricePenny,
    priceStr: productPriceStr,
    salePricePenny,
    salePriceStr,
    relatedCategories,
    fireStorageId,
    defaultImage,
    defaultImageFileName,
    taxCode,
    taxCodeName,
    taxCodeDescription,
  } = productSchema;

  return prisma.digitalProduct.create({
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
              category_identifier: {
                accountId,
                categoryName,
              },
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
      taxCode,
      taxCodeName,
      taxCodeDescription,
      fireStorageId,
      digitalProductId,
      defaultImage,
      tags,
      lat,
      lng,
      geohash,
      defaultImageFileName,
      images: {
        create: [
          {
            imgFileName: imageSchema.imgFileName,
            image: imageSchema.image,
            fireStorageId: imageSchema.fireStorageId,
          },
        ],
      },
      digitalFiles: {
        create: fileSchema.map((file) => {
          const { name, uploadedFile } = file;
          return {
            name,
            uploadedFile,
            fireStorageId: fireStorageId,
          };
        }),
      },
      productName,
      description,
      salePricePenny,
      salePriceStr,
      priceIntPenny: productPricePenny,
      priceStr: productPriceStr,
    },
    include: {
      relatedCategories: true,
      reviews: true,
      digitalFiles: true,
    },
  });
};

export async function createDigitalProductsServer(product) {
  const { productSchema } = product;
  const { newCategories, accountId } = productSchema;

  try {
    let data = {};
    if (newCategories && newCategories.length > 0) {
      const [createdProduct, createdCategories] = await prisma.$transaction([
        createDigitalProduct(product),
        createCategories(newCategories, accountId),
      ]);

      data = {
        createdProduct,
        createdCategories,
      };
    } else {
      const createdProduct = await createDigitalProduct(product);
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
    imageSchema,
    updatedImages,
    removedImages,
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
    tags,
    priceIntPenny,
    priceStr,
    salePricePenny,
    salePriceStr,
    quantity,
    hasUnlimitedQuantity,
    setQuantityByProduct,
    relatedCategories,
    removedCategories,
    removedQuestions,
    newQuestionsAdded,
    removedOptionGroups,
    removedOptions,
    defaultImageFileName,
    fireStorageId,
    defaultImage,
    enableCustomNote,
    enableCustomerImageUploads,
    taxCode,
    taxCodeName,
    taxCodeDescription,
  } = productSchema;

  return prisma.product.update({
    where: {
      id,
    },
    data: {
      productName,
      isSampleProduct,
      description,
      tags,
      priceIntPenny,
      priceStr,
      salePricePenny,
      salePriceStr,
      defaultImageFileName,
      defaultImage,
      hasUnlimitedQuantity,
      setQuantityByProduct,
      enableCustomNote,
      enableCustomerImageUploads,
      taxCode,
      taxCodeName,
      taxCodeDescription,
      quantity,
      images: {
        update:
          updatedImages &&
          updatedImages
            .map((imageItem) => {
              const { id, imgFileName, isDefault, image, fireStorageId } =
                imageItem;
              return {
                where: {
                  id,
                },
                data: {
                  isDefault,
                },
              };
            })
            .filter((item) => item),
        create:
          imageSchema &&
          imageSchema
            .map((imageItem) => {
              const { imgFileName, isDefault, image, fireStorageId } =
                imageItem;
              return {
                imgFileName,
                isDefault,
                image,
                fireStorageId,
              };
            })
            .filter((item) => item),
        deleteMany: removedImages.map((images) => {
          const { id } = images;
          return {
            id,
          };
        }),
      },
      relatedCategories: {
        disconnect: removedCategories.map((id) => {
          return {
            id,
          };
        }),
        connectOrCreate: relatedCategories.map((category) => {
          const { id, categoryName } = category;
          return {
            where: {
              category_identifier: {
                accountId,
                categoryName,
              },
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
        update: questionSchema
          .map((questionObj) => {
            const { id, isRequired, question } = questionObj;

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
          })
          .filter((item) => item), //filter out undefined values
        create: newQuestionsAdded
          .map((item) => {
            const { isRequired, question } = item;

            const questionData = {
              question,
              productName,
              isRequired,
            };

            return questionData;
          })
          .filter((item) => item), //filter out undefined values
        deleteMany: removedQuestions.map(({ id, question }) => {
          return {
            id,
          };
        }),
      },
      optionGroups: {
        update: optionGroupSchema
          .map((optionGroup) => {
            const {
              optionGroupName,
              groupId,
              selectionType,
              selectionDisplay,
              isRequired,
              isRequiredDisplay,
            } = optionGroup;

            if (!groupId) return;

            const optionGroupData = {
              where: {
                id: groupId,
              },
              data: {
                optionGroupName,
                selectionType,
                selectionDisplay,
                isRequired,
                isRequiredDisplay,
                options: {
                  update: optionSchema
                    .map((option) => {
                      const {
                        optionGroupName: groupName,
                        optionName,
                        priceIntPenny,
                        priceStr,
                        quantity,
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
                          quantity,
                        },
                      };

                      return optionData;
                    })
                    .filter((item) => item), //filter out undefined values
                  create: optionSchema
                    .map((option) => {
                      const {
                        optionGroupName: groupName,
                        optionName,
                        priceIntPenny,
                        priceStr,
                        quantity,
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
                        quantity,
                      };

                      return optionData;
                    })
                    .filter((item) => item), //filter out undefined values
                  deleteMany: removedOptions.map((id) => {
                    return {
                      id,
                    };
                  }),
                },
              },
            };

            return optionGroupData;
          })
          .filter((item) => item), //filter out undefined values
        create: optionGroupSchema
          .map((optionGroup) => {
            const {
              optionGroupName,
              groupId,
              groupPosition,
              selectionType,
              selectionDisplay,
              isRequired,
              isRequiredDisplay,
            } = optionGroup;

            if (groupId) return;

            const data = {
              optionGroupName,
              productName,
              selectionType,
              selectionDisplay,
              isRequired,
              isRequiredDisplay,
              options: {
                create: optionSchema
                  .map((option) => {
                    const {
                      optionGroupName: groupName,
                      optionName,
                      priceIntPenny,
                      priceStr,
                      quantity,
                      optionId,
                      groupId: optionGroupId,
                    } = option;

                    const optionGroupIdReformNull =
                      optionGroupId === null || optionGroupId === undefined
                        ? null
                        : optionGroupId;
                    const groupIdReformNull =
                      groupPosition === null || groupPosition === undefined
                        ? null
                        : groupPosition;

                    if (optionGroupIdReformNull !== groupIdReformNull) return;
                    if (optionGroupName !== groupName) return;
                    if (optionId) return;

                    const optionData = {
                      optionGroupName: groupName,
                      optionName,
                      priceIntPenny,
                      priceStr,
                      quantity,
                    };

                    return optionData;
                  })
                  .filter((item) => item), //filter out undefined values
              },
            };

            return data;
          })
          .filter((item) => item), //filter out undefined values
        deleteMany: removedOptionGroups.map((id) => {
          return {
            id,
          };
        }),
      },
    },
    include: {
      images: true,
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

export async function updateDigitalProductServer(product) {
  const { productSchema, questionSchema } = product;
  const { accountId, newCategories, removedQuestions } = productSchema;

  try {
    let data = {};
    if (newCategories && newCategories.length > 0) {
      const [updatedProduct, createdCategories] = await prisma.$transaction([
        updateDigitalProduct(product),
        createCategories(newCategories, accountId),
      ]);

      data = {
        updatedProduct,
        createdCategories,
      };
    } else {
      const updatedProduct = await updateDigitalProduct(product);
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

const updateDigitalProduct = (product) => {
  const {
    productSchema,
    fileSchema,
    imageSchema,
    removedFiles,
    removedImages,
  } = product;

  const {
    accountId,
    id,
    productName,
    description,
    priceIntPenny,
    tags,
    priceStr,
    salePricePenny,
    salePriceStr,
    fireStorageId,
    defaultImage,
    defaultImageFileName,
    relatedCategories,
    removedCategories,
    taxCode,
    taxCodeName,
    taxCodeDescription,
  } = productSchema;

  return prisma.digitalProduct.update({
    where: {
      id,
    },
    data: {
      taxCode,
      taxCodeName,
      taxCodeDescription,
      productName,
      description,
      tags,
      priceIntPenny,
      priceStr,
      salePricePenny,
      salePriceStr,
      defaultImage,
      defaultImageFileName,
      fireStorageId,
      images: {
        create:
          imageSchema &&
          imageSchema
            .map((imageItem) => {
              const { imgFileName, image, fireStorageId } = imageItem;
              return {
                imgFileName,
                image,
                fireStorageId,
              };
            })
            .filter((item) => item),
        deleteMany: removedImages.map((images) => {
          const { id } = images;
          return {
            id,
          };
        }),
      },
      digitalFiles: {
        create:
          fileSchema &&
          fileSchema
            .map((imageItem) => {
              const { uploadedFile, name, fireStorageId } = imageItem;
              return {
                name,
                uploadedFile,
                fireStorageId,
              };
            })
            .filter((item) => item),
        deleteMany: removedFiles.map((files) => {
          const { id } = files;
          return {
            id,
          };
        }),
      },
      relatedCategories: {
        disconnect: removedCategories.map((id) => {
          return {
            id,
          };
        }),
        connectOrCreate: relatedCategories.map((category) => {
          const { id, categoryName } = category;
          return {
            where: {
              category_identifier: {
                accountId,
                categoryName,
              },
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
    },
    include: {
      relatedCategories: true,
      digitalFiles: true,
      images: true,
    },
  });
};

export async function getProductsServer(accountId) {
  try {
    const account = await prisma.account.findUnique({
      where: {
        id: accountId,
      },
      include: {
        categories: {
          include: {
            products: true,
            digitalProducts: true,
          },
        },
        digitalProducts: {
          include: {
            relatedCategories: true,
            digitalFiles: true,
            reviews: true,
            images: true,
          },
          orderBy: {
            productName: "asc",
          },
        },
        products: {
          include: {
            optionGroups: {
              include: {
                options: true,
              },
            },
            questions: true,
            relatedCategories: true,
            images: true,
            reviews: true,
          },
          orderBy: {
            productName: "asc",
          },
        },
      },
    });

    return { success: true, value: account };
  } catch (error) {
    console.log("get products server error:", error);
    return { success: false, error };
  }
}

export async function getDigitalProductsServer(accountId) {
  try {
    const account = await prisma.account.findUnique({
      where: {
        id: accountId,
      },
      include: {
        digitalProducts: {
          include: {
            relatedCategories: true,
            digitalFiles: true,
            reviews: true,
            images: true,
          },
          orderBy: {
            productName: "asc",
          },
        },
      },
    });

    return { success: true, value: account };
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

export async function deleteDigitalProductServer(productId) {
  try {
    const deleteProduct = await prisma.digitalProduct.delete({
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

export async function updateProductVisibility(id, visibility) {
  try {
    const product = await prisma.product.update({
      where: {
        id,
      },
      data: {
        isEnabled: visibility,
      },
    });

    return { success: true, value: product };
  } catch (error) {
    console.log("update product visibility error:", error);
    return { success: false, error };
  }
}

export async function updateDigitalProductVisibility(id, visibility) {
  try {
    const product = await prisma.digitalProduct.update({
      where: {
        id,
      },
      data: {
        isEnabled: visibility,
      },
    });

    return { success: true, value: product };
  } catch (error) {
    console.log("update product visibility error:", error);
    return { success: false, error };
  }
}
