import { Express } from "express";
import { requestWithAuth } from "./authenticateHelper";

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
  createApplication,
  createApplicationInput,
  createApplicationResult,
  updatedApplicationResult,
  singleJobApplicantsResult,
};
