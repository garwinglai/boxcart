const { Storage } = require("@google-cloud/storage");

export default async function handler(req, res) {
  const { method, body } = req;
  console.log("copy");
  const { subdomain, fireStorageId, oldStorageId, fileName } = body;
  if (method === "POST") {
    const storage = new Storage();

    const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    const destFileName = `account/${subdomain}/products/${fireStorageId}/productImages/${fileName}`;
    const srcFileName = `account/${subdomain}/products/${oldStorageId}/productImages/${fileName}`;

    const copyDestination = storage.bucket(bucket).file(destFileName);
    try {
      const storageFileRes = await storage
        .bucket(bucket)
        .file(srcFileName)
        .copy(copyDestination);

      return res.status(200).json({ success: true, message: "File copied" });
    } catch (error) {
      console.log("error", error);
      return res
        .status(500)
        .json({ success: false, message: "File not copied" });
    }
  }
}
