const express = require("express");
const router = express.Router();
const { uploadLicense } = require("../controllers/uploadController");

router.post("/upload-license", uploadLicense);

module.exports = router;
