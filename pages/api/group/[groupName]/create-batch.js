export default async function handler(req, res) {
  const { method, query, body } = req;

  if (method === "POST") {
    // Handle POST request
    const { groupName } = query;
    const { batchData } = body;

    // Create batch logic here
    const builtBatchData = buildBatchData(batchData);
    const { accountId } = batchData;
    const accountIdInt = parseInt(accountId);

    const { success, value, error } = await createBatchProducts(
      builtBatchData,
      accountIdInt
    );

    if (success) {
      res.status(200).json({ batch: value });
    } else {
      res.status(405).json({ message: "Internal server error", error });
    }
  }
}

const buildBatchData = (batchData) => {
  return batchData;
};

// * this is the data i ned
const data = [
  {
    accountId: "",
    products: [],
    images: [],
    optionGroups: [],
    options: [],
    questions: [],
    relatedCategories: [],
  },
];
