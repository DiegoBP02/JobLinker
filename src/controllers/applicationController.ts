import { Request, Response } from "express";
import {
  Application,
  ApplicationDocument,
  ApplicationInput,
} from "../models/Application";
import { Job } from "../models/Job";
import checkPermission from "../utils/checkPermission";

const createApplication = async (
  req: Request<{}, {}, ApplicationInput>,
  res: Response
) => {
  const { resume, experience, portfolio, certifications, education, job } =
    req.body;

  if (!resume || !job) {
    return res.status(400).json({ msg: "Please provide all values!" });
  }

  const checkJob = await Job.findOne({ _id: job });
  if (!checkJob) {
    return res.status(400).json({ msg: `No job with ${job} id found!` });
  }

  const alreadyApplied = await Application.findOne({
    job,
    // @ts-ignore
    user: req.user.userId,
  });
  if (alreadyApplied) {
    return res.status(401).json({ msg: "You can apply to a job only once!" });
  }

  const application = await Application.create({
    ...req.body,
    // @ts-ignore
    user: req.user.userId,
    job,
  });

  return res.status(201).json({ application });
};

const getApplication = async (req: Request, res: Response) => {
  const { id } = req.params;

  const application = await Application.findOne({ _id: id }).populate({
    path: "job",
    select: "_id position company description location salary type",
  });

  if (!application) {
    return res.status(400).json({ msg: `No application with ${id} id found!` });
  }

  //@ts-ignore
  checkPermission(res, req.user, application.user);

  return res.status(200).json({ application });
};

const getAllApplications = async (req: Request, res: Response) => {
  // @ts-ignore
  const { userId } = req.user;

  const applications = await Application.find({ user: userId }).populate({
    path: "job",
    select: "_id position company location salary type",
  });

  if (!applications) {
    return res
      .status(400)
      .json({ msg: `No application from user with ${userId} id found!` });
  }

  return res
    .status(200)
    .json({ applications, totalCount: applications.length });
};

const updateApplication = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { resume, experience, portfolio, certifications, education } = req.body;

  const fields = [resume, experience, portfolio, certifications, education];
  if (!fields.some((field) => field !== undefined)) {
    return res.status(400).json({ msg: "Please provide at least one field!" });
  }

  const application = await Application.findOne({ _id: id });
  if (!application) {
    return res.status(400).json({ msg: `No application with ${id} id found!` });
  }

  //@ts-ignore
  checkPermission(res, req.user, application.user);

  const updatedApplication = await Application.findOneAndUpdate(
    { _id: id },
    { resume, experience, portfolio, certifications, education },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({ updatedApplication });
};

const deleteApplication = async (req: Request, res: Response) => {
  const { id } = req.params;

  const application = await Application.findOne({ _id: id });
  if (!application) {
    return res.status(400).json({ msg: `No application with ${id} id found!` });
  }
  //@ts-ignore
  checkPermission(res, req.user, application.user);

  await Application.deleteOne({ _id: id }).exec();
  return res.status(200).json({ msg: "Application deleted successfully!" });
};

export {
  createApplication,
  getApplication,
  getAllApplications,
  updateApplication,
  deleteApplication,
};
