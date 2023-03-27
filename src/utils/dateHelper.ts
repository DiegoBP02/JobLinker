import moment from "moment";
import { Interview } from "../models/Interview";

const isInterviewDateTimeValid = (date: Date): boolean => {
  console.log(date);
  const currentDate = moment().add(1, "day").toDate();

  if (moment(date).isBefore(moment(currentDate))) {
    return false;
  }

  const dateMoment = moment(date);
  const dateDayAM = dateMoment.clone().hours(6);
  const dateDayPM = dateMoment.clone().hours(18);
  if (
    moment(date).isBefore(moment(dateDayAM)) ||
    moment(date).isAfter(moment(dateDayPM))
  ) {
    return false;
  }

  return true;
};

const checkInterviewDateConflict = async (
  user: string,
  date: Date
): Promise<boolean> => {
  const dateMoment = moment(date);
  const dateDay = dateMoment.startOf("day");

  const checkDate = await Interview.find({
    user,
    date: {
      $gte: moment(dateDay).toDate(),
      $lte: moment(dateDay).endOf("day").toDate(),
    },
  });
  if (checkDate.length > 0) {
    return false;
  }
  return true;
};

const isReviewDateValid = (date: Date) => {
  const formattedDate = moment(date);
  const datePlusOneDay = moment(formattedDate).add(1, "days");
  const now = moment.now();

  if (moment(datePlusOneDay).isBefore(moment(now))) {
    return false;
  }

  return true;
};

export {
  isInterviewDateTimeValid,
  checkInterviewDateConflict,
  isReviewDateValid,
};
