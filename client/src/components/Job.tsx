import moment from "moment";
import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { JobProps, useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/Job";
import JobInfo from "./JobInfo";

const Job: React.FC<JobProps> = (job) => {
  const { deleteJob } = useAppContext();

  let date = moment(job.createdAt).format("MMM Do, YYYY");

  return (
    <Wrapper>
      <header>
        <div className="main-icon">{job.company.charAt(0)}</div>
        <div className="info">
          <h5>{job.position}</h5>
          <p>company</p>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <JobInfo icon={<FaLocationArrow />} text={job.location} />
          <JobInfo icon={<FaCalendarAlt />} text={date} />
          <JobInfo icon={<FaBriefcase />} text={job.type} />
        </div>
        <footer>
          <div className="actions">
            <span>
              <button
                type="button"
                className="btn delete-btn"
                onClick={() => deleteJob(job._id)}
              >
                Delete
              </button>
            </span>
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
