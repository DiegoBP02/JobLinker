import { NextFunction, Request, Response } from "express";
import { isTokenValid } from "./jwt";
import { TokenUser } from "./createTokenUser";

const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: string = req.signedCookies.token;
  if (!token) {
    return res.status(401).json({ msg: "Authentication Invalid!" });
  }

  try {
    const { fullName, userId, role }: TokenUser = isTokenValid(token);
    // @ts-ignore
    req.user = { fullName, userId, role };
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Authentication Invalid!" });
  }
};

export { authenticateUser };
