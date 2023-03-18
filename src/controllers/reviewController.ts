import { Request, Response } from "express";
import moment from "moment";
import { Application } from "../models/Application";
import { Job } from "../models/Job";
import { Review, ReviewInput } from "../models/Review";
import checkPermission from "../utils/checkPermission";
import { isReviewDateValid } from "../utils/dateHelper";

const createReview = async (
  req: Request<{}, {}, ReviewInput>,
  res: Response
) => {
  const { rating, title, comment, job } = req.body;

  if (!rating || !title || !comment || !job) {
    return res.status(400).json({ msg: "Please provide all values!" });
  }

  // @ts-ignore
  const { userId } = req.user;

  const checkJob = await Job.findOne({ _id: job });
  if (!checkJob) {
    return res.status(404).json({ msg: `No job with ${job} id found!` });
  }

  const checkApplication = await Application.findOne({ user: userId, job });
  if (!checkApplication) {
    return res
      .status(403)
      .json({ msg: " You can only review companies that you applied!" });
  }

  const alreadySubmitted = await Review.findOne({ user: userId, job });
  if (alreadySubmitted) {
    return res.status(403).json({ msg: "You can send only 1 review per job!" });
  }

  // @ts-ignore
  const review = await Review.create({ ...req.body, user: userId });

  return res.status(201).json({ review });
};

const getSingleReview = async (req: Request, res: Response) => {
  const { id } = req.params;

  const review = await Review.findOne({ _id: id });
  if (!review) {
    return res.status(404).json({ msg: `No review with ${id} id found!` });
  }

  return res.status(200).json({ review });
};

const getAllReviewsByJob = async (req: Request, res: Response) => {
  const { id } = req.params;
  const reviews = await Review.find({ job: id })
    .populate({
      path: "job",
      select: "company",
    })
    .populate({ path: "user", select: "fullName" });

  if (reviews.length === 0) {
    return res
      .status(404)
      .json({ msg: `No review from job with ${id} id found!` });
  }

  return res.status(200).json({ reviews, totalCount: reviews.length });
};

const updateReview = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { rating, title, comment } = req.body;

  const review = await Review.findOne({ _id: id });
  if (!review) {
    return res.status(404).json({ msg: `No review found with ${id} id!` });
  }

  // @ts-ignore
  checkPermission(res, req.user, review.user);

  const fields = [rating, title, comment];

  if (!fields.some((field) => field !== undefined)) {
    return res.status(400).json({ msg: "Please provide at least one field!" });
  }

  const date = review.createdAt;

  if (!isReviewDateValid(date)) {
    return res.status(403).json({
      msg: "You can only update your review within 24 hours after it was created!",
    });
  }

  const updatedReview = await Review.findOneAndUpdate(
    { _id: id },
    { rating, title, comment },
    { new: true, runValidators: true }
  );

  return res.status(200).json({ updatedReview });
};

const deleteReview = async (req: Request, res: Response) => {
  const { id } = req.params;

  const review = await Review.findOne({ _id: id });
  if (!review) {
    return res.status(404).json({ msg: `No review found with ${id} id!` });
  }

  // @ts-ignore
  checkPermission(res, req.user, review.user);

  await Review.deleteOne({ _id: id });

  return res.status(200).json({ msg: "Successful! Review deleted!" });
};

export {
  createReview,
  getSingleReview,
  getAllReviewsByJob,
  updateReview,
  deleteReview,
};
