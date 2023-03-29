import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { SiEnterprisedb } from "react-icons/si";
import { SlEnvolopeLetter } from "react-icons/sl";
import { MdDashboard, MdGroupWork } from "react-icons/md";
import { BiGroup } from "react-icons/bi";

const companyLinks = [
  {
    id: 1,
    text: "dashboard",
    path: "/",
    icon: <MdDashboard />,
  },
  {
    id: 2,
    text: "company jobs",
    path: "company-jobs",
    icon: <MdGroupWork />,
  },
  {
    id: 3,
    text: "add job",
    path: "add-job",
    icon: <AiOutlineAppstoreAdd />,
  },
  {
    id: 4,
    text: "interviews",
    path: "company-interviews",
    icon: <SiEnterprisedb />,
  },
];

const userLinks = [
  {
    id: 1,
    text: "dashboard",
    path: "/",
    icon: <MdDashboard />,
  },
  {
    id: 2,
    text: "all jobs",
    path: "/all-jobs",
    icon: <MdGroupWork />,
  },
  {
    id: 3,
    text: "all applications",
    path: "/all-applications",
    icon: <SlEnvolopeLetter />,
  },
  {
    id: 4,
    text: "all interviews",
    path: "/all-interviews",
    icon: <BiGroup />,
  },
];

export { companyLinks, userLinks };
