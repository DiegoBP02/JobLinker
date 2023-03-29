import moment from "moment";
import {
  FaBriefcase,
  FaCalendarAlt,
  FaLocationArrow,
  FaDollarSign,
  FaInfoCircle,
} from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import Wrapper from "../assets/wrappers/SingleJobInfo";
import JobInfo from "../components/JobInfo";
import { JobProps, useAppContext, User } from "../context/appContext";
import formatDate from "../utils/formatDate";

const SingleJobInfo = () => {
  const { deleteJob, jobs, user, setCompanyId } = useAppContext();
  const { role } = user as User;
  const { id } = useParams();

  const job = jobs?.find((job) => job._id === id) as JobProps;
  const {
    company,
    position,
    salary,
    description,
    location,
    createdAt,
    type,
    companyId,
  } = job;

  const date = formatDate(createdAt);

  return (
    <Wrapper>
      <header>
        <div className="main-icon">{position.charAt(0)}</div>
        <div className="info">
          <h5>{position}</h5>
          <Link to="/company-jobs" onClick={() => setCompanyId(companyId)}>
            {company}
          </Link>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <JobInfo icon={<FaLocationArrow />} text={location} />
          <JobInfo icon={<FaCalendarAlt />} text={date} />
          <JobInfo icon={<FaBriefcase />} text={type} />
          <JobInfo icon={<FaDollarSign />} text={salary} />
          <JobInfo icon={<FaInfoCircle />} text={description} />
        </div>
        <footer>
          {role === "company" || role === "admin" ? (
            <div className="actions">
              <Link
                type="button"
                className="btn delete-btn"
                onClick={() => deleteJob(id || "")}
                to="/"
              >
                Delete
              </Link>
            </div>
          ) : (
            <div className="actions">
              <Link
                type="button"
                className="btn"
                // onClick={}
                to={`/create-application/${job._id}`}
              >
                Create Application
              </Link>
            </div>
          )}
        </footer>
      </div>
    </Wrapper>
  );
};

export default SingleJobInfo;
