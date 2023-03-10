import express from "express";
const router = express.Router();

import {
  createJob,
  updateJob,
  deleteJob,
  getJob,
  getAllJobs,
  getAllJobsByCompany,
  getSingleJobApplicants,
  updateUserApplicationStatus,
} from "../controllers/jobController";
import {
  authenticateUser,
  authorizePermissions,
} from "../utils/authentication";

router.post(
  "/",
  authenticateUser,
  authorizePermissions("admin", "company"),
  createJob
);

router.get("/:id", getJob);
router.get("/", getAllJobs);
router.get("/company/:id", getAllJobsByCompany);
router.get(
  "/job/:id",
  authenticateUser,
  authorizePermissions("company"),
  getSingleJobApplicants
);

router.patch(
  "/:id",
  authenticateUser,
  authorizePermissions("admin", "company"),
  updateJob
);
router.patch(
  "/user/:id",
  authenticateUser,
  authorizePermissions("company"),
  updateUserApplicationStatus
);

router.delete(
  "/:id",
  authenticateUser,
  authorizePermissions("company", "admin"),
  deleteJob
);

export default router;
