import mongoose from "mongoose";
import supertest from "supertest";
import createServer from "../utils/createServer";
import { MongoMemoryServer } from "mongodb-memory-server";

import {
  URL,
  generateUniqueNumber,
  createRandomId,
  createJobAndApplication,
} from "../utils/testHelpers/integrationHelper";
import {
  getTokenFromResponse,
  loginUserAndGetToken,
  registerCompany,
  registerHelper,
  requestWithAuth,
} from "../utils/testHelpers/authenticateHelper";
import {
  createJobAndGetId,
  createJobInput,
  createJobInput2,
  createJobResult,
} from "../utils/testHelpers/jobHelper";
import {
  singleJobApplicantsResult,
  updatedApplicationResult,
} from "../utils/testHelpers/applicationHelper";

const app = createServer();

describe("Job", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe("Create Job", () => {
    test("Fields missing 400", async () => {
      const user = await supertest(app)
        .post(`${URL}/auth/register`)
        .send(registerHelper(1).companyRegisterInput);
      const token = getTokenFromResponse(user);

      const { status, body } = await requestWithAuth(
        app,
        "post",
        `${URL}/jobs`,
        token,
        { position: "randomPosition" }
      );

      expect(status).toBe(400);
      expect(body).toEqual({ msg: "Please provide all values!" });
    });

    test("Successful 201", async () => {
      const token = await loginUserAndGetToken(app);

      const { status, body } = await requestWithAuth(
        app,
        "post",
        `${URL}/jobs`,
        token,
        createJobInput
      );

      expect(status).toBe(201);
      expect(body).toEqual(createJobResult);
      expect(mongoose.isValidObjectId(body.job.companyId)).toBeTruthy();
      expect(mongoose.isValidObjectId(body.job._id)).toBeTruthy();
    });
  });
  describe("Update Job", () => {
    test("Fields missing 400", async () => {
      const randomId = createRandomId();

      const token = await loginUserAndGetToken(app);

      const { status, body } = await requestWithAuth(
        app,
        "patch",
        `${URL}/jobs/${randomId}`,
        token
      );

      expect(status).toBe(400);
      expect(body).toEqual({ msg: "Please provide at least one field!" });
    });
    test("No job found 404", async () => {
      const randomId = createRandomId();
      const token = await loginUserAndGetToken(app);

      const { status, body } = await requestWithAuth(
        app,
        "patch",
        `${URL}/jobs/${randomId}`,
        token,
        { position: "randomPosition" }
      );

      expect(status).toBe(404);
      expect(body).toEqual({ msg: `No job found with id '${randomId}'!` });
    });
    test("Successful 200", async () => {
      const token = await loginUserAndGetToken(app);

      const jobId = await createJobAndGetId(app, token, createJobInput);

      const { status, body } = await requestWithAuth(
        app,
        "patch",
        `${URL}/jobs/${jobId}`,
        token,
        { salary: 150000 }
      );

      const updatedJobResult = {
        ...createJobResult,
        job: {
          ...createJobResult.job,
          salary: 150000,
        },
      };

      expect(status).toBe(200);
      expect(body).toEqual(updatedJobResult);
    });
  });
  describe("Delete job", () => {
    test("No job found 404", async () => {
      const randomId = createRandomId();
      const token = await loginUserAndGetToken(app);

      const { status, body } = await requestWithAuth(
        app,
        "delete",
        `${URL}/jobs/${randomId}`,
        token
      );

      expect(status).toBe(404);
      expect(body).toEqual({ msg: `No job found with id '${randomId}'!` });
    });
    test("Successful 200", async () => {
      const token = await loginUserAndGetToken(app);

      const { applicationId, jobId } = await createJobAndApplication(
        app,
        token
      );

      const { status, body } = await requestWithAuth(
        app,
        "delete",
        `${URL}/jobs/${jobId}`,
        token
      );

      const { status: applicationStatus, body: applicationBody } =
        await requestWithAuth(
          app,
          "get",
          `${URL}/application/${applicationId}`,
          token
        );

      expect(applicationStatus).toBe(404);
      expect(applicationBody).toEqual({
        msg: `No application with ${applicationId} id found!`,
      });
      expect(status).toBe(200);
      expect(body).toEqual({ msg: "Job deleted successfully!" });
    });
  });
  describe("Get Job", () => {
    test("No job found 404", async () => {
      const randomId = createRandomId();
      const token = await loginUserAndGetToken(app);

      await createJobAndGetId(app, token, createJobInput);

      const { status, body } = await requestWithAuth(
        app,
        "get",
        `${URL}/jobs/${randomId}`,
        token
      );

      expect(status).toBe(404);
      expect(body).toEqual({ msg: `No job found with id '${randomId}'!` });
    });
    test("Successful 200", async () => {
      const token = await loginUserAndGetToken(app);

      const jobId = await createJobAndGetId(app, token, createJobInput);

      const { status, body } = await requestWithAuth(
        app,
        "get",
        `${URL}/jobs/${jobId}`,
        token
      );

      expect(status).toBe(200);
      expect(body).toEqual(createJobResult);
    });
  });
  describe("Get All jobs", () => {
    test("Successful 200", async () => {
      const randomNumber = generateUniqueNumber();
      const company = await registerCompany(app, randomNumber);
      const token = getTokenFromResponse(company);

      await createJobAndGetId(app, token, createJobInput);
      await requestWithAuth(app, "post", `${URL}/jobs`, token, createJobInput2);

      const { status, body } = await requestWithAuth(
        app,
        "get",
        `${URL}/jobs`,
        token
      );

      expect(status).toBe(200);
      expect(body.totalCount).toBe(body.jobs.length);
      expect(body.numOfPages).toBe(body.numOfPages);
      expect(body.jobs).toBeDefined();
    });
  });
  test("Successful sorting 200", async () => {
    const randomNumber = generateUniqueNumber();
    const company = await registerCompany(app, randomNumber);
    const token = getTokenFromResponse(company);

    await createJobAndGetId(app, token, createJobInput);
    await requestWithAuth(app, "post", `${URL}/jobs`, token, createJobInput2);

    const jobSearch = await requestWithAuth(
      app,
      "get",
      `${URL}/jobs?search=frontend%20engineer`,
      token
    );

    expect(jobSearch.status).toBe(200);
    expect(jobSearch.body.jobs[0].position).toEqual("Frontend Engineer");

    const jobSort = await requestWithAuth(
      app,
      "get",
      `${URL}/jobs?sort=ascending`,
      token
    );

    expect(jobSort.status).toBe(200);
    expect(jobSort.body.jobs[0].salary).toBe(100000);

    const jobType = await requestWithAuth(
      app,
      "get",
      `${URL}/jobs?type=part-time`,
      token
    );

    expect(jobType.status).toBe(200);
    expect(jobType.body.jobs[0].type).toEqual("part-time");
  });
  describe("Get All Jobs By Company", () => {
    test("Successful 200", async () => {
      const randomNumber = generateUniqueNumber();
      const company = await registerCompany(app, randomNumber);
      const token = getTokenFromResponse(company);

      const job = await requestWithAuth(
        app,
        "post",
        `${URL}/jobs`,
        token,
        createJobInput
      );

      const companyId = job.body.job.companyId;

      const { status, body } = await requestWithAuth(
        app,
        "get",
        `${URL}/jobs/company/${companyId}`,
        token
      );

      expect(status).toBe(200);
      expect(body.totalCount).toBe(body.jobs.length);
    });
  });
  describe("Get Single Job Applicants", () => {
    test("No job found 404", async () => {
      const randomId = createRandomId();
      const token = await loginUserAndGetToken(app);

      const { status, body } = await requestWithAuth(
        app,
        "get",
        `${URL}/jobs/job/${randomId}`,
        token
      );

      expect(status).toBe(404);
      expect(body).toEqual({ msg: `No job with ${randomId} id found!` });
    });
    test("No application found 404", async () => {
      const token = await loginUserAndGetToken(app);
      const jobId = await createJobAndGetId(app, token, createJobInput);

      const { status, body } = await requestWithAuth(
        app,
        "get",
        `${URL}/jobs/job/${jobId}`,
        token
      );

      expect(status).toBe(404);
      expect(body).toEqual({
        msg: `No application for job with ${jobId} id found!`,
      });
    });
    test("Successful 200", async () => {
      const token = await loginUserAndGetToken(app);
      const { jobId } = await createJobAndApplication(app, token);

      const { status, body } = await requestWithAuth(
        app,
        "get",
        `${URL}/jobs/job/${jobId}`,
        token
      );

      expect(status).toBe(200);
      expect(body).toEqual(singleJobApplicantsResult);
    });
  });
  describe("Update User Application Status", () => {
    test("Status missing 400", async () => {
      const randomId = createRandomId();
      const token = await loginUserAndGetToken(app);

      const { status, body } = await requestWithAuth(
        app,
        "patch",
        `${URL}/jobs/user/${randomId}`,
        token,
        { status: "analysis" }
      );

      expect(status).toBe(404);
      expect(body).toEqual({
        msg: `No application with ${randomId} id found!`,
      });
    });
    test("Application not found 404", async () => {
      const randomId = createRandomId();
      const token = await loginUserAndGetToken(app);

      const { status, body } = await requestWithAuth(
        app,
        "patch",
        `${URL}/jobs/user/${randomId}`,
        token
      );

      expect(status).toBe(400);
      expect(body).toEqual({ msg: "Please provide status!" });
    });
  });
  test("Successful 200", async () => {
    const token = await loginUserAndGetToken(app);
    const { applicationId } = await createJobAndApplication(app, token);

    const { status, body } = await requestWithAuth(
      app,
      "patch",
      `${URL}/jobs/user/${applicationId}`,
      token,
      { status: "analyzed" }
    );

    expect(status).toBe(200);
    expect(body).toEqual({
      ...updatedApplicationResult,
      updatedApplication: {
        ...updatedApplicationResult.updatedApplication,
        status: "analyzed",
      },
    });
  });
});
