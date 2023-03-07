import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import isEmail from "validator/lib/isEmail";

type UserDocument = Document & {
  fullName: string;
  email: string;
  password: string;
  role: string;
  comparePassword(candidatePassword: string): Promise<Boolean>;
};

type UserInput = {
  fullName: UserDocument["fullName"];
  email: UserDocument["email"];
  password: UserDocument["password"];
  role: UserDocument["role"];
};

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please provide full name!"],
      minlength: 3,
      maxlength: 50,
      match: [
        /^[a-zA-Z]+(?:\s+[a-zA-Z]+)*$/,
        "Please provide a valid full name without numbers!",
      ],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please provide email!"],
      validate: {
        validator: (value: string) => {
          return isEmail(value);
        },
        message: "Please provide valid email!",
      },
    },
    password: {
      type: String,
      required: [true, "Please provide password!"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "company", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

const User: Model<UserDocument> = mongoose.model<UserDocument>(
  "User",
  UserSchema
);

export { User, UserDocument, UserInput };
