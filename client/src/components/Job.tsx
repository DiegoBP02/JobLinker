import moment from "moment";
import {
  FaLocationArrow,
  FaBriefcase,
  FaCalendarAlt,
  FaDollarSign,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { JobProps, useAppContext, User } from "../context/appContext";
import Wrapper from "../assets/wrappers/Job";
import JobInfo from "./JobInfo";

const Job: React.FC<JobProps> = (job) => {
  const { deleteJob, user } = useAppContext();
  const { role } = user as User;

  const { company, position, location, createdAt, type, salary, _id } = job;

  let date = moment(createdAt).format("MMM Do, YYYY");

  return (
    <Wrapper>
      <header>
        <div className="main-icon">{position.charAt(0)}</div>
        <div className="info">
          <h5>{position}</h5>
          <p>{company}</p>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <JobInfo icon={<FaLocationArrow />} text={location} />
          <JobInfo icon={<FaCalendarAlt />} text={date} />
          <JobInfo icon={<FaBriefcase />} text={type} />
          <JobInfo icon={<FaDollarSign />} text={salary} />
        </div>
        <footer>
          <div className="actions">
            {role === "company" || role === "admin" ? (
              <span>
                <button
                  type="button"
                  className="btn delete-btn"
                  onClick={() => deleteJob(_id)}
                >
                  Delete
                </button>
              </span>
            ) : null}
            <span>
              <Link
                type="button"
                className="btn info-btn"
                to={`/single-job/${job._id}`}
              >
                More info...
              </Link>
            </span>
          </div>
        </footer>
      </div>
    </Wrapper>
  );
};
export default Job;
