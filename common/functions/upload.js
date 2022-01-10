const { Storage } = require("@google-cloud/storage");
const { GCS_PRIVATE_BUCKET } = require("../constants/gcs");
const storage = new Storage({ keyFilename: "./gcpKeys/gcs.json" });

exports.generateV4UploadSignedUrl = async (fileName, contentType) => {
  const options = {
    version: "v4",
    action: "write",
    expires: Date.now() + 5 * 60 * 1000, // 15 minutes
    contentType: contentType,
  };

  // Get a v4 signed URL for uploading file
  const [url] = await storage
    .bucket(GCS_PRIVATE_BUCKET)
    .file(fileName)
    .getSignedUrl(options);
  return url;
};

exports.generateV4ReadSignedUrl = (fileName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const options = {
        version: "v4",
        action: "read",
        expires: Date.now() + 5 * 60 * 1000, // 15 minutes
      };

      // Get a v4 signed URL for reading file
      const [url] = await storage
        .bucket(GCS_PRIVATE_BUCKET)
        .file(fileName)
        .getSignedUrl(options);
      resolve(url);
    } catch (error) {
      reject(error);
    }
  });
};
exports.deleteFile = (fileName) => {
  return new Promise(async (resolve, reject) => {
    try {
      await storage.bucket(GCS_PRIVATE_BUCKET).file(fileName).delete();
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
