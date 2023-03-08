import { Request, Response } from "express";
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

  const job = (await Job.findOne({ _id: jobId })) as JobDocument;
  if (!job) {
    return res.status(404).json({ msg: `No job found with id '${jobId}'!` });
  }

  // @ts-ignore
  checkPermission(res, req.user, job.companyId);

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
  const jobs = await Job.find();

  return res.status(200).json({ jobs, totalCount: jobs.length });
};

const getAllJobsByCompany = async (req: Request, res: Response) => {
  const { id: companyId } = req.params;
  const jobs = await Job.find({ companyId });

  return res.status(200).json({ jobs, totalCount: jobs.length });
};

const getSingleJobApplicants = async (req: Request, res: Response) => {
  res.send("getSingleJobApplicants");
};

const deleteUserFromJobApplication = async (req: Request, res: Response) => {
  res.send("deleteUserFromJobApplication");
};

const updateUserJobStatus = async (req: Request, res: Response) => {
  res.send("createupdateUserJobStatusJob");
};

export {
  createJob,
  updateJob,
  deleteJob,
  getJob,
  getAllJobs,
  getAllJobsByCompany,
  getSingleJobApplicants,
  deleteUserFromJobApplication,
  updateUserJobStatus,
};