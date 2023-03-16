import mongoose from "mongoose";
import supertest, { Response } from "supertest";
import { Express } from "express";
import moment from "moment";

const registerHelper = (n: number) => {
  const registerInput = {
    fullName: `test`,
    email: `test${n}@email.com`,
    password: "secret",
  };

  const companyRegisterInput = {
    fullName: `test`,
    email: `test${n}@email.com`,
    password: "secret",
    role: "company",
  };

  const loginInput = {
    email: `test${n}@email.com`,
    password: "secret",
  };

  const registerResult = {
    tokenUser: {
      fullName: `test`,
      userId: expect.any(String),
      role: expect.any(String),
    },
  };

  const getSingleUserResult = {
    user: {
      _id: expect.any(String),
      fullName: "test",
      email: `test${n}@email.com`,
      role: "user",
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      __v: expect.any(Number),
    },
  };

  return {
    registerInput,
    companyRegisterInput,
    loginInput,
    registerResult,
    getSingleUserResult,
  };
};

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

const getTokenFromResponse = (response: Response) => {
  const token = response.get("Set-Cookie").toString();
  return token.split("token=")[1].split(";")[0];
};

const requestWithAuth = async (
  app: Express,
  method: "get" | "post" | "patch" | "delete",
  path: string,
  token?: string,
  data?: object
) => {
  const request = supertest(app)[method](path);
  if (token) {
    request.set(
      "Cookie",
      `token=${token}; Path=/; HttpOnly; Secure; SameSite=none`
    );
  }
  if (data) {
    request.send(data);
  }
  return request;
};

const loginUser = async (app: Express, userNumber: number) => {
  const user = await supertest(app)
    .post(`/api/v1/auth/login`)
    .send(registerHelper(userNumber).loginInput);
  expect(user.get("Set-Cookie")).toBeDefined();
  return user;
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

const createApplicationInput = {
  resume:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin gravida augue quis magna aliquet, sed viverra quam pharetra. Integer sit amet justo purus. In dapibus mi at dui viverra luctus. Sed convallis dolor et tellus venenatis vestibulum. Sed vel sapien metus. Vestibulum mattis, nisi eget facilisis pulvinar, nunc nulla malesuada nunc, non accumsan mauris metus non ipsum. Ut quis nulla a leo aliquam pretium id vitae metus. Nunc pretium, nunc non tristique malesuada, magna velit facilisis arcu, at tincidunt turpis augue sed sapien.",
};

const createApplicationResult = {
  application: {
    resume:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin gravida augue quis magna aliquet, sed viverra quam pharetra. Integer sit amet justo purus. In dapibus mi at dui viverra luctus. Sed convallis dolor et tellus venenatis vestibulum. Sed vel sapien metus. Vestibulum mattis, nisi eget facilisis pulvinar, nunc nulla malesuada nunc, non accumsan mauris metus non ipsum. Ut quis nulla a leo aliquam pretium id vitae metus. Nunc pretium, nunc non tristique malesuada, magna velit facilisis arcu, at tincidunt turpis augue sed sapien.",
    certifications: [],
    status: "pending",
    user: expect.any(String),
    job: expect.any(String),
    _id: expect.any(String),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
    __v: expect.any(Number),
  },
};

const updatedApplicationResult = {
  updatedApplication: {
    resume:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin gravida augue quis magna aliquet, sed viverra quam pharetra. Integer sit amet justo purus. In dapibus mi at dui viverra luctus. Sed convallis dolor et tellus venenatis vestibulum. Sed vel sapien metus. Vestibulum mattis, nisi eget facilisis pulvinar, nunc nulla malesuada nunc, non accumsan mauris metus non ipsum. Ut quis nulla a leo aliquam pretium id vitae metus. Nunc pretium, nunc non tristique malesuada, magna velit facilisis arcu, at tincidunt turpis augue sed sapien.",
    certifications: [],
    status: "pending",
    user: expect.any(String),
    job: expect.any(String),
    _id: expect.any(String),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
    __v: expect.any(Number),
  },
};

const createApplication = async (
  app: Express,
  token: string,
  jobId: string
) => {
  const application = await requestWithAuth(
    app,
    "post",
    `/api/v1/application`,
    token,
    {
      ...createApplicationInput,
      job: jobId,
    }
  );
  return application;
};

const createJobAndApplication = async (app: Express, token: string) => {
  const jobId = await createJobAndGetId(app, token, createJobInput);
  const application = await createApplication(app, token, jobId);
  return { applicationId: application.body.application._id, jobId };
};

const loginUserAndGetToken = async (app: Express) => {
  const user = await loginUser(app, 1);
  const token = getTokenFromResponse(user);
  return token;
};

const createRandomId = () => {
  return new mongoose.Types.ObjectId().toString();
};

const singleJobApplicantsResult = {
  singleJobApplicants: [
    {
      __v: expect.any(Number),
      _id: expect.any(String),
      certifications: [],
      createdAt: expect.any(String),
      job: expect.any(String),
      resume:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin gravida augue quis magna aliquet, sed viverra quam pharetra. Integer sit amet justo purus. In dapibus mi at dui viverra luctus. Sed convallis dolor et tellus venenatis vestibulum. Sed vel sapien metus. Vestibulum mattis, nisi eget facilisis pulvinar, nunc nulla malesuada nunc, non accumsan mauris metus non ipsum. Ut quis nulla a leo aliquam pretium id vitae metus. Nunc pretium, nunc non tristique malesuada, magna velit facilisis arcu, at tincidunt turpis augue sed sapien.",
      status: "pending",
      updatedAt: expect.any(String),
      user: {
        _id: expect.any(String),
        email: "test1@email.com",
        fullName: "test",
      },
    },
  ],
  totalCount: 1,
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

const registerUser = async (app: Express, userNumber: number) => {
  const user = await supertest(app)
    .post(`/api/v1/auth/register`)
    .send(registerHelper(userNumber).registerInput);

  return user;
};

const registerCompany = async (app: Express, userNumber: number) => {
  const user = await supertest(app)
    .post(`/api/v1/auth/register`)
    .send(registerHelper(userNumber).companyRegisterInput);

  return user;
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
  registerHelper,
  getTokenFromResponse,
  requestWithAuth,
  createJobInput,
  createJobResult,
  loginUser,
  createJobAndGetId,
  createApplicationInput,
  createApplicationResult,
  createApplication,
  createJobAndApplication,
  loginUserAndGetToken,
  createRandomId,
  singleJobApplicantsResult,
  updatedApplicationResult,
  getAllUsersResult,
  createJobInput2,
  createInterviewInput,
  createInterview,
  createJobAndUserApplication,
  registerCompany,
  registerUser,
  createInterviewResult,
  generateUniqueNumber,
  createJobApplicationAndInterview,
  getInterviewResult,
  updateInterviewInput,
};
