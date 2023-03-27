import moment from "moment";
import { BsLightningCharge } from "react-icons/bs";
import { TbHierarchy3 } from "react-icons/tb";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import Wrapper from "../assets/wrappers/Interview";
import { InterviewProps, useAppContext } from "../context/appContext";
import JobInfo from "./JobInfo";
import Loading from "./Loading";
import { Link } from "react-router-dom";

const Interview: React.FC<InterviewProps> = (interview) => {
  const { deleteInterview, isLoading, setEditInterview } = useAppContext();
  const { position, status, date, job, user, _id } = interview;

  const momentDate = moment(date);
  const formattedDate = momentDate.format("DD/MM/YYYY");
  const formattedTime = momentDate.format("hh:mm A");

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Wrapper>
      <header>
        <div className="main-icon">{position.charAt(0)}</div>
        <div className="info">
          <h5>{user.fullName}</h5>
          <p>{user.email}</p>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <JobInfo icon={<FaCalendarAlt />} text={formattedDate} />
          <JobInfo icon={<FaClock />} text={formattedTime} />
          <JobInfo icon={<BsLightningCharge />} text={status} />
          <JobInfo icon={<TbHierarchy3 />} text={job.position} />
        </div>
        <footer>
          <div className="actions">
            <Link
              to={`/add-interview/${job._id}/${user._id}`}
              onClick={() => setEditInterview(_id)}
              className="btn edit-btn"
            >
              Edit
            </Link>
            <button
              type="button"
              className="btn delete-btn"
              onClick={() => deleteInterview(_id)}
            >
              Delete
            </button>
          </div>
        </footer>
      </div>
    </Wrapper>
  );
};

export default Interview;
