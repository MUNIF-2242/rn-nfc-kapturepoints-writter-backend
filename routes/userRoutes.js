const express = require("express");
const router = express.Router();
const {
  createUser,

  updateUserById,
  updateUserBalance,
  getUserByTagId,
  getUserByPhoneNumber,
} = require("../controllers/userController");

// Create a new user
router.post("/create-user", createUser);

// Get user by phone number
router.get("/get-user-by-phone", getUserByPhoneNumber); // This route expects `phoneNumber` as a query parameter

// Get user by tag ID
router.get("/get-user-by-tag", getUserByTagId); // This route expects `tagId` as a query parameter

// Update user by userId
router.patch("/update-user/:userId", updateUserById);

// Update user balance
router.patch("/update-balance/:userId", updateUserBalance);

module.exports = router;
