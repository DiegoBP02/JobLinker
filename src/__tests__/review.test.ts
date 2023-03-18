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
import {
  createReview,
  createReviewInput,
  createReviewResult,
  getAllReviewsByJobResult,
  updatedReviewResult,
} from "../utils/testHelpers/reviewHelper";
import moment from "moment";
import { isReviewDateValid } from "../utils/dateHelper";

const app = createServer();

describe("Review", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });
  describe("Create review", () => {
    test("Fields missing 400", async () => {
      const user = await registerUser(app, 1);
      const token = getTokenFromResponse(user);

      const { status, body } = await requestWithAuth(
        app,
        "post",
        `${URL}/review`,
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
        `${URL}/review`,
        token,
        { ...createReviewInput, job: randomId }
      );

      expect(status).toBe(404);
      expect(body).toEqual({ msg: `No job with ${randomId} id found!` });
    });
    test("User hasn't applied 403", async () => {
      const token = await loginUserAndGetToken(app);
      const jobId = await createJobAndGetId(app, token, createJobInput);

      const { status, body } = await requestWithAuth(
        app,
        "post",
        `${URL}/review`,
        token,
        { ...createReviewInput, job: jobId }
      );

      expect(status).toBe(403);
      expect(body).toEqual({
        msg: " You can only review companies that you applied!",
      });
    });
    test("Successful 201", async () => {
      const token = await loginUserAndGetToken(app);
      const { jobId } = await createJobAndApplication(app, token);

      const { status, body } = await requestWithAuth(
        app,
        "post",
        `${URL}/review`,
        token,
        { ...createReviewInput, job: jobId }
      );

      expect(status).toBe(201);
      expect(body).toEqual(createReviewResult);
    });
    test("User already submitted 403", async () => {
      const token = await loginUserAndGetToken(app);
      const { jobId } = await createJobAndApplication(app, token);

      await createReview(app, token, jobId);
      const { status, body } = await requestWithAuth(
        app,
        "post",
        `${URL}/review`,
        token,
        { ...createReviewInput, job: jobId }
      );

      expect(status).toBe(403);
      expect(body).toEqual({ msg: "You can send only 1 review per job!" });
    });
  });

  describe("Get single review", () => {
    test("No review found 404", async () => {
      const randomId = createRandomId();
      const token = await loginUserAndGetToken(app);

      const { status, body } = await requestWithAuth(
        app,
        "get",
        `${URL}/review/${randomId}`,
        token
      );

      expect(status).toBe(404);
      expect(body).toEqual({ msg: `No review with ${randomId} id found!` });
    });
    test("Successful 200", async () => {
      const token = await loginUserAndGetToken(app);

      const { jobId } = await createJobAndApplication(app, token);
      const { reviewId } = await createReview(app, token, jobId);

      const { status, body } = await requestWithAuth(
        app,
        "get",
        `${URL}/review/${reviewId}`,
        token
      );

      expect(status).toBe(200);
      expect(body).toEqual(createReviewResult);
    });
  });
  describe("Get all reviews by job", () => {
    test("No review found 404", async () => {
      const randomId = createRandomId();
      const token = await loginUserAndGetToken(app);

      const { status, body } = await requestWithAuth(
        app,
        "get",
        `${URL}/review/job/${randomId}`,
        token
      );

      expect(status).toBe(404);
      expect(body).toEqual({
        msg: `No review from job with ${randomId} id found!`,
      });
    });
    test("Successful 200", async () => {
      const token = await loginUserAndGetToken(app);

      const { jobId } = await createJobAndApplication(app, token);
      await createReview(app, token, jobId);

      const { status, body } = await requestWithAuth(
        app,
        "get",
        `${URL}/review/job/${jobId}`,
        token
      );

      expect(status).toBe(200);
      expect(body).toEqual(getAllReviewsByJobResult);
    });
  });
  describe("Update review", () => {
    test("No review found 404", async () => {
      const randomId = createRandomId();
      const token = await loginUserAndGetToken(app);

      const { status, body } = await requestWithAuth(
        app,
        "patch",
        `${URL}/review/${randomId}`,
        token
      );

      expect(status).toBe(404);
      expect(body).toEqual({ msg: `No review found with ${randomId} id!` });
    });
    test("Fields missing 400", async () => {
      const token = await loginUserAndGetToken(app);

      const { jobId } = await createJobAndApplication(app, token);
      const { reviewId } = await createReview(app, token, jobId);

      const { status, body } = await requestWithAuth(
        app,
        "patch",
        `${URL}/review/${reviewId}`,
        token
      );

      expect(status).toBe(400);
      expect(body).toEqual({ msg: "Please provide at least one field!" });
    });
    test("Expired date false", () => {
      const date = moment().subtract(2, "days").toDate();

      const result = isReviewDateValid(date);

      expect(result).toBe(false);
    });
    test("Valid date true", () => {
      const date = moment().subtract(23, "hours").toDate();

      const result = isReviewDateValid(date);

      expect(result).toBe(true);
    });
    test("Updated review 200", async () => {
      const token = await loginUserAndGetToken(app);

      const { jobId } = await createJobAndApplication(app, token);
      const { reviewId } = await createReview(app, token, jobId);

      const { status, body } = await requestWithAuth(
        app,
        "patch",
        `${URL}/review/${reviewId}`,
        token,
        { rating: 3 }
      );

      expect(status).toBe(200);
      expect(body).toEqual({
        ...updatedReviewResult,
        updatedReview: { ...updatedReviewResult.updatedReview, rating: 3 },
      });
    });
  });
  describe("Delete review", () => {
    test("No review found 404", async () => {
      const randomId = createRandomId();
      const token = await loginUserAndGetToken(app);

      const { status, body } = await requestWithAuth(
        app,
        "delete",
        `${URL}/review/${randomId}`,
        token
      );

      expect(status).toBe(404);
      expect(body).toEqual({ msg: `No review found with ${randomId} id!` });
    });
    test("Successful 200", async () => {
      const token = await loginUserAndGetToken(app);

      const { jobId } = await createJobAndApplication(app, token);
      const { reviewId } = await createReview(app, token, jobId);

      const { status, body } = await requestWithAuth(
        app,
        "delete",
        `${URL}/review/${reviewId}`,
        token
      );

      expect(status).toBe(200);
      expect(body).toEqual({ msg: "Successful! Review deleted!" });
    });
  });
});
