import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const generateAccessToken = (User) => {
  return jwt.sign({ email: User.email }, process.env.ACCESS_JWT_SECRET, {
    expiresIn: "6h",
  });
};
const generateRefreshToken = (User) => {
  return jwt.sign({ email: User.email }, process.env.REFRESH_JWT_SECRET, {
    expiresIn: "7d",
  });
};

// register user
const registerUser = async (req, res) => {
  const { userName ,  email, password } = req.body;

  if (!email)
    return res.status(401).json({
      message: "please enter your email",
    });
  if (!password)
    return res.status(401).json({
      message: "please enter your password",
    });
  if (!userName)
    return res.status(401).json({
      message: "please enter user name",
    });

  try {
    const user = await User.findOne({ email });
    if (user)
      return res.status(400).json({
        message: "User already exist",
      });

    const createUser = await User.create({ userName , email, password });
    res.json({
      message: "user successfully registerd",
      user: createUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
    });
  }
};

// login user
const loggedinUser = async (req, res) => {
  const { userName , email , password } = req.body;
  if (!email)
    return res.status(401).json({
      message: "please enter your email",
    });
  if (!userName)
    return res.status(401).json({
      message: "please enter your password",
    });
  if (!password)
    return res.status(401).json({
      message: "please enter your password",
    });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "incorrect User" });

  const isPassword = await bcrypt.compare(password, user.password);
  if (!isPassword)
    return res.status(400).json({ message: "incorrect password" });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.cookie("refreshToken", refreshToken, { http: true, secure: false });

  res.json({
    message: "user successfully logged in",
    refreshToken,
    accessToken,
    user,
  });
};

// logout user
const logoutUser = async (req, res) => {
  res.clearCookie("refreshToken");
  res.json({
    message: "user logged out",
  });
};

// regenerate token

const regenerateAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "no refresh token available" });

  try {
    const decodedToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_JWT_SECRET
    );
    const user = User.findOne({ email: decodedToken.email });
    if (!user) return res.status(404).json({ message: "invalid token" });

    const regenerateToken = generateAccessToken(user);

    res.json({
      message: "access token generated",
      token: regenerateToken,
    });
  } catch (err) {
    res.status(500).json({ message: "internal server error" });
  }
};

// protected route
const authenticateUser = (req, res, next) => {
  const token = req.headers("authorization");
  if (!token) return res.status(404).json({ message: "no token found" });
  const decodedToken = jwt.verify(
    token,
    process.env.ACCESS_JWT_SECRET,
    (err, user) => {
      if (err) return res.status(403).json({ message: "invalid token" });
      console.log("authenticate user ===> ", user);
      next();
    }
  );
};

export { registerUser, loggedinUser, logoutUser, regenerateAccessToken , authenticateUser };
