import mongoose, { Document, Model } from "mongoose";
import { UserDocument } from "./User";

type JobDocument = Document & {
  position: string;
  company: UserDocument["fullName"];
  description: string;
  location: string;
  salary: number;
  type: string;
  companyId: UserDocument["_id"];
};

type JobInput = {
  position: JobDocument["position"];
  company: JobDocument["company"];
  description: JobDocument["description"];
  location: JobDocument["location"];
  salary: JobDocument["salary"];
  type: JobDocument["type"];
};

const JobSchema = new mongoose.Schema(
  {
    position: {
      type: String,
      required: [true, "Please provide position!"],
      minlength: 3,
      maxlength: 100,
    },
    company: {
      type: String,
      required: [true, "Please provide company!"],
    },
    description: {
      type: String,
      required: [true, "Please provide password!"],
      minlength: 6,
      maxlength: 500,
    },
    location: {
      type: String,
      required: [true, "Please provide location!"],
    },
    salary: {
      type: Number,
      required: [true, "Please provide salary!"],
    },
    type: {
      type: String,
      enum: ["full-time", "part-time", "remote", "internship"],
      required: [true, "Please provide type!"],
    },
    companyId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Job: Model<JobDocument> = mongoose.model<JobDocument>("Job", JobSchema);

export { Job, JobDocument, JobInput };
