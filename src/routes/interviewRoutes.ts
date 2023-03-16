import express from "express";
const router = express.Router();

import {
  createInterview,
  deleteInterview,
  updateInterview,
  getInterview,
  getAllInterviews,
  getAllCompanyInterviews,
  updateInterviewStatus,
} from "../controllers/interviewController";
import {
  authenticateUser,
  authorizePermissions,
} from "../utils/authentication";

router.post(
  "/",
  authenticateUser,
  authorizePermissions("admin", "company"),
  createInterview
);

router.get(
  "/",
  authenticateUser,
  authorizePermissions("admin", "user"),
  getAllInterviews
);
router.get(
  "/company",
  authenticateUser,
  authorizePermissions("admin", "company"),
  getAllCompanyInterviews
);
router.get("/:id", authenticateUser, getInterview);

router.patch(
  "/:id",
  authenticateUser,
  authorizePermissions("admin", "company"),
  updateInterview
);
router.patch(
  "/status/:id",
  authenticateUser,
  authorizePermissions("admin", "user"),
  updateInterviewStatus
);

router.delete(
  "/:id",
  authenticateUser,
  authorizePermissions("admin", "company"),
  deleteInterview
);

export default router;
