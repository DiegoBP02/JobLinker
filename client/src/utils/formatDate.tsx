import moment from "moment";

const formatDate = (date: string) => {
  const formattedDate = moment(date).format("MMM Do, YYYY");
  return formattedDate;
};
export default formatDate;
