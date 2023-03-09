import mongoose, { Document, Model } from "mongoose";
import { UserDocument } from "./User";
import { JobDocument } from "./Job";

type ApplicationDocument = Document & {
  resume: string;
  experience: string;
  portfolio: string;
  certifications: string;
  user: UserDocument["_id"];
  job: JobDocument["_id"];
};

type ApplicationInput = {
  resume: ApplicationDocument["resume"];
  experience: ApplicationDocument["experience"];
  portfolio: ApplicationDocument["portfolio"];
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
      default: "No experience",
      minlength: 6,
      maxlength: 500,
    },
    portfolio: {
      type: String,
      required: [true, "Please provide portfolio!"],
    },
    certifications: {
      type: String,
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
