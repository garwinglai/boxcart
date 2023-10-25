import { createBatchProducts } from "@/helper/groups/kintsugi";

export default async function handler(req, res) {
  const { method, query, body } = req;

  // const parsedBody = JSON.parse(body);

  if (method === "POST") {
    // Handle POST request
    const batchData = body;

    // TODO: check if i have to parse data.
    // Create batch logic here
    const builtBatchData = buildBatchData(batchData);
    try {
      const { savedCount, errorCount, savedProducts, productWithErrors } =
        await createBatchProducts(builtBatchData);
      res
        .status(200)
        .json({ savedCount, errorCount, savedProducts, productWithErrors });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }

    // if (success) {
    //   res.status(200).json({ batch: value });
    // } else {
    //   res.status(405).json({ message: "Internal server error", error });
    // }
  }
}

const buildBatchData = (batchData) => {
  const builtBatchData = batchData.map((batch) => {
    const {
      accountId,
      product,
      images,
      optionGroups,
      questions,
      relatedCategories,
    } = batch;
    const accountIdInt = parseInt(accountId);
    const productPricePennyInt = parseInt(product.priceIntPenny);

    const builtBatch = {
      ...product,
      priceIntPenny: productPricePennyInt,
      images: {
        create: images,
      },
      optionGroups: {
        create: optionGroups.map((group) => {
          const { options } = group;
          const pointerToOptionsGroup = group;
          delete pointerToOptionsGroup.options;

          const optionData = {
            ...pointerToOptionsGroup,
            options: {
              create: options,
            },
          };

          return optionData;
        }),
      },
      questions: {
        create: questions,
      },
      relatedCategories: {
        connectOrCreate: relatedCategories.map((category) => {
          const { categoryName } = category;

          const category_identifier = {
            accountId: accountIdInt,
            categoryName,
          };

          return {
            where: {
              category_identifier,
            },
            create: {
              categoryName,
              account: {
                connect: {
                  id: accountIdInt,
                },
              },
            },
          };
        }),
      },
      account: {
        connect: {
          id: accountIdInt,
        },
      },
    };

    return builtBatch;
  });

  return builtBatchData;
};
