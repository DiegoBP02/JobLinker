import { requestWithAuth } from "./authenticateHelper";
import { Express } from "express";

const createJobInput = {
  position: "Software Engineer",
  description:
    "We're seeking an experienced software engineer to join our team and help us develop cutting-edge applications for our clients.",
  location: "San Francisco, CA",
  salary: 120000,
  type: "full-time",
};

const createJobInput2 = {
  position: "Frontend Engineer",
  description:
    "We're seeking a frontend engineer to join our team and help develop engaging and user-friendly applications for our clients. This individual should have experience with modern frontend frameworks such as React or Angular, as well as proficiency in HTML, CSS, and JavaScript.",
  location: "San Francisco, CA",
  salary: 100000,
  type: "part-time",
};

const createJobResult = {
  job: {
    __v: expect.any(Number),
    _id: expect.any(String),
    company: "test",
    companyId: expect.any(String),
    createdAt: expect.any(String),
    description:
      "We're seeking an experienced software engineer to join our team and help us develop cutting-edge applications for our clients.",
    location: "San Francisco, CA",
    position: "Software Engineer",
    salary: 120000,
    type: "full-time",
    updatedAt: expect.any(String),
  },
};

const createJobAndGetId = async (
  app: Express,
  token: string,
  createJobInput: object
): Promise<string> => {
  const job = await requestWithAuth(
    app,
    "post",
    `/api/v1/jobs`,
    token,
    createJobInput
  );
  return job.body.job._id;
};

export { createJobInput, createJobInput2, createJobResult, createJobAndGetId };
