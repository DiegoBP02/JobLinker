import { Request, Response } from "express";
import { User, UserInput } from "../models/User";

const register = async (req: Request<{}, {}, UserInput>, res: Response) => {
  const { email, fullName, password, role } = req.body;

  const checkAdmin = role === "admin";
  if (checkAdmin) {
    return res
      .status(401)
      .json({ msg: "You aren't allowed to create an admin account!" });
  }

  const isFirstAccount = (await User.countDocuments({})) === 0;
  const newRole = isFirstAccount ? "admin" : role;

  const user = await User.create({ fullName, email, password, role: newRole });

  return res.status(201).json({ data: user });
};

const login = async (req: Request<{}, {}, UserInput>, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Please provide all values!" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ msg: "Invalid credentials!" });
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({ msg: "Invalid credentials!" });
  }

  return res.status(201).json({ data: user });
};

const logout = async (req: Request, res: Response) => {
  res.send("ok");
};

const getCurrentUser = async (req: Request, res: Response) => {
  res.send("ok");
};

export { register, login, logout, getCurrentUser };
