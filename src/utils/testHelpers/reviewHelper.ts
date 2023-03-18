import { requestWithAuth } from "./authenticateHelper";
import { Express } from "express";

const createReviewInput = {
  rating: 5,
  title: "Great job vacancy!",
  comment:
    "I applied for a job at this company and I was impressed by the quality of the job description and the hiring process. It was clear and straightforward, and the company was very responsive to my application. Overall, a great experience!",
};

const createReviewResult = {
  review: {
    rating: expect.any(Number),
    title: "Great job vacancy!",
    comment:
      "I applied for a job at this company and I was impressed by the quality of the job description and the hiring process. It was clear and straightforward, and the company was very responsive to my application. Overall, a great experience!",
    user: expect.any(String),
    job: expect.any(String),
    _id: expect.any(String),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
    __v: expect.any(Number),
  },
};

const createReview = async (app: Express, token: string, jobId: string) => {
  const review = await requestWithAuth(app, "post", `/api/v1/review`, token, {
    ...createReviewInput,
    job: jobId,
  });

  return { reviewId: review.body.review._id };
};

const getAllReviewsByJobResult = {
  reviews: [
    {
      _id: expect.any(String),
      rating: 5,
      title: "Great job vacancy!",
      comment:
        "I applied for a job at this company and I was impressed by the quality of the job description and the hiring process. It was clear and straightforward, and the company was very responsive to my application. Overall, a great experience!",
      user: {
        _id: expect.any(String),
        fullName: "test",
      },
      job: {
        _id: expect.any(String),
        company: "test",
      },
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      __v: 0,
    },
  ],
  totalCount: 1,
};

const updatedReviewResult = {
  updatedReview: {
    _id: expect.any(String),
    rating: expect.any(Number),
    title: "Great job vacancy!",
    comment:
      "I applied for a job at this company and I was impressed by the quality of the job description and the hiring process. It was clear and straightforward, and the company was very responsive to my application. Overall, a great experience!",
    user: expect.any(String),
    job: expect.any(String),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
    __v: 0,
  },
};

export {
  createReviewInput,
  createReviewResult,
  createReview,
  getAllReviewsByJobResult,
  updatedReviewResult,
};
