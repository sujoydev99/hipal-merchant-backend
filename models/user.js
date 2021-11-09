const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
const userSchema = new mongoose.Schema(
  {
    name: { required: false, type: String },
    emails: [
      {
        email: { type: String, required: true },
        otp: { type: String, required: false, default: null },
        expiration: { type: Date, required: false, default: null },
        isActive: { type: Boolean, required: true, default: false },
        isVerified: { type: Boolean, required: true, default: false },
      },
    ],
    contactNumbers: [
      {
        extension: { type: String, required: true },
        number: { type: String, required: true },
        otp: { type: String, required: false, default: null },
        expiration: { type: Date, required: false, default: null },
        isActive: { type: Boolean, required: true, default: false },
        isVerified: { type: Boolean, required: true, default: false },
      },
    ],
    socials: [
      {
        id: { type: String, required: true },
        provider: { type: String, required: true },
        isActive: { type: Boolean, required: true, default: false },
      },
    ],
    addresses: [
      {
        lineOne: { type: String, required: true },
        lineTwo: { type: String, required: true },
        zip: { type: String, required: true },
        state: { type: String },
        city: { type: String },
        country: { type: String },
        isActive: { type: Boolean, default: false },
      },
    ],
    types: { type: Array, default: ["CUSTOMER"] }, // ["ADMIN", "EMPLOYEE", "CUSTOMER"]
    password: { type: String },
    uuid: { type: String, unique: true },
    updatedBy: { type: String },
    profileImageUrl: { type: String },
    coverImageUrl: { type: String },
    resetToken: { type: String },
    resetTokenExpiration: { type: Date },
    documents: [
      {
        docType: {
          type: String,
          enum: ["AADHAR CARD", "PAN CARD", "PASSPORT"],
          required: true,
        },
        url: { type: String, required: true },
        isVerified: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
userSchema.pre("save", function (next) {
  let uuid = `user_${nanoid(20)}`;
  this.set("uuid", uuid);
  next();
});
const User = mongoose.model("user", userSchema);

module.exports = User;
