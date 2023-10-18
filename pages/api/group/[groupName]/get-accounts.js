import { getKintSugiRelatedAccounts } from "@/helper/groups/kintsugi";

export default async function handler(req, res) {
  // Your code to retrieve KintSugi accounts goes here
  const { method, query, body } = req;

  const { groupName } = query;

  if (method === "GET") {
    const { success, value, error } = await getKintSugiRelatedAccounts(
      groupName
    );

    if (success) {
      // Send the KintSugi accounts as a response
      res.status(200).json({ accounts: value });
    } else {
      console.error(error);
      res.status(500).json({ message: "Internal server error", error });
    }
  }
}
