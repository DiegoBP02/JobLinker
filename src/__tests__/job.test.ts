import mongoose from "mongoose";
import supertest from "supertest";
import createServer from "../utils/createServer";
import { MongoMemoryServer } from "mongodb-memory-server";
import {
  createJobAndGetId,
  createJobInput,
  createJobResult,
  createRandomId,
  getTokenFromResponse,
  loginUser,
  registerHelper,
  requestWithAuth,
  loginUserAndGetToken,
  createJobAndApplication,
  singleJobApplicantsResult,
  updatedApplicationResult,
} from "../utils/testHelpers";

const app = createServer();

const URL = "/api/v1";

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

      const user = await loginUser(app);
      const token = getTokenFromResponse(user);

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
      const user = await loginUser(app);
      const token = getTokenFromResponse(user);

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
      const user = await loginUser(app);
      const token = getTokenFromResponse(user);

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
      const user = await loginUser(app);
      const token = getTokenFromResponse(user);

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
      const user = await loginUser(app);
      const token = getTokenFromResponse(user);

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
      const user = await loginUser(app);
      const token = getTokenFromResponse(user);

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
      const user = await loginUser(app);
      const token = getTokenFromResponse(user);

      await createJobAndGetId(app, token, createJobInput);

      const { status, body } = await requestWithAuth(
        app,
        "get",
        `${URL}/jobs`,
        token
      );

      expect(status).toBe(200);
      expect(body.totalCount).toBe(5); // depends on the previous tests
    });
  });
  describe("Get All Jobs By Company", () => {
    test("Successful 200", async () => {
      const user = await loginUser(app);
      const token = getTokenFromResponse(user);

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
      expect(body.totalCount).toBe(6); // depends on the previous tests
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
