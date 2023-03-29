import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from "react-icons/fa";
import { BsLightningCharge } from "react-icons/bs";
import { Link } from "react-router-dom";
import { ApplicationProps, useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/Application";
import JobInfo from "./JobInfo";
import formatDate from "../utils/formatDate";

const Application: React.FC<ApplicationProps> = (application) => {
  const { deleteApplication } = useAppContext();
  const { job, createdAt, status, _id } = application;

  const { position, company, location, type } = job;

  let date = formatDate(createdAt);

  return (
    <Wrapper>
      <header>
        <div className="main-icon">{position.charAt(0)}</div>
        <div className="info">
          <Link to={`/single-job/${job._id}`}>
            <h5>{position}</h5>
          </Link>
          <p>{company}</p>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <JobInfo icon={<FaBriefcase />} text={type} />
          <JobInfo icon={<FaLocationArrow />} text={location} />
          <JobInfo icon={<FaCalendarAlt />} text={date} />
          <JobInfo icon={<BsLightningCharge />} text={status} />
        </div>
        <footer>
          <div className="actions">
            <span>
              <button
                type="button"
                className="btn delete-btn"
                onClick={() => deleteApplication(_id)}
              >
                Delete
              </button>
            </span>
          </div>
        </footer>
      </div>
    </Wrapper>
  );
};
export default Application;
