import { ApplicantProps } from "../context/appContext";
import Wrapper from "../assets/wrappers/Applicant";
import JobInfo from "./JobInfo";
import {
  FaBriefcase,
  FaCalendarAlt,
  FaGraduationCap,
  FaUniversity,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import formatDate from "../utils/formatDate";

const Applicant: React.FC<ApplicantProps> = (application) => {
  const { _id, createdAt, portfolio, education, status, user } = application;

  const date = formatDate(createdAt);

  return (
    <Wrapper>
      <header>
        <div className="main-icon">{user.fullName.charAt(0)}</div>
        <div className="info">
          <h5>{user.fullName}</h5>
          <a href={portfolio.url} target="_blank">
            {portfolio.title}
          </a>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <JobInfo icon={<FaCalendarAlt />} text={date} />
          <JobInfo icon={<FaGraduationCap />} text={education.degree} />
          <JobInfo icon={<FaUniversity />} text={education.instituition} />
          <JobInfo icon={<FaBriefcase />} text={status} />
        </div>
        <footer>
          <div className="actions">
            <Link
              type="button"
              className="btn info-btn"
              to={`/single-application/${application._id}`}
            >
              More info...
            </Link>
          </div>
        </footer>
      </div>
    </Wrapper>
  );
};

export default Applicant;
