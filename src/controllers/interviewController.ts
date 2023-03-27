import { Request, Response } from "express";
import { Application } from "../models/Application";
import {
  Interview,
  InterviewDocument,
  InterviewInput,
} from "../models/Interview";
import { Job } from "../models/Job";
import { User } from "../models/User";
import checkPermission from "../utils/checkPermission";
import moment from "moment";
import {
  checkInterviewDateConflict,
  isInterviewDateTimeValid,
} from "../utils/dateHelper";

const createInterview = async (
  req: Request<{}, {}, InterviewInput>,
  res: Response
) => {
  const { message, date, user, job } = req.body;

  if (!message || !date || !user || !job) {
    return res.status(400).json({ msg: "Please provide all values!" });
  }

  const checkJob = await Job.findOne({ _id: job });
  if (!checkJob) {
    return res.status(404).json({ msg: `No job with ${job} id found!` });
  }
  const jobId = checkJob._id;

  // @ts-ignore
  checkPermission(res, req.user, checkJob.companyId);

  const checkUser = await User.findOne({ _id: user });
  if (!checkUser) {
    return res.status(404).json({ msg: `No user with ${user} id found!` });
  }

  if (checkUser.role !== "user") {
    return res
      .status(400)
      .json({ msg: "You can send only interview invites to users!" });
  }

  const checkApplication = await Application.findOne({ user, job: jobId });
  if (!checkApplication) {
    return res.status(400).json({
      msg: `The user with ${user} id hasn't applied to the job with ${jobId} id!`,
    });
  }

  const interviewAlreadyExists = await Interview.findOne({ user, job: jobId });
  if (interviewAlreadyExists) {
    return res
      .status(400)
      .json({ msg: "You can send only one interview invite per user!" });
  }

  if (!isInterviewDateTimeValid(date)) {
    return res.status(400).json({
      msg: "Please provide a valid date and time!",
    });
  }

  if (!(await checkInterviewDateConflict(user, date))) {
    return res.status(400).json({
      msg: "An interview for this user has already been scheduled for this day!",
    });
  }

  const interview = await Interview.create({
    position: checkJob.position,
    // @ts-ignore
    companyId: req.user.userId,
    message,
    date,
    user,
    job: jobId,
  });

  return res.status(201).json({ interview });
};

const getInterview = async (req: Request, res: Response) => {
  const { id } = req.params;

  const interview = await Interview.findOne({ _id: id })
    .populate({
      path: "companyId",
      select: "fullName email",
    })
    .populate({
      path: "job",
      select: "position location salary type",
    });
  if (!interview) {
    return res.status(404).json({ msg: `No interview found with ${id} id!` });
  }

  return res.status(200).json({ interview });
};

const getAllInterviews = async (req: Request, res: Response) => {
  // @ts-ignore
  const interviews = await Interview.find({ user: req.user.userId })
    .populate({
      path: "companyId",
      select: "fullName email",
    })
    .populate({
      path: "job",
      select: "position location salary type",
    });

  if (interviews.length === 0) {
    return res.status(404).json({ msg: `No interview found!` });
  }

  return res.status(200).json({ interviews, totalCount: interviews.length });
};

const getAllCompanyInterviews = async (req: Request, res: Response) => {
  // @ts-ignore
  const interviews = await Interview.find({ companyId: req.user.userId })
    .populate({
      path: "companyId",
      select: "fullName email",
    })
    .populate({
      path: "job",
      select: "position location salary type",
    })
    .populate({
      path: "user",
      select: "fullName email",
    });

  if (interviews.length === 0) {
    return res.status(404).json({ msg: `No interview found!` });
  }

  return res.status(200).json({ interviews, totalCount: interviews.length });
};

const updateInterview = async (req: Request, res: Response) => {
  const { message, date } = req.body;
  const { id } = req.params;

  if (!message && !date) {
    return res.status(400).json({ msg: "Please provide a value!" });
  }

  const interview = await Interview.findOne({ _id: id });
  if (!interview) {
    return res.status(404).json({ msg: `No interview found with ${id} id!` });
  }

  // @ts-ignore
  checkPermission(res, req.user, interview.companyId);

  if (date) {
    if (!isInterviewDateTimeValid(date)) {
      return res.status(400).json({
        msg: "Please provide a valid date and time!",
      });
    }

    if (!(await checkInterviewDateConflict(interview.user, date))) {
      return res.status(400).json({
        msg: "An interview for this user has already been scheduled for this day!",
      });
    }
  }

  const updatedInterview = await Interview.findOneAndUpdate(
    { _id: id },
    {
      message,
      date,
      status: "pending",
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({ updatedInterview });
};

const updateInterviewStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ msg: "Please provide status!" });
  }

  const interview = await Interview.findOne({ _id: id });
  if (!interview) {
    return res.status(404).json({ msg: `No interview found with ${id} id!` });
  }

  // @ts-ignore
  checkPermission(res, req.user, interview.user);

  const updatedInterview = await Interview.findOneAndUpdate(
    { _id: id },
    { status },
    {
      new: true,
      runValidators: true,
    }
  );

  return res.status(200).json({ updatedInterview });
};

const deleteInterview = async (req: Request, res: Response) => {
  const { id } = req.params;

  const interview = await Interview.findOne({ _id: id });
  if (!interview) {
    return res.status(404).json({ msg: `No interview found with ${id} id!` });
  }

  // @ts-ignore
  checkPermission(res, req.user, interview.companyId);

  await Interview.deleteOne({ _id: id });

  return res.status(200).json({ msg: "Successful! Interview deleted!" });
};

export {
  createInterview,
  deleteInterview,
  updateInterview,
  getInterview,
  getAllInterviews,
  getAllCompanyInterviews,
  updateInterviewStatus,
};
