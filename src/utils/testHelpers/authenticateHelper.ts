import { Express } from "express";
import supertest, { Response } from "supertest";

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

const loginUserAndGetToken = async (app: Express) => {
  const user = await loginUser(app, 1);
  const token = getTokenFromResponse(user);
  return token;
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

export {
  registerHelper,
  getTokenFromResponse,
  loginUser,
  requestWithAuth,
  loginUserAndGetToken,
  registerCompany,
  registerUser,
};
