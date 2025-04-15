import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";
import cloudinary from "../config/cloudinary.js";
import appError from "../utils/appError.js";
import { FAIL, SUCCESS } from "../utils/httpStatusText.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";

export const register = asyncWrapper(async (req, res, next) => {
  const { email, fullName, password } = req.body;
  if (!email || !fullName || !password) {
    const error = appError.create("All fields are required", 400, FAIL);
    return next(error);
  }
  if (password.length < 6) {
    const error = appError.create(
      "Password must be at least 6 characters",
      400,
      FAIL
    );
    return next(error);
  }

  const user = await User.findOne({ email });
  if (user) {
    const error = appError.create("User already exists", 400, FAIL);
    return next(error);
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({
    email,
    fullName,
    password: hashedPassword,
  });

  if (newUser) {
    generateToken(newUser._id, res);
    await newUser.save();
    res.status(201).json({ status: SUCCESS, data: { user: {
        _id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        profilePic: newUser.profilePic,
        createdAt: user.createdAt,

    } } });
  } else {
    const error = appError.create("User registration failed", 400, FAIL);
    return next(error);
  }
});

export const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    const error = appError.create("Invalid Credentials", 400, FAIL);
    return next(error);
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    const error = appError.create("Invalid Credentials", 400, FAIL);
    return next(error);
  }

  generateToken(user._id, res);
  res.status(200).json({
    status: SUCCESS,
    data: {
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        profilePic: user.profilePic,
        createdAt: user.createdAt,
      },
    },
  });
});

export const logout = asyncWrapper(async (req, res, next) => {
  res.cookie("jwt_chat_app", "", {
    maxAge: 0,
  });
  res.status(200).json({ message: "User logged out successfully" });
});

export const updateProfile = asyncWrapper(async (req, res, next) => {
  const { profilePic } = req.body;
  const userId = req.user._id;
  if (!profilePic) {
    const error = appError.create("Profile picture is required", 400, FAIL);
    return next(error);
  }
  const uploadResponse = await cloudinary.uploader.upload(profilePic);
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      profilePic: uploadResponse.secure_url,
    },
    { new: true }
  );
  res.status(200).json({ status: SUCCESS, data: { user: updatedUser } });
});

export const checkAuth = asyncWrapper((req, res, next) => {
  res.status(200).json({ status: SUCCESS, data: { user: {
    _id: req.user._id,
    email: req.user.email,
    fullName: req.user.fullName,
    profilePic: req.user.profilePic,
    createdAt: req.user.createdAt,
  } } });
});
