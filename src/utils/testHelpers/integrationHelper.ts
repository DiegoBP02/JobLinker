import mongoose from "mongoose";
import { Express } from "express";
import { createApplication } from "./applicationHelper";
import { createJobAndGetId, createJobInput } from "./jobHelper";
import {
  getTokenFromResponse,
  loginUserAndGetToken,
  registerUser,
} from "./authenticateHelper";
import { createInterview } from "./interviewHelper";

const createJobAndApplication = async (app: Express, token: string) => {
  const jobId = await createJobAndGetId(app, token, createJobInput);
  const application = await createApplication(app, token, jobId);
  return { applicationId: application.body.application._id, jobId };
};

const createRandomId = () => {
  return new mongoose.Types.ObjectId().toString();
};

const getAllUsersResult = {
  users: [
    {
      _id: expect.any(String),
      fullName: "test",
      email: "test2@email.com",
      role: "user",
    },
  ],
  totalCount: 1,
};

const createJobAndUserApplication = async (
  app: Express,
  userNumber: number
) => {
  const token = await loginUserAndGetToken(app);
  const jobId = await createJobAndGetId(app, token, createJobInput);

  const user = await registerUser(app, userNumber);
  const tokenUser = getTokenFromResponse(user);
  await createApplication(app, tokenUser, jobId);

  return { jobId, userId: user.body.tokenUser.userId };
};

const generateUniqueNumber = () => {
  const timestamp = new Date().getTime();
  const randomNumber = Math.floor(Math.random() * 1000);
  const uniqueNumber = parseInt(timestamp.toString() + randomNumber.toString());
  return uniqueNumber;
};

const createJobApplicationAndInterview = async (app: Express) => {
  const randomNumber = generateUniqueNumber();
  const tokenAdmin = await loginUserAndGetToken(app);
  const jobId = await createJobAndGetId(app, tokenAdmin, createJobInput);

  const user = await registerUser(app, randomNumber);
  const tokenUser = getTokenFromResponse(user);
  await createApplication(app, tokenUser, jobId);
  const userId = user.body.tokenUser.userId;

  const loginTokenAdmin = await loginUserAndGetToken(app);
  const { interviewId } = await createInterview(
    app,
    loginTokenAdmin,
    jobId,
    userId
  );

  return { interviewId, randomNumber };
};

const URL = "/api/v1";

export {
  createJobAndApplication,
  createRandomId,
  getAllUsersResult,
  createJobAndUserApplication,
  generateUniqueNumber,
  createJobApplicationAndInterview,
  URL,
};
