import express from "express";
const router = express.Router();

import {
  createApplication,
  getApplication,
  getAllApplications,
  updateApplication,
  deleteApplication,
} from "../controllers/applicationController";
import { authenticateUser } from "../utils/authentication";

router.post("/", authenticateUser, createApplication);

router.get("/:id", authenticateUser, getApplication);
router.get("/", authenticateUser, getAllApplications);

router.patch("/:id", authenticateUser, updateApplication);

router.delete("/:id", authenticateUser, deleteApplication);

export default router;
