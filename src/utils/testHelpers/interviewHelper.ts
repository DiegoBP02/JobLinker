import moment from "moment";
import { Express } from "express";
import { requestWithAuth } from "./authenticateHelper";

const createInterviewInput = {
  message:
    "Dear Candidate, we are pleased to invite you for an interview on Thursday, March 24th at 2:00pm. The interview will be held at our headquarters located at 123 Main St. Please let us know if this time and location work for you. We look forward to meeting with you.",
  date: moment().add(5, "days").startOf("day").add(8, "hours").toISOString(),
};

const updateInterviewInput = {
  message:
    "Dear Candidate, we are pleased to invite you for an interview on Thursday, March 24th at 2:00pm. The interview will be held at our headquarters located at 123 Main St. Please let us know if this time and location work for you. We look forward to meeting with you.",
  date: moment().add(8, "days").startOf("day").add(8, "hours").toISOString(),
};

const createInterview = async (
  app: Express,
  token: string,
  jobId: string,
  userId: string,
  date?: string
) => {
  const interviewData = {
    ...createInterviewInput,
    job: jobId,
    user: userId,
  };

  if (date) {
    interviewData.date = date;
  }

  const interview = await requestWithAuth(
    app,
    "post",
    `/api/v1/interview`,
    token,
    interviewData
  );

  return { interviewId: interview.body.interview._id };
};

const createInterviewResult = {
  interview: {
    __v: expect.any(Number),
    _id: expect.any(String),
    companyId: expect.any(String),
    createdAt: expect.any(String),
    date: expect.any(String),
    job: expect.any(String),
    message:
      "Dear Candidate, we are pleased to invite you for an interview on Thursday, March 24th at 2:00pm. The interview will be held at our headquarters located at 123 Main St. Please let us know if this time and location work for you. We look forward to meeting with you.",
    position: "Software Engineer",
    status: "pending",
    updatedAt: expect.any(String),
    user: expect.any(String),
  },
};

const getInterviewResult = {
  interview: {
    __v: expect.any(Number),
    _id: expect.any(String),
    companyId: {
      _id: expect.any(String),
      email: "test1@email.com",
      fullName: "test",
    },
    createdAt: expect.any(String),
    date: expect.any(String),
    job: {
      _id: expect.any(String),
      location: "San Francisco, CA",
      position: "Software Engineer",
      salary: 120000,
      type: "full-time",
    },
    message:
      "Dear Candidate, we are pleased to invite you for an interview on Thursday, March 24th at 2:00pm. The interview will be held at our headquarters located at 123 Main St. Please let us know if this time and location work for you. We look forward to meeting with you.",
    position: "Software Engineer",
    status: "pending",
    updatedAt: expect.any(String),
    user: expect.any(String),
  },
};

export {
  createInterviewInput,
  updateInterviewInput,
  createInterview,
  createInterviewResult,
  getInterviewResult,
};
