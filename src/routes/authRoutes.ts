import express from "express";
const router = express.Router();

import {
  register,
  login,
  logout,
  getCurrentUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
} from "../controllers/authController";
import {
  authenticateUser,
  authorizePermissions,
} from "../utils/authentication";

router.post("/register", register);
router.post("/login", login);

router.get("/getCurrentUser", authenticateUser, getCurrentUser);
router.get("/logout", authenticateUser, logout);
router.get("/", authenticateUser, authorizePermissions("admin"), getAllUsers);
router.get(
  "/:id",
  authenticateUser,
  authorizePermissions("admin"),
  getSingleUser
);

router.delete(
  "/:id",
  authenticateUser,
  authorizePermissions("admin"),
  deleteUser
);

export default router;
