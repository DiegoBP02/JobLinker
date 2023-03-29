import { IoBarChartSharp } from "react-icons/io5";
import { MdQueryStats } from "react-icons/md";
import { ImProfile } from "react-icons/im";

const companyLinks = [
  {
    id: 1,
    text: "dashboard",
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
    text: "add job",
    path: "add-job",
    icon: <ImProfile />,
  },
  {
    id: 4,
    text: "interviews",
    path: "company-interviews",
    icon: <ImProfile />,
  },
];

const userLinks = [
  {
    id: 1,
    text: "dashboard",
    path: "/",
    icon: <IoBarChartSharp />,
  },
  {
    id: 2,
    text: "all jobs",
    path: "/all-jobs",
    icon: <MdQueryStats />,
  },
  {
    id: 3,
    text: "all applications",
    path: "/all-applications",
    icon: <MdQueryStats />,
  },
  {
    id: 4,
    text: "all interviews",
    path: "/all-interviews",
    icon: <MdQueryStats />,
  },
];

export { companyLinks, userLinks };
