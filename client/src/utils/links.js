import { IoBarChartSharp } from "react-icons/io5";
import { MdQueryStats } from "react-icons/md";
import { FaWpforms } from "react-icons/fa";
import { ImProfile } from "react-icons/im";

const links = [
  {
    id: 1,
    text: "add job",
    path: "/",
    icon: <IoBarChartSharp />,
  },
  {
    id: 2,
    text: "company jobs",
    path: "company-jobs",
    icon: <MdQueryStats />,
  },
  {
    id: 3,
    text: "interviews",
    path: "company-interviews",
    icon: <ImProfile />,
  },
];

export default links;
