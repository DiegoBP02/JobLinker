import express from "express";
const router = express.Router();

import {
  createReview,
  getReview,
  getAllReviewsByJob,
  updateReview,
  deleteReview,
} from "../controllers/reviewController";
import {
  authenticateUser,
  authorizePermissions,
} from "../utils/authentication";

router.post(
  "/",
  authenticateUser,
  authorizePermissions("admin", "user"),
  createReview
);

router.get("/job/:id", getAllReviewsByJob);
router.get("/:id", getReview);

router.patch(
  "/:id",
  authenticateUser,
  authorizePermissions("admin", "user"),
  updateReview
);

router.delete(
  "/:id",
  authenticateUser,
  authorizePermissions("admin", "user"),
  deleteReview
);

export default router;
