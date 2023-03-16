import { Request, Response } from "express";
import { Application } from "../models/Application";
import { Job, JobDocument, JobInput } from "../models/Job";
import checkPermission from "../utils/checkPermission";

const createJob = async (req: Request<{}, {}, JobInput>, res: Response) => {
  const { position, description, location, salary, type } = req.body;

  if (!position || !description || !location || !salary || !type) {
    return res.status(400).json({ msg: "Please provide all values!" });
  }

  const job = await Job.create({
    position,
    // @ts-ignore
    company: req.user.fullName,
    description,
    location,
    salary,
    type,
    // @ts-ignore
    companyId: req.user.userId,
  });

  return res.status(201).json({ job });
};

const updateJob = async (req: Request, res: Response) => {
  const { position, description, location, salary, type } = req.body;
  const { id: jobId } = req.params;
  const fields = [position, description, location, salary, type];
  if (!fields.some((field) => field !== undefined)) {
    return res.status(400).json({ msg: "Please provide at least one field!" });
  }

  const job = await Job.findOne({ _id: jobId });
  if (!job) {
    return res.status(404).json({ msg: `No job found with id '${jobId}'!` });
  }

  const updatedJob = await Job.findByIdAndUpdate(
    { _id: jobId },
    {
      position,
      description,
      location,
      salary,
      type,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  // @ts-ignore
  checkPermission(res, req.user, job.companyId);

  return res.status(200).json({ job: updatedJob });
};

const deleteJob = async (req: Request, res: Response) => {
  const { id: jobId } = req.params;

  const job = await Job.findOne({ _id: jobId });
  if (!job) {
    return res.status(404).json({ msg: `No job found with id '${jobId}'!` });
  }

  // @ts-ignore
  if (req.user.role !== "admin") {
    // @ts-ignore
    checkPermission(res, req.user, job.companyId);
  }

  await Application.deleteMany({ job: jobId }).exec();
  await Job.deleteOne({ _id: jobId }).exec();

  return res.status(200).json({ msg: "Job deleted successfully!" });
};

const getJob = async (req: Request, res: Response) => {
  const { id: jobId } = req.params;

  const job = await Job.findOne({ _id: jobId });
  if (!job) {
    return res.status(404).json({ msg: `No job found with id '${jobId}'!` });
  }

  return res.status(200).json({ job });
};

const getAllJobs = async (req: Request, res: Response) => {
  const { search, type, sort } = req.query;

  const queryObject = {};

  if (search) {
    // @ts-ignore
    queryObject.position = { $regex: search, $options: "i" };
  }
  if (type && type !== "all") {
    // @ts-ignore
    queryObject.type = type;
  }

  let result = Job.find(queryObject);

  if (sort === "latest") {
    result = result.sort("-createdAt");
  }
  if (sort === "oldest") {
    result = result.sort("createdAt");
  }
  if (sort === "a-z") {
    result = result.sort("position");
  }
  if (sort === "z-a") {
    result = result.sort("-position");
  }
  if (sort === "ascending") {
    result = result.sort("salary");
  }
  if (sort === "descending") {
    result = result.sort("-salary");
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const jobs = await result;

  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);

  return res.status(200).json({ jobs, totalCount: totalJobs, numOfPages });
};

const getAllJobsByCompany = async (req: Request, res: Response) => {
  const { id: companyId } = req.params;
  const jobs = await Job.find({ companyId });

  return res.status(200).json({ jobs, totalCount: jobs.length });
};

const getSingleJobApplicants = async (req: Request, res: Response) => {
  const { id: jobId } = req.params;

  const job = await Job.findOne({ _id: jobId });
  if (!job) {
    return res.status(404).json({ msg: `No job with ${jobId} id found!` });
  }

  const singleJobApplicants = await Application.find({ job: jobId }).populate({
    path: "user",
    select: "fullName email",
  });
  if (singleJobApplicants.length === 0) {
    return res
      .status(404)
      .json({ msg: `No application for job with ${jobId} id found!` });
  }

  // @ts-ignore
  checkPermission(res, req.user, job.companyId);

  return res
    .status(200)
    .json({ singleJobApplicants, totalCount: singleJobApplicants.length });
};

const updateUserApplicationStatus = async (req: Request, res: Response) => {
  const { id: applicationId } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ msg: "Please provide status!" });
  }

  const application = await Application.findOne({ _id: applicationId });
  if (!application) {
    return res
      .status(404)
      .json({ msg: `No application with ${applicationId} id found!` });
  }

  const job = await Job.findOne({ _id: application.job });

  // @ts-ignore
  checkPermission(res, req.user, job.companyId);

  const updatedApplication = await Application.findOneAndUpdate(
    { _id: applicationId },
    { status },
    { new: true, runValidators: true }
  );

  return res.status(200).json({ updatedApplication });
};

export {
  createJob,
  updateJob,
  deleteJob,
  getJob,
  getAllJobs,
  getAllJobsByCompany,
  getSingleJobApplicants,
  updateUserApplicationStatus,
};
