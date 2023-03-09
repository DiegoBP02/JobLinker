import { Request, Response } from "express";
import {
  Application,
  ApplicationDocument,
  ApplicationInput,
} from "../models/Application";

const createApplication = async (
  req: Request<{}, {}, ApplicationInput>,
  res: Response
) => {
  res.send("createApplication");
};

const getApplication = async (req: Request, res: Response) => {
  res.send("getApplication");
};

const getAllApplications = async (req: Request, res: Response) => {
  res.send("getAllApplications");
};

const updateApplication = async (req: Request, res: Response) => {
  res.send("updateApplication");
};

const deleteApplication = async (req: Request, res: Response) => {
  res.send("deleteApplication");
};

export {
  createApplication,
  getApplication,
  getAllApplications,
  updateApplication,
  deleteApplication,
};
