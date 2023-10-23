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

// * In product, if hasUnlimitedQuantity is set to false, then for setQuantitybyProduct -> (true = must set quantity in products) (false = must set quantityInt in options)
// const batchProductData = [
//   {
//     accountId: "",
//     product: {
//       //Product schema
//       productName, //String
//       description, //String
//       priceIntPenny, //Int - penny value of price ex: 550
//       priceStr, //String - price display ex: $5.50
//       defaultImage, //String
//       hasUnlimitedQuantity, //Boolean (default = false) (false = set product quantity manually)
//       setQuantityByProduct, //Boolean (default = false) (true = quantity is set per product. false = quantity is set per product variants. ex: Size. sm: 8, md: 10, lg:2)
//       quantity, //Int (Optional) - product quantity
//       enableCustomNote, //Boolean (default = false) (true = allows customers to enter custom note upon checkout)
//       enableCustomerImageUploads, //Booelean (default = false) (true = allows customers to upload their own images as samples. Ex: custom designs)
//     },
//     images: [
//       //product images schema (if no images, set as empty array)
//       {
//         isDefault, //Boolean (default = false) (true = image is the default image displayed in shop)
//         image, //String
//       },
//     ],
//     optionGroups: [
//       //Options groups schema for product (Ex: Size, Flavor, etc) (if not optionGroups, set as empty array)
//       {
//         optionGroupName, //String (Ex: Flavors)
//         productName, //String
//         selectionType, //Int (default = 0) (0 = select 1, 1 = select many)
//         selectionDisplay, //String (default = "select one") (Please input "select one", or "select many")
//         isRequired, //Boolean (default = false) (true = customer must select an option for the product, ex: size)
//         isRequiredDisplay, //String (default = "optional") (Please input "optional", or "required")
//         options: [
//           //options schema for each option group (Ex: small, medium, large) (If optionGroups exists, options array must not be zero, otherwise set as empty array)
//           {
//             optionGroupName, //String (Ex: Flavors)
//             optionName, //String (Ex: "small", "medium", "large")
//             priceIntPenny, //Int - (Optional) (default = 0), penny value of option price ex: 550
//             priceStr, //String - (Optional) (default = $0.00), price display of option ex: $5.50
//             quantityString, //String (Optional) (If value, please enter quantity in string)
//             quantityInt, //Int (Optional)
//           },
//         ],
//       },
//     ],
//     questions: [
//       //question schema (Optional) (owners cna create questions for customers to answer in checkout) (if no questions, set as empty array)
//       {
//         question, //String (Owners can create questions for customers to answer in checkout. Ex: "Please list your allergies")
//         productName, //String (name of product this question is for)
//         isRequired, //Boolean (default = true) (true = customer must answer question on checkout) (false = customer can ignore the quesiton)
//       },
//     ],
//     relatedCategories: [
//       //category schema (Optional) (if no related categories, set as empty array)
//       {
//         categoryName, //String
//       },
//     ],
//   },
// ];
