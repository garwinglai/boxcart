import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function createCategoryServer(category) {
  const { accountId, categoryName, products } = JSON.parse(category);

  try {
    const createCategory = await prisma.category.create({
      data: {
        categoryName,
        account: {
          connect: {
            id: accountId,
          },
        },
        products: {
          connect: products.map((product) => {
            return {
              id: product.productId,
            };
          }),
        },
      },
      include: {
        products: true,
      },
    });

    return { success: true, value: createCategory };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaError = {
        code: error.code,
        message: error.message,
        target: error.meta,
      };

      console.log(
        "file: helper/server/db/early-bird-code, findUserAccessCode prisma error:",
        prismaError
      );

      return { success: false, value: null, error: error.code };
    } else {
      return { success: false, value: null, error };
    }
  }
}

export async function updateCategoryServer(category) {
  const { accountId, categoryName, products, categoryId, removedProducts } =
    JSON.parse(category);

  console.log("products", removedProducts);

  try {
    const updateCategory = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        categoryName,
        products: {
          disconnect: removedProducts.map((product) => {
            return {
              id: product.id,
            };
          }),
          connect: products.map((product) => {
            return {
              id: product.productId,
            };
          }),
        },
      },
      include: {
        products: true,
      },
    });

    return { success: true, value: updateCategory };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaError = {
        code: error.code,
        message: error.message,
        target: error.meta,
      };

      console.log("error updating category, server:", error);

      return { success: false, value: null, error: error.code };
    } else {
      return { success: false, value: null, error };
    }
  }
}

export async function getCategoryServer(accountId) {
  try {
    const categories = await prisma.category.findMany({
      where: {
        accountId,
      },
      include: {
        products: true,
      },
    });

    return { success: true, value: categories };
  } catch (error) {
    console.log("error getting categories, server:", error);
    return { success: false, value: null, error };
  }
}

export async function deleteCategoryServer(categoryId) {
  const id = JSON.parse(categoryId);

  try {
    const deleteCategory = await prisma.category.delete({
      where: {
        id,
      },
    });

    return { success: true, value: deleteCategory };
  } catch (error) {
    console.log("error deleting category, server:", error);
    return { success: false, value: null, error };
  }
}

export async function getProductsByCategoryIdServer(categoryId) {
  try {
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
      include: {
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
          },
        },
      },
    });

    return { success: true, value: category };
  } catch (error) {
    console.log("error getting products by category id, server:", error);
    return { success: false, value: null, error };
  }
}
