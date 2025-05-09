const express = require("express");
const router = express.Router();
const {
  createUser,
  getUserByPhoneNumber,
  updateUserById,
  updateUserBalance,
} = require("../controllers/userController");

router.post("/create-user", createUser);
router.get("/get-user/:phoneNumber", getUserByPhoneNumber);
router.patch("/update-user/:userId", updateUserById);
router.patch("/update-balance/:userId", updateUserBalance);

module.exports = router;
