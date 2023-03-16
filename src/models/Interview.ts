import mongoose, { Document, Model } from "mongoose";
import { UserDocument } from "./User";
import { JobDocument } from "./Job";

type InterviewDocument = Document & {
  position: string;
  companyId: UserDocument["_id"];
  message: string;
  status: string;
  date: Date;
  user: UserDocument["_id"];
  job: JobDocument["_id"];
};

type InterviewInput = {
  position: InterviewDocument["position"];
  companyId: InterviewDocument["companyId"];
  message: InterviewDocument["message"];
  status: InterviewDocument["status"];
  date: InterviewDocument["date"];
  user: InterviewDocument["user"];
  job: InterviewDocument["job"];
};

const InterviewSchema: mongoose.Schema<InterviewDocument> = new mongoose.Schema(
  {
    position: {
      type: String,
      required: [true, "Please provide position!"],
    },
    companyId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: [true, "Please provide message!"],
      minlength: 15,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    date: {
      type: Date,
      required: [true, "Please provide date!"],
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

const Interview: Model<InterviewDocument> = mongoose.model<InterviewDocument>(
  "Interview",
  InterviewSchema
);

export { Interview, InterviewDocument, InterviewInput };
