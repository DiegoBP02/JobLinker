import jwt from "jsonwebtoken";
import { TokenUser } from "./createTokenUser";
import { Response } from "express";

const createJWT = (payload: TokenUser): string => {
  const token = jwt.sign(payload, <string>process.env.JWT_SECRET, {
    expiresIn: <string>process.env.JWT_LIFETIME,
  });
  return token;
};

const isTokenValid = (token: string): TokenUser => {
  const decodedCode: any = jwt.verify(token, <string>process.env.JWT_SECRET);
  const { fullName, userId, role } = decodedCode;
  return { fullName, userId, role }; // omit iat and exp
};

const attachCookiesToResponse = (
  { res }: { res: Response },
  user: TokenUser
) => {
  const token = createJWT(user);
  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

export { createJWT, isTokenValid, attachCookiesToResponse };
