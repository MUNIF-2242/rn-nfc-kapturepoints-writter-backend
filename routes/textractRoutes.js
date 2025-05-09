const express = require("express");
const router = express.Router();
const { extractLicenseInfo } = require("../controllers/textractController");

router.post("/extract-licenseInfo", extractLicenseInfo);

module.exports = router;
