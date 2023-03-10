import { Request, Response } from "express";
import { Application } from "../models/Application";
import { Job } from "../models/Job";
import { User, UserDocument, UserInput } from "../models/User";
import createTokenUser from "../utils/createTokenUser";
import { attachCookiesToResponse } from "../utils/jwt";

const register = async (req: Request<{}, {}, UserInput>, res: Response) => {
  const { email, fullName, password, role } = req.body;

  if (!email || !fullName || !password) {
    return res.status(400).json({ msg: "Please provide all values!" });
  }

  const checkAdmin = role === "admin";
  if (checkAdmin) {
    return res
      .status(401)
      .json({ msg: "You aren't allowed to create an admin account!" });
  }

  const isFirstAccount = (await User.countDocuments({})) === 0;
  const newRole = isFirstAccount ? "admin" : role;

  const user = await User.create({ fullName, email, password, role: newRole });

  const tokenUser = createTokenUser(user as UserDocument);

  attachCookiesToResponse({ res }, tokenUser);

  return res.status(201).json({ tokenUser });
};

const login = async (req: Request<{}, {}, UserInput>, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Please provide all values!" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ msg: "Invalid credentials!" });
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({ msg: "Invalid credentials!" });
  }

  const tokenUser = createTokenUser(user as UserDocument);

  attachCookiesToResponse({ res }, tokenUser);

  return res.status(200).json({ tokenUser });
};

const getCurrentUser = async (req: Request, res: Response) => {
  // @ts-ignore
  const { userId } = req.user;
  const user = await User.findOne({ _id: userId });
  const tokenUser = createTokenUser(user as UserDocument);

  return res.status(200).json({ tokenUser });
};

const logout = async (req: Request, res: Response) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
  return res.status(200).json({ msg: "User logged out!" });
};

const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find({ role: { $ne: "admin" } }).select(
    "-password -createdAt -updatedAt -__v"
  );
  return res.status(200).json({ users, totalCount: users.length });
};

const getSingleUser = async (req: Request, res: Response) => {
  const { id: userId } = req.params;

  const user = await User.findOne({ _id: userId }).select("-password");
  if (!user) {
    return res.status(404).json({ msg: `No user with ${userId} id!` });
  }

  return res.status(200).json({ user });
};

const deleteUser = async (req: Request, res: Response) => {
  const { id: userId } = req.params;

  const user = await User.findOne({ _id: userId });
  if (!user) {
    return res.status(404).json({ msg: `No user with ${userId} id!` });
  }
  if (user.role === "admin") {
    return res.status(401).json({ msg: "Unauthorized to access this route!" });
  }

  const jobs = await Job.find({ companyId: userId }).select("_id");
  const jobIds = jobs.map((job) => job._id);
  await Application.deleteMany({ job: { $in: jobIds } }).exec();

  await Job.deleteMany({ companyId: userId }).exec();
  await User.deleteOne({ _id: userId }).exec();

  return res.status(200).json({ msg: "User deleted successfuly!" });
};

export {
  register,
  login,
  logout,
  getCurrentUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
};
