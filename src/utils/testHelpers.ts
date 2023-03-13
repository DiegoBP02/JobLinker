import mongoose from "mongoose";
import supertest from "supertest";

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

  return {
    registerInput,
    companyRegisterInput,
    loginInput,
    registerResult,
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

const getTokenFromResponse = (response: any) => {
  const token = response.get("Set-Cookie").toString();
  return token.split("token=")[1].split(";")[0];
};

const requestWithAuth = async (
  app: any,
  method: any,
  path: any,
  token: any,
  data?: any
) => {
  //@ts-ignore
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

const loginUser = async (app: any) => {
  const user = await supertest(app)
    .post(`/api/v1/auth/login`)
    .send(registerHelper(1).loginInput);
  expect(user.get("Set-Cookie")).toBeDefined();
  return user;
};

const createJobAndGetId = async (app: any, token: any, createJobInput: any) => {
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

const createApplication = async (app: any, token: any, jobId: any) => {
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

const createJobAndApplication = async (app: any, token: any) => {
  const jobId = await createJobAndGetId(app, token, createJobInput);
  const application = await createApplication(app, token, jobId);
  return { applicationId: application.body.application._id, jobId };
};

const loginUserAndGetToken = async (app: any) => {
  const user = await loginUser(app);
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
};
