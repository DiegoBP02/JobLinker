import mongoose, { Document, Model } from "mongoose";
import { JobDocument } from "./Job";
import { UserDocument } from "./User";

type ReviewDocument = Document & {
  rating: number;
  title: string;
  comment: string;
  user: UserDocument["_id"];
  job: JobDocument["_id"];
  createdAt: Date;
};

type ReviewInput = {
  rating: ReviewDocument["rating"];
  title: ReviewDocument["title"];
  comment: ReviewDocument["comment"];
  user: ReviewDocument["user"];
  job: ReviewDocument["job"];
};

const ReviewSchema: mongoose.Schema<ReviewDocument> = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, "Please provide rating!"],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: [true, "Please provide title!"],
      minlength: 5,
      maxlength: 60,
    },
    comment: {
      type: String,
      required: [true, "Please provide comment!"],
      minlength: 10,
      maxlength: 300,
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

ReviewSchema.index({ user: 1, job: 1 }, { unique: true });

ReviewSchema.statics.calculateAverageRating = async function (jobId) {
  const result = await this.aggregate([
    { $match: { job: jobId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);
  try {
    // @ts-ignore
    await this.model("Job").findOneAndUpdate(
      { _id: jobId },
      {
        averageRating: Math.ceil(result[0]?.averageRating || 0),
        numOfReviews: result[0]?.numOfReviews || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

ReviewSchema.post("save", async function () {
  // @ts-ignore
  await this.constructor.calculateAverageRating(this.job);
});

const Review: Model<ReviewDocument> = mongoose.model<ReviewDocument>(
  "Review",
  ReviewSchema
);

export { Review, ReviewDocument, ReviewInput };
