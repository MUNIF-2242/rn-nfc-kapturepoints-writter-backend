const User = require("../models/User");

exports.createUser = async (req, res) => {
  const { phoneNumber, tagId, isCardActivated } = req.body;

  if (!phoneNumber || !tagId || isCardActivated) {
    return res.status(400).json({ error: "Phone number and tag are required" });
  }

  try {
    // Check if the tagId is already associated with an existing user
    const existingUserWithTag = await User.findOne({ tagId });
    if (existingUserWithTag) {
      return res.status(409).json({ error: "Tag ID already in use" });
    }

    // Check if the phoneNumber already exists
    const existingUserWithPhoneNumber = await User.findOne({ phoneNumber });
    if (existingUserWithPhoneNumber) {
      return res.status(409).json({ error: "User already exists" });
    }

    // If no existing user with phoneNumber or tagId, create the new user
    const newUser = new User({ phoneNumber, tagId, isCardActivated });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUserByPhoneNumber = async (req, res) => {
  const { phoneNumber } = req.params;

  if (!phoneNumber) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  try {
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateUserById = async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateUserBalance = async (req, res) => {
  const { userId } = req.params;
  const { balance } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  if (balance === undefined) {
    return res.status(400).json({ error: "Balance is required" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { balance } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "Balance updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating balance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
