import mongoose from "mongoose";
import createServer from "../utils/createServer";
import { MongoMemoryServer } from "mongodb-memory-server";
import {
  createJobAndGetId,
  createJobInput,
  getTokenFromResponse,
  loginUser,
  requestWithAuth,
  createApplication,
  loginUserAndGetToken,
  createRandomId,
  createInterview,
  createInterviewInput,
  createJobAndUserApplication,
  registerCompany,
  registerUser,
  createInterviewResult,
  createJobApplicationAndInterview,
  getInterviewResult,
  generateUniqueNumber,
  updateInterviewInput,
} from "../utils/testHelpers";
import moment from "moment";

const app = createServer();

const URL = "/api/v1";

describe("Interview", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe("Create Interview", () => {
    test("Fields missing 422", async () => {
      const user = await registerUser(app, 1);
      const token = getTokenFromResponse(user);

      const { status, body } = await requestWithAuth(
        app,
        "post",
        `${URL}/interview`,
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
        `${URL}/interview`,
        token,
        { ...createInterviewInput, job: randomId, user: randomId }
      );

      expect(status).toBe(404);
      expect(body).toEqual({ msg: `No job with ${randomId} id found!` });
    });
    test("No user found 404", async () => {
      const randomId = createRandomId();
      const token = await loginUserAndGetToken(app);
      const jobId = await createJobAndGetId(app, token, createJobInput);

      const { status, body } = await requestWithAuth(
        app,
        "post",
        `${URL}/interview`,
        token,
        { ...createInterviewInput, job: jobId, user: randomId }
      );

      expect(status).toBe(404);
      expect(body).toEqual({ msg: `No user with ${randomId} id found!` });
    });
    test("User hasn't applied 400", async () => {
      const randomNumber = generateUniqueNumber();
      const user = await registerUser(app, randomNumber);
      const token = await loginUserAndGetToken(app);
      const jobId = await createJobAndGetId(app, token, createJobInput);
      const userId = user.body.tokenUser.userId;

      const { status, body } = await requestWithAuth(
        app,
        "post",
        `${URL}/interview`,
        token,
        { ...createInterviewInput, job: jobId, user: userId }
      );

      expect(status).toBe(400);
      expect(body).toEqual({
        msg: `The user with ${userId} id hasn't applied to the job with ${jobId} id!`,
      });
    });
    test("If the user hasn't the role of user 400", async () => {
      const randomNumber = generateUniqueNumber();
      const user = await registerCompany(app, randomNumber);
      const token = await loginUserAndGetToken(app);
      const jobId = await createJobAndGetId(app, token, createJobInput);

      const { status, body } = await requestWithAuth(
        app,
        "post",
        `${URL}/interview`,
        token,
        {
          ...createInterviewInput,
          job: jobId,
          user: user.body.tokenUser.userId,
        }
      );

      expect(status).toBe(400);
      expect(body).toEqual({
        msg: "You can send only interview invites to users!",
      });
    });
    test("Interview already exists 400", async () => {
      const randomNumber = generateUniqueNumber();
      const token = await loginUserAndGetToken(app);
      const jobId = await createJobAndGetId(app, token, createJobInput);

      const user = await registerUser(app, randomNumber);
      const tokenUser = getTokenFromResponse(user);
      await createApplication(app, tokenUser, jobId);
      const userId = user.body.tokenUser.userId;

      const tokenAdmin = await loginUserAndGetToken(app);

      await requestWithAuth(app, "post", `${URL}/interview`, tokenAdmin, {
        ...createInterviewInput,
        job: jobId,
        user: userId,
      });
      const { status, body } = await requestWithAuth(
        app,
        "post",
        `${URL}/interview`,
        tokenAdmin,
        { ...createInterviewInput, job: jobId, user: userId }
      );

      expect(status).toBe(400);
      expect(body).toEqual({
        msg: "You can send only one interview invite per user!",
      });
    });
    test("Invalid date 400", async () => {
      const invalidDate = moment().subtract(5, "days").toISOString();
      const { jobId, userId } = await createJobAndUserApplication(app, 5);
      const tokenAdmin = await loginUserAndGetToken(app);

      const { status, body } = await requestWithAuth(
        app,
        "post",
        `${URL}/interview`,
        tokenAdmin,
        { ...createInterviewInput, job: jobId, user: userId, date: invalidDate }
      );

      expect(status).toBe(400);
      expect(body).toEqual({
        msg: "Please provide a valid date and time!",
      });
    });
    test("Date conflict 400", async () => {
      const randomNumber1 = generateUniqueNumber();
      const randomNumber2 = generateUniqueNumber();
      const tokenAdmin = await loginUserAndGetToken(app);
      const jobId1 = await createJobAndGetId(app, tokenAdmin, createJobInput);

      const company = await registerCompany(app, randomNumber1);
      const tokenCompany = getTokenFromResponse(company);
      const jobId2 = await createJobAndGetId(app, tokenCompany, createJobInput);

      const user = await registerUser(app, randomNumber2);
      const tokenUser = getTokenFromResponse(user);
      await createApplication(app, tokenUser, jobId1);
      await createApplication(app, tokenUser, jobId2);
      const userId = user.body.tokenUser.userId;

      const loginCompany = await loginUser(app, randomNumber1);
      const newTokenCompany = getTokenFromResponse(loginCompany);
      await createInterview(app, newTokenCompany, jobId2, userId);

      const loginTokenAdmin = await loginUserAndGetToken(app);
      const { status, body } = await requestWithAuth(
        app,
        "post",
        `${URL}/interview`,
        loginTokenAdmin,
        { ...createInterviewInput, job: jobId1, user: userId }
      );

      expect(status).toBe(400);
      expect(body).toEqual({
        msg: "An interview for this user has already been scheduled for this day!",
      });
    });
    test("Successful 201", async () => {
      const randomNumber = generateUniqueNumber();
      const tokenAdmin = await loginUserAndGetToken(app);
      const jobId = await createJobAndGetId(app, tokenAdmin, createJobInput);

      const user = await registerUser(app, randomNumber);
      const tokenUser = getTokenFromResponse(user);
      await createApplication(app, tokenUser, jobId);
      const userId = user.body.tokenUser.userId;

      const loginTokenAdmin = await loginUserAndGetToken(app);
      const { status, body } = await requestWithAuth(
        app,
        "post",
        `${URL}/interview`,
        loginTokenAdmin,
        { ...createInterviewInput, job: jobId, user: userId }
      );

      expect(status).toBe(201);
      expect(body).toEqual(createInterviewResult);
    });
  });
  describe("Get interview", () => {
    test("No interview found 404", async () => {
      const randomId = createRandomId();
      const tokenAdmin = await loginUserAndGetToken(app);

      const { status, body } = await requestWithAuth(
        app,
        "get",
        `${URL}/interview/${randomId}`,
        tokenAdmin
      );

      expect(status).toBe(404);
      expect(body).toEqual({ msg: `No interview found with ${randomId} id!` });
    });
    test("Successful 200", async () => {
      const { interviewId } = await createJobApplicationAndInterview(app);
      const token = await loginUserAndGetToken(app);

      const { status, body } = await requestWithAuth(
        app,
        "get",
        `${URL}/interview/${interviewId}`,
        token
      );

      expect(status).toBe(200);
      expect(body).toEqual(getInterviewResult);
    });
  });
  describe("Get all interviews", () => {
    test("No interview found 404", async () => {
      const token = await loginUserAndGetToken(app);

      const { status, body } = await requestWithAuth(
        app,
        "get",
        `${URL}/interview`,
        token
      );

      expect(status).toBe(404);
      expect(body).toEqual({ msg: `No interview found!` });
    });
    test("Successful 200", async () => {
      const randomNumber = generateUniqueNumber();

      const token = await loginUserAndGetToken(app);
      const jobId = await createJobAndGetId(app, token, createJobInput);

      const user = await registerUser(app, randomNumber);
      const tokenUser = getTokenFromResponse(user);
      await createApplication(app, tokenUser, jobId);
      const userId = user.body.tokenUser.userId;

      const tokenAdmin = await loginUserAndGetToken(app);
      await createInterview(app, tokenAdmin, jobId, userId);

      const userLogin = await loginUser(app, randomNumber);
      const userToken = getTokenFromResponse(userLogin);

      const { status, body } = await requestWithAuth(
        app,
        "get",
        `${URL}/interview`,
        userToken
      );

      expect(status).toBe(200);
      expect(body.interviews).toEqual([getInterviewResult.interview]);
      expect(body.totalCount).toBe(body.interviews.length);
    });
  });
  describe("Get all company interviews", () => {
    test("No interview found 404", async () => {
      const randomNumber = generateUniqueNumber();

      const company = await registerCompany(app, randomNumber);
      const token = getTokenFromResponse(company);

      const { status, body } = await requestWithAuth(
        app,
        "get",
        `${URL}/interview/company`,
        token
      );

      expect(status).toBe(404);
      expect(body).toEqual({ msg: `No interview found!` });
    });
    test("Successful 200", async () => {
      await createJobApplicationAndInterview(app);
      const token = await loginUserAndGetToken(app);

      const { status, body } = await requestWithAuth(
        app,
        "get",
        `${URL}/interview/company`,
        token
      );

      expect(status).toBe(200);
      expect(body.totalCount).toBe(body.interviews.length);
    });
  });
  describe("Update interview", () => {
    test("Fields missing 400", async () => {
      const randomId = createRandomId();
      const token = await loginUserAndGetToken(app);

      const { status, body } = await requestWithAuth(
        app,
        "patch",
        `${URL}/interview/${randomId}`,
        token
      );

      expect(status).toBe(400);
      expect(body).toEqual({ msg: "Please provide a value!" });
    });
    test("No interview found 404", async () => {
      const randomId = createRandomId();
      const token = await loginUserAndGetToken(app);

      const { status, body } = await requestWithAuth(
        app,
        "patch",
        `${URL}/interview/${randomId}`,
        token,
        updateInterviewInput
      );

      expect(status).toBe(404);
      expect(body).toEqual({ msg: `No interview found with ${randomId} id!` });
    });
    test("Successful 200", async () => {
      const { interviewId } = await createJobApplicationAndInterview(app);

      const token = await loginUserAndGetToken(app);

      const { status, body } = await requestWithAuth(
        app,
        "patch",
        `${URL}/interview/${interviewId}`,
        token,
        updateInterviewInput
      );

      expect(status).toBe(200);
      expect(body.updatedInterview.date).toEqual(updateInterviewInput.date);
    });
  });
  describe("Update interview status", () => {
    test("Status field missing 400", async () => {
      const randomId = createRandomId();
      const randomNumber = generateUniqueNumber();

      const user = await registerUser(app, randomNumber);
      const token = getTokenFromResponse(user);

      const { status, body } = await requestWithAuth(
        app,
        "patch",
        `${URL}/interview/status/${randomId}`,
        token
      );

      expect(status).toBe(400);
      expect(body).toEqual({ msg: "Please provide status!" });
    });
    test("No interview found 404", async () => {
      const randomId = createRandomId();
      const randomNumber = generateUniqueNumber();

      const user = await registerUser(app, randomNumber);
      const token = getTokenFromResponse(user);

      const { status, body } = await requestWithAuth(
        app,
        "patch",
        `${URL}/interview/status/${randomId}`,
        token,
        { status: "accepted" }
      );

      expect(status).toBe(404);
      expect(body).toEqual({ msg: `No interview found with ${randomId} id!` });
    });
    test("Successful 200", async () => {
      const { interviewId, randomNumber } =
        await createJobApplicationAndInterview(app);

      const user = await loginUser(app, randomNumber);
      const token = getTokenFromResponse(user);

      const newStatus = { status: "accepted" };

      const { status, body } = await requestWithAuth(
        app,
        "patch",
        `${URL}/interview/status/${interviewId}`,
        token,
        newStatus
      );

      expect(status).toBe(200);
      expect(body.updatedInterview.status).toEqual(newStatus.status);
    });
  });
  describe("Delete interview", () => {
    test("No interview found 404", async () => {
      const randomId = createRandomId();

      const token = await loginUserAndGetToken(app);

      const { status, body } = await requestWithAuth(
        app,
        "delete",
        `${URL}/interview/${randomId}`,
        token
      );

      expect(status).toBe(404);
      expect(body).toEqual({ msg: `No interview found with ${randomId} id!` });
    });
    test("Successful 200", async () => {
      const { interviewId } = await createJobApplicationAndInterview(app);

      const token = await loginUserAndGetToken(app);

      const { status, body } = await requestWithAuth(
        app,
        "delete",
        `${URL}/interview/${interviewId}`,
        token
      );

      expect(status).toBe(200);
      expect(body).toEqual({ msg: "Successful! Interview deleted!" });
    });
  });
});
