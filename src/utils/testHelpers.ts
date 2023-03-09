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

function getTokenFromResponse(response: any) {
  const token = response.get("Set-Cookie").toString();
  return token.split("token=")[1].split(";")[0];
}

async function requestWithAuth(
  app: any,
  method: any,
  path: any,
  token: any,
  data: any
) {
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
}

async function loginUser(app: any) {
  const user = await supertest(app)
    .post(`/api/v1/auth/login`)
    .send(registerHelper(1).loginInput);
  expect(user.get("Set-Cookie")).toBeDefined();
  return user;
}

async function createJobAndGetId(app: any, token: any, createJobInput: any) {
  const job = await requestWithAuth(
    app,
    "post",
    `/api/v1/jobs`,
    token,
    createJobInput
  );
  return job.body.job._id;
}

export {
  registerHelper,
  getTokenFromResponse,
  requestWithAuth,
  createJobInput,
  createJobResult,
  loginUser,
  createJobAndGetId,
};
