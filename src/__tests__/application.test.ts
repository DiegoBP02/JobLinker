import mongoose from "mongoose";
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
  registerUser,
  requestWithAuth,
} from "../utils/testHelpers/authenticateHelper";
import {
  createJobAndGetId,
  createJobInput,
} from "../utils/testHelpers/jobHelper";
import {
  createApplication,
  createApplicationInput,
  createApplicationResult,
} from "../utils/testHelpers/applicationHelper";

const app = createServer();

describe("Application", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe("Create Application", () => {
    test("Fields missing 400", async () => {
      const user = await registerUser(app, 1);
      const token = getTokenFromResponse(user);

      const { status, body } = await requestWithAuth(
        app,
        "post",
        `${URL}/application`,
        token
      );

      expect(status).toBe(400);
      expect(body).toEqual({ msg: "Please provide all values!" });
    });
    test("No job found 404", async () => {
      const randomId = createRandomId();
      const token = await loginUserAndGetToken(app);

      const { status, body } = await requestWithAuth(
        app,
        "post",
        `${URL}/application`,
        token,
        { ...createApplicationInput, job: randomId }
      );

      expect(status).toBe(404);
      expect(body).toEqual({ msg: `No job with ${randomId} id found!` });
    });
    test("Successful 201", async () => {
      const token = await loginUserAndGetToken(app);

      const jobId = await createJobAndGetId(app, token, createJobInput);

      const { status, body } = await requestWithAuth(
        app,
        "post",
        `${URL}/application`,
        token,
        { ...createApplicationInput, job: jobId }
      );

      expect(status).toBe(201);
      expect(body).toEqual({
        ...createApplicationResult,
        application: {
          ...createApplicationResult.application,
          job: jobId,
        },
      });
    });
    test("User already applied 401", async () => {
      const token = await loginUserAndGetToken(app);

      const jobId = await createJobAndGetId(app, token, createJobInput);

      await createApplication(app, token, jobId);
      const { status, body } = await createApplication(app, token, jobId);

      expect(status).toBe(401);
      expect(body).toEqual({ msg: "You can apply to a job only once!" });
    });
  });
  describe("Get Application", () => {
    test("No application found 404", async () => {
      const randomId = createRandomId();
      const token = await loginUserAndGetToken(app);

      const { status, body } = await requestWithAuth(
        app,
        "get",
        `${URL}/application/${randomId}`,
        token
      );

      expect(status).toBe(404);
      expect(body).toEqual({
        msg: `No application with ${randomId} id found!`,
      });
    }),
      test("Successful 200", async () => {
        const token = await loginUserAndGetToken(app);
        const { applicationId, jobId } = await createJobAndApplication(
          app,
          token
        );

        const { status, body } = await requestWithAuth(
          app,
          "get",
          `${URL}/application/${applicationId}`,
          token
        );

        expect(status).toBe(200);
        // testing populate
        expect(body).toEqual({
          ...createApplicationResult,
          application: {
            ...createApplicationResult.application,
            job: { ...createJobInput, _id: jobId, company: "test" },
          },
        });
      });
  });
  describe("Get All Applications", () => {
    test("No application found 404", async () => {
      const randomNumber = generateUniqueNumber();
      const user = await registerCompany(app, randomNumber);

      const token = getTokenFromResponse(user);

      const { status, body } = await requestWithAuth(
        app,
        "get",
        `${URL}/application`,
        token
      );

      expect(status).toBe(404);
      expect(body).toEqual({
        msg: `No application from user with ${user.body.tokenUser.userId} id found!`,
      });
    });
    test("Successful 200", async () => {
      const token = await loginUserAndGetToken(app);

      const { status, body } = await requestWithAuth(
        app,
        "get",
        `${URL}/application`,
        token
      );

      expect(status).toBe(200);
      expect(body.totalCount).toBe(body.applications.length);
    });
  });
  describe("Update Application", () => {
    test("Fields missing 400", async () => {
      const randomId = createRandomId();
      const token = await loginUserAndGetToken(app);

      const { status, body } = await requestWithAuth(
        app,
        "patch",
        `${URL}/application/${randomId}`,
        token
      );

      expect(status).toBe(400);
      expect(body).toEqual({ msg: "Please provide at least one field!" });
    });
    test("No application found 404", async () => {
      const randomId = createRandomId();
      const token = await loginUserAndGetToken(app);

      const { status, body } = await requestWithAuth(
        app,
        "patch",
        `${URL}/application/${randomId}`,
        token,
        { resume: "randomResume" }
      );

      expect(status).toBe(404);
      expect(body).toEqual({
        msg: `No application with ${randomId} id found!`,
      });
    });
    test("Successful 200", async () => {
      const token = await loginUserAndGetToken(app);
      const { applicationId } = await createJobAndApplication(app, token);

      const lorem =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

      const { status, body } = await requestWithAuth(
        app,
        "patch",
        `${URL}/application/${applicationId}`,
        token,
        { resume: lorem }
      );

      expect(status).toBe(200);
      expect(body.updatedApplication.resume).toEqual(lorem);
    });
  });
  describe("Delete Application", () => {
    test("No application found 404", async () => {
      const randomId = createRandomId();
      const randomNumber = generateUniqueNumber();
      const user = await registerCompany(app, randomNumber);

      const token = getTokenFromResponse(user);

      const { status, body } = await requestWithAuth(
        app,
        "delete",
        `${URL}/application/${randomId}`,
        token
      );

      expect(status).toBe(400);
      expect(body).toEqual({
        msg: `No application with ${randomId} id found!`,
      });
    });
    test("Successful 200", async () => {
      const token = await loginUserAndGetToken(app);
      const { applicationId } = await createJobAndApplication(app, token);

      const { status, body } = await requestWithAuth(
        app,
        "delete",
        `${URL}/application/${applicationId}`,
        token
      );

      expect(status).toBe(200);
      expect(body).toEqual({ msg: "Application deleted successfully!" });
    });
  });
});
