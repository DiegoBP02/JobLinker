import mongoose, { Document, Model } from "mongoose";
import { UserDocument } from "./User";
import { JobDocument } from "./Job";

type ApplicationDocument = Document & {
  resume: string;
  experience: Experience;
  portfolio: Portfolio;
  certifications: string[];
  education: Education;
  status: string;
  user: UserDocument["_id"];
  job: JobDocument["_id"];
};

type ApplicationInput = {
  resume: ApplicationDocument["resume"];
  experience: Experience;
  portfolio: Portfolio;
  education: Education;
  certifications: ApplicationDocument["certifications"];
  job: ApplicationDocument["job"];
};

interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: Date;
  endDate: Date;
  responsibilities: string[];
}

interface Portfolio {
  title: string;
  url: string;
}

interface Education {
  degree: string;
  instituition: string;
  location: string;
  graduation: Date;
}

const ApplicationSchema: mongoose.Schema<ApplicationDocument> =
  new mongoose.Schema(
    {
      resume: {
        type: String,
        required: [true, "Please provide resume!"],
        minlength: 50,
        maxlength: 1000,
      },
      experience: {
        type: {
          title: { type: String, required: [true, "Please provide title!"] },
          company: {
            type: String,
            required: [true, "Please provide company!"],
          },
          location: {
            type: String,
            required: [true, "Please provide location!"],
          },
          startDate: {
            type: Date,
            required: [true, "Please provide startDate!"],
          },
          endDate: { type: Date, required: [true, "Please provide endDate!"] },
          responsibilities: [
            {
              type: String,
              required: [true, "Please provide responsibilities!"],
            },
          ],
        },
        minlength: 15,
        maxlength: 500,
      },
      portfolio: {
        type: {
          title: { type: String, required: [true, "Please provide title!"] },
          url: { type: String, required: [true, "Please provide url!"] },
        },
        minlength: 15,
      },
      certifications: {
        type: [{ type: String }],
        minlength: 15,
      },
      education: {
        type: {
          degree: { type: String, required: [true, "Please provide degree!"] },
          instituition: {
            type: String,
            required: [true, "Please provide instituition!"],
          },
          location: {
            type: String,
            required: [true, "Please provide location!"],
          },
          graduation: {
            type: Date,
            required: [true, "Please provide graduation!"],
          },
        },
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
