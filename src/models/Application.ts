import mongoose, { Document, Model } from "mongoose";
import { UserDocument } from "./User";
import { JobDocument } from "./Job";

type ApplicationDocument = Document & {
  resume: string;
  experience: string;
  portfolio: string;
  certifications: string;
  education: string;
  status: string;
  user: UserDocument["_id"];
  job: JobDocument["_id"];
};

type ApplicationInput = {
  resume: ApplicationDocument["resume"];
  experience: ApplicationDocument["experience"];
  portfolio: ApplicationDocument["portfolio"];
  education: ApplicationDocument["education"];
  certifications: ApplicationDocument["certifications"];
  job: ApplicationDocument["job"];
};

const ApplicationSchema = new mongoose.Schema(
  {
    resume: {
      type: String,
      required: [true, "Please provide resume!"],
      minlength: 50,
      maxlength: 1000,
    },
    experience: {
      type: String,
      minlength: 15,
      maxlength: 500,
    },
    portfolio: {
      minlength: 15,
      type: String,
    },
    certifications: {
      type: String,
      minlength: 15,
    },
    education: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "analysis", "analyzed", "approved", "rejected"],
      default: "pending",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    job: {
      type: mongoose.Types.ObjectId,
      ref: "Job",
      required: true,
    },
  },
  { timestamps: true }
);

const Application: Model<ApplicationDocument> =
  mongoose.model<ApplicationDocument>("Application", ApplicationSchema);

export { Application, ApplicationDocument, ApplicationInput };
