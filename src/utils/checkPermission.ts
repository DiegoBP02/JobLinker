import { Response } from "express";
import mongoose from "mongoose";
import { TokenUser } from "./createTokenUser";

const checkPermission = (
  res: Response,
  requestUser: TokenUser,
  resourceUserId: string
) => {
  console.log(requestUser, resourceUserId);
  if (requestUser.role === "admin") return;
  if (requestUser.userId === resourceUserId.toString()) return;
  return res.status(401).json({ msg: "Unauthorized to access this route!" });
};

export default checkPermission;
