const { Storage } = require("@google-cloud/storage");

export default async function handler(req, res) {
  const { method, body } = req;

  const { subdomain, fireStorageId, images } = body;
  if (method === "POST") {
    const copyPromises = [];

    for (let i = 0; i < images.length; i++) {
      const currPhoto = images[i];
      const {
        imgFileName: fileName,
        image: imageFile,
        isDefault,
        fireStorageId: oldStorageId,
      } = currPhoto;

      const storage = new Storage();

      const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
      const destFileName = `account/${subdomain}/products/${fireStorageId}/productImages/${fileName}`;
      const srcFileName = `account/${subdomain}/products/${oldStorageId}/productImages/${fileName}`;

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
