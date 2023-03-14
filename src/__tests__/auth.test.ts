import mongoose from "mongoose";
import supertest from "supertest";
import createServer from "../utils/createServer";
import { MongoMemoryServer } from "mongodb-memory-server";
import {
  createJobAndApplication,
  createJobAndGetId,
  createJobInput,
  createRandomId,
  getAllUsersResult,
  getTokenFromResponse,
  loginUser,
  loginUserAndGetToken,
  registerHelper,
  requestWithAuth,
  createApplication,
} from "../utils/testHelpers";

const app = createServer();

const URL = "/api/v1";

describe("Auth", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe("Register", () => {
    test("Fields missing 400", async () => {
      const { status, body } = await supertest(app)
        .post(`${URL}/auth/register`)
        .send({ fullName: "randomName" });
      expect(status).toBe(400);
      expect(body).toEqual({ msg: "Please provide all values!" });
    });
    test("Role admin 401", async () => {
      const { status, body } = await supertest(app)
        .post(`${URL}/auth/register`)
        .send({
          fullName: "test",
          email: "test15@gmail.com",
          password: "secret",
          role: "admin",
        });
      expect(status).toBe(401);
      expect(body).toEqual({
        msg: "You aren't allowed to create an admin account!",
      });
    });
    test("Successful 201", async () => {
      const { status, body, header } = await supertest(app)
        .post(`${URL}/auth/register`)
        .send(registerHelper(1).registerInput);

      expect(status).toBe(201);
      expect(body).toEqual(registerHelper(1).registerResult);
      expect(mongoose.isValidObjectId(body.tokenUser.userId)).toBeTruthy();

      expect(header["set-cookie"]).toBeDefined();
    });
  });
  describe("Login", () => {
    test("Fields missing 400", async () => {
      const { status, body } = await supertest(app)
        .post(`${URL}/auth/login`)
        .send({ fullName: "randomName" });
      expect(status).toBe(400);
      expect(body).toEqual({ msg: "Please provide all values!" });
    });
    test("User doesn't exists 400", async () => {
      const { status, body } = await supertest(app)
        .post(`${URL}/auth/login`)
        .send({ email: "randomEmail@email.com", password: "randomPassword" });
      expect(status).toBe(400);
      expect(body).toEqual({ msg: "Invalid credentials!" });
    });
    test("Password invalid 401", async () => {
      const { status, body } = await supertest(app)
        .post(`${URL}/auth/login`)
        .send({
          ...registerHelper(1).registerInput,
          password: "invalidPassword",
        });
      expect(status).toBe(401);
      expect(body).toEqual({ msg: "Invalid credentials!" });
    });
    test("Successful 200", async () => {
      const { status, body, header } = await supertest(app)
        .post(`${URL}/auth/login`)
        .send(registerHelper(1).loginInput);
      expect(status).toBe(200);
      expect(body).toEqual(registerHelper(1).registerResult);
      expect(mongoose.isValidObjectId(body.tokenUser.userId)).toBeTruthy();

      expect(header["set-cookie"]).toBeDefined();
    });
  });
  describe("Get Current User", () => {
    test("No user 401", async () => {
      const { status, body } = await supertest(app).get(
        `${URL}/auth/getCurrentUser`
      );
      expect(status).toBe(401);
      expect(body).toEqual({ msg: "Authentication Invalid!" });
    });
    test("Successful 200", async () => {
      const token = await loginUserAndGetToken(app);

      const { status, body } = await requestWithAuth(
        app,
        "get",
        `${URL}/auth/getCurrentUser`,
        token
      );

      expect(status).toBe(200);
      expect(body).toEqual(registerHelper(1).registerResult);
    });
  });
  describe("Logout", () => {
    test("No user 401", async () => {
      const { status, body } = await supertest(app).get(`${URL}/auth/logout`);
      expect(status).toBe(401);
      expect(body).toEqual({ msg: "Authentication Invalid!" });
    });
    test("Successful 200", async () => {
      const token = await loginUserAndGetToken(app);

      const { status, body } = await requestWithAuth(
        app,
        "get",
        `${URL}/auth/logout`,
        token
      );

      expect(status).toBe(200);
      expect(body).toEqual({ msg: "User logged out!" });
    });
  });
  describe("Get All Users - ADMIN", () => {
    test("Successful 200", async () => {
      const token = await loginUserAndGetToken(app);
      await supertest(app)
        .post(`${URL}/auth/register`)
        .send(registerHelper(2).registerInput);

      const { status, body } = await requestWithAuth(
        app,
        "get",
        `${URL}/auth`,
        token
      );

      expect(status).toBe(200);
      expect(body).toEqual(getAllUsersResult);
    });
  });
  describe("Get Single User - ADMIN", () => {
    test("No user found 404", async () => {
      const randomId = createRandomId();
      const token = await loginUserAndGetToken(app);

      const { status, body } = await requestWithAuth(
        app,
        "get",
        `${URL}/auth/${randomId}`,
        token
      );

      expect(status).toBe(404);
      expect(body).toEqual({ msg: `No user with ${randomId} id!` });
    });
    test("Successful 200", async () => {
      const n = 3;
      const token = await loginUserAndGetToken(app);
      const user = await supertest(app)
        .post(`${URL}/auth/register`)
        .send(registerHelper(n).registerInput);

      const { status, body } = await requestWithAuth(
        app,
        "get",
        `${URL}/auth/${user.body.tokenUser.userId}`,
        token
      );

      expect(status).toBe(200);
      expect(body).toEqual(registerHelper(n).getSingleUserResult);
    });
  });
  describe("Delete User - ADMIN", () => {
    test("No user found 404", async () => {
      const randomId = createRandomId();
      const token = await loginUserAndGetToken(app);

      const { status, body } = await requestWithAuth(
        app,
        "delete",
        `${URL}/auth/${randomId}`,
        token
      );

      expect(status).toBe(404);
      expect(body).toEqual({ msg: `No user with ${randomId} id!` });
    });
    test("Successful 200", async () => {
      const companyN = 4;
      const userN = 5;
      // register as company
      const company = await supertest(app)
        .post(`${URL}/auth/register`)
        .send(registerHelper(companyN).companyRegisterInput);
      const companyToken = getTokenFromResponse(company);
      // create job
      const jobId = await createJobAndGetId(app, companyToken, createJobInput);
      // register user
      const user = await supertest(app)
        .post(`${URL}/auth/register`)
        .send(registerHelper(userN).registerInput);
      const userToken = getTokenFromResponse(user);
      // create application
      const application = await createApplication(app, userToken, jobId);

      const token = await loginUserAndGetToken(app);
      const { status, body } = await requestWithAuth(
        app,
        "delete",
        `${URL}/auth/${company.body.tokenUser.userId}`,
        token
      );

      const { status: jobStatus, body: jobBody } = await requestWithAuth(
        app,
        "get",
        `${URL}/jobs/${jobId}`,
        token
      );

      const { status: applicationStatus, body: applicationBody } =
        await requestWithAuth(
          app,
          "get",
          `${URL}/application/${application.body.application._id}`,
          token
        );

      expect(jobStatus).toBe(404);
      expect(jobBody).toEqual({ msg: `No job found with id '${jobId}'!` });

      expect(applicationStatus).toBe(404);
      expect(applicationBody).toEqual({
        msg: `No application with ${application.body.application._id} id found!`,
      });

      expect(status).toBe(200);
      expect(body).toEqual({ msg: "User deleted successfuly!" });
    });
  });
});
