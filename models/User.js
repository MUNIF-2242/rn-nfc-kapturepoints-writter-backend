const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  tagId: { type: String, required: true },

  bloodGroup: { type: String, required: false },
  dateOfBirth: { type: String, required: false },
  fatherName: { type: String, required: false },
  isLicenseDateValid: { type: Boolean, required: false },
  licenseExpirationDate: { type: String, required: false },
  licenseHolderName: { type: String, required: false },
  licenseIssueDate: { type: String, required: false },

  balance: { type: String, required: false },
});

module.exports = mongoose.model("User", userSchema);
