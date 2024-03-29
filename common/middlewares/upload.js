const { nanoid } = require("nanoid");
const { Storage } = require("@google-cloud/storage");
const { GCS_PRIVATE_BUCKET, GCS_PUBLIC_BUCKET } = require("../constants/gcs");
const storage = new Storage({ keyFilename: "./gcpKeys/gcs.json" });
const privateBucket = storage.bucket(GCS_PRIVATE_BUCKET);
const publicBucket = storage.bucket(GCS_PUBLIC_BUCKET);
exports.uploadPrivateDoc = (path, req, res, next) => {
  return new Promise((resolve, reject) => {
    try {
      const newFileName = `${path}/${nanoid()}-${req.file.originalname}`;
      req.body.path = newFileName;
      const blob = privateBucket.file(newFileName);
      const blobStream = blob.createWriteStream();
      blob.on("error", (err) => {
        throw err;
      });
      blob.on("finish", () => {
        req.body.path = newFileName;
      });
      blobStream.end(req.file.buffer);
      resolve(req);
    } catch (error) {
      reject(error);
    }
  });
};

exports.uploadPublicDoc = (path, req, res, next) => {
  return new Promise((resolve, reject) => {
    try {
      const newFileName = `${path}/${nanoid()}-${req.file.originalname}`;
      req.body.path = newFileName;
      const blob = publicBucket.file(newFileName);
      const blobStream = blob.createWriteStream();
      blob.on("error", (err) => {
        throw err;
      });
      blob.on("finish", () => {
        req.body.path = newFileName;
      });
      blobStream.end(req.file.buffer);
      resolve(req);
    } catch (error) {
      reject(error);
    }
  });
};
