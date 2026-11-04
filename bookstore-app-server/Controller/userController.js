const users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// register logic

exports.registerController = async (req, res) => {
  console.log("resigtration logic");
  const { username, email, password } = req.body;
  // check email in db
  const existingUser = await users.findOne({ email });
  if (existingUser) {
    res.status(409).json("User already exist!. Please Login");
  } else {
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = await users.create({
      username,
      email,
      password: encryptedPassword,
    });
    res.status(200).json(newUser);
  }
};

//login logic
exports.loginController = async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await users.findOne({ email });
  if (existingUser) {
    const isPasswordMatch = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (isPasswordMatch) {
      const token = jwt.sign(
        { userEmail: email, role: existingUser.role },
        process.env.JWTSECRET,
      );
      res.status(200).json({ user: existingUser, token });
    } else {
      res.status(404).json("Invalid Password");
    }
  } else {
    res.status(409).json("invalid Email ...Please Register ");
  }
};

//google login logic
exports.googleLoginController = async (req, res) => {
  console.log("Inside googlelogin");
  const { username, email, password, picture } = req.body;
  const existingUser = await users.findOne({ email });
  if (existingUser) {
    const token = jwt.sign(
      { userEmail: existingUser.email, role: existingUser.role },
      process.env.JWTSECRET,
    );
    res.status(200).json({ user: existingUser, token });
  } else {
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = await users.create({
      username,
      email,
      password: encryptedPassword,
      picture,
    });
    const token = jwt.sign(
      { userEmail: newUser.email, role: newUser.role },
      process.env.JWTSECRET,
    );
    res.status(200).json({ user: newUser, token });
  }
};

// profile update
exports.userEditController = async (req, res) => {
  try {
    const { username, password, bio } = req.body;
    if (!username?.trim()) {
      return res.status(400).json({ message: "Username is required." });
    }

    const account = await users.findOne({ email: req.payload.userEmail });
    if (!account || account._id.toString() !== req.params.id) {
      return res.status(404).json({ message: "User not found." });
    }

    account.username = username.trim();
    account.bio = (bio || "").trim();
    if (req.file) account.picture = req.file.filename;
    if (password) account.password = await bcrypt.hash(password, 10);
    await account.save();

    const safeUser = account.toObject();
    delete safeUser.password;
    return res.status(200).json(safeUser);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID." });
    }
    return res.status(500).json({ message: "Could not update profile." });
  }
};

// ---------------------admin-----------------

exports.getAllUserController = async (req, res) => {
  console.log("inside getAllUserController");

  const userList = await users.find({ role: "user" }).select("-password");
  res.status(200).json(userList);
};
