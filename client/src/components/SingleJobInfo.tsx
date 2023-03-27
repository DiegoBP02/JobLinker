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

const SingleJobInfo = () => {
  const { deleteJob, jobs, user } = useAppContext();
  const { role } = user as User;
  const { id } = useParams();

  const job = jobs?.find((job) => job._id === id) as JobProps;
  const { company, position, salary, description, location, createdAt, type } =
    job;

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
          <JobInfo icon={<FaInfoCircle />} text={description} />
        </div>
        {role === "company" || role === "admin" ? (
          <footer>
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
          </footer>
        ) : null}
      </div>
    </Wrapper>
  );
};

export default SingleJobInfo;
