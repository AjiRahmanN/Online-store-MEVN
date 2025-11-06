const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const authentication = require("../middleware/authentication");

async function register(req, res) {
  // Registration logic here
  const { username, first_name, last_name, email, password, password_confirm } = req.body;

  if (!username || !first_name || !last_name || !email || !password || !password_confirm) {
    return res.status(422).json({ message: "All fields are required" });
  }

  if (password !== password_confirm) {
    return res.status(422).json({ message: "Passwords do not match" });
  }

  const userExists = await User.findOne({ $or: [{ email }, { username }] });
  if (userExists) {
    return res.sendStatus(409).json({ message: "Email or Username already exists" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, first_name, last_name, email, password: hashedPassword });
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error hashing password" });
  }
}

async function login(req, res) {
  // Login logic here
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ message: "Email and Password are required" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const accessToken = jwt.sign(
    {
      id: user.id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );
  const refreshToken = jwt.sign(
    {
      id: user.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
  user.refresh_token = refreshToken;
  await user.save();
  res.cookie("refresh_token", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
  // res.status(200).json({ message: "User logged in successfully" });
  res.json({ access_token: accessToken });
}

async function logout(req, res) {
  // Logout logic here
  const cookies = req.cookies;
  if (!cookies?.refresh_token) return res.sendStatus(204);
  const refreshToken = cookies.refresh_token;
  const user = await User.findOne({ refresh_token: refreshToken });
  if (!user) {
    res.clearCookie("refresh_token", { httpOnly: true });
    return res.sendStatus(204);
  }
  user.refresh_token = null;
  await user.save();
  res.clearCookie("refresh_token", { httpOnly: true });
  res.status(200).json({ message: "User logged out successfully" });
}

async function refresh(req, res) {
  const cookies = req.cookies;
  if (!cookies?.refresh_token) return res.sendStatus(401);

  const refreshToken = cookies.refresh_token;
  const user = await User.findOne({ refresh_token: refreshToken });
  if (!user) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) return res.sendStatus(403);

    const accessToken = jwt.sign({ id: decoded.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

    res.json({ access_token: accessToken });
  });
}

async function user(req, res) {
  // Get user data logic here
  const user = req.user;
  res.status(200).json(user);
}
module.exports = { register, login, logout, refresh, user };
