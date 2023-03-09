import mongoose from "mongoose";
import supertest from "supertest";
import createServer from "../utils/createServer";
import { MongoMemoryServer } from "mongodb-memory-server";
import { registerHelper } from "../utils/testHelpers";

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
      const user = await supertest(app)
        .post(`${URL}/auth/login`)
        .send(registerHelper(1).loginInput)
        .expect(200);
      expect(user.get("Set-Cookie")).toBeDefined();
      const token = user.get("Set-Cookie").toString();
      const formattedToken = token.split("token=")[1].split(";")[0];

      const { status, body } = await supertest(app)
        .get(`${URL}/auth/getCurrentUser`)
        .set(
          "Cookie",
          `token=${formattedToken}; Path=/; HttpOnly; Secure; SameSite=none`
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
      const user = await supertest(app)
        .post(`${URL}/auth/login`)
        .send(registerHelper(1).loginInput)
        .expect(200);
      expect(user.get("Set-Cookie")).toBeDefined();
      const token = user.get("Set-Cookie").toString();
      const formattedToken = token.split("token=")[1].split(";")[0];

      const { status, body } = await supertest(app)
        .get(`${URL}/auth/logout`)
        .set(
          "Cookie",
          `token=${formattedToken}; Path=/; HttpOnly; Secure; SameSite=none`
        );
      expect(status).toBe(200);
      expect(body).toEqual({ msg: "User logged out!" });
    });
  });
});
