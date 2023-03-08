import { UserDocument } from "../models/User";

export type TokenUser = {
  fullName: string;
  userId: string;
  role: string;
};

const createTokenUser = (user: UserDocument): TokenUser => {
  return {
    fullName: user.fullName,
    userId: user._id,
    role: user.role,
  };
};

export default createTokenUser;
