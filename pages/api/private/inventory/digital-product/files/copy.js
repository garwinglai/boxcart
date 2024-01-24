const { Storage } = require("@google-cloud/storage");
import { isAuthServer } from "@/helper/server/auth/isAuthServer";

export default async function handler(req, res) {
  const isLoggedIn = await isAuthServer(req, res);

  if (!isLoggedIn) {
    res.status(401).json({ message: "Invalid credentials." });
    return;
  }

  const { method, body } = req;

  const { subdomain, fireStorageId, digitalFiles } = body;
  if (method === "POST") {
    const copyPromises = [];

    for (let i = 0; i < digitalFiles.length; i++) {
      const file = digitalFiles[i];
      const { name: fileName, fireStorageId: oldStorageId } = file;

      const storage = new Storage();

      const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
      const destFileName = `account/${subdomain}/digital-products/${fireStorageId}/files/${fileName}`;
      const srcFileName = `account/${subdomain}/digital-products/${oldStorageId}/files/${fileName}`;

      const copyDestination = storage.bucket(bucket).file(destFileName);
      const storageFileRes = storage
        .bucket(bucket)
        .file(srcFileName)
        .copy(copyDestination);

      copyPromises.push(storageFileRes);
    }

    try {
      const promise = await Promise.all(copyPromises);

      return res.status(200).json({ success: true, message: "Files copied" });
    } catch (error) {
      console.log("error", error);
      return res
        .status(500)
        .json({ success: false, message: "Files not copied" });
    }
  }
}
