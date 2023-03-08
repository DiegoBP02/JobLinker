const registerHelper = (n: number) => {
  const registerInput = {
    fullName: `test`,
    email: `test${n}@email.com`,
    password: "secret",
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

  return { registerInput, loginInput, registerResult };
};

export default registerHelper;
