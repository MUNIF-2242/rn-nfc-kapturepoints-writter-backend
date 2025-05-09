const express = require("express");
const router = express.Router();
const { uploadNid } = require("../controllers/uploadController");

router.post("/upload-nid", uploadNid);

module.exports = router;
