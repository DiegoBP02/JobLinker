import express from "express";
const router = express.Router();

import {
  register,
  login,
  logout,
  getCurrentUser,
} from "../controllers/authController";
import { authenticateUser } from "../utils/authentication";

router.post("/register", register);
router.post("/login", login);
router.get("/getCurrentUser", authenticateUser, getCurrentUser);
router.get("/logout", authenticateUser, logout);

export default router;
