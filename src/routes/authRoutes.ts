import express from "express";
const router = express.Router();

import {
  register,
  login,
  logout,
  getCurrentUser,
} from "../controllers/authController";

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/getCurrentUser", getCurrentUser);

export default router;
