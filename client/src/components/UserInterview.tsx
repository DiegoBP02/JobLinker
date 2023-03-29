import moment from "moment";
import { BsLightningCharge } from "react-icons/bs";
import { TbHierarchy3 } from "react-icons/tb";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import Wrapper from "../assets/wrappers/Interview";
import { InterviewProps, useAppContext } from "../context/appContext";
import JobInfo from "./JobInfo";
import Loading from "./Loading";
import { Link } from "react-router-dom";
import formatDate from "../utils/formatDate";

const UserInterview: React.FC<InterviewProps> = (interview) => {
  const { isLoading, updateInterviewStatus } = useAppContext();
  const { position, status, date, job, _id, companyId } = interview;

  const formattedDate = formatDate(date);
  const formattedTime = moment(date).format("hh:mm A");

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Wrapper>
      <header>
        <div className="main-icon">{position.charAt(0)}</div>
        <div className="info">
          <h5>{position}</h5>
          <p>{companyId.fullName}</p>
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
          <div className="actions" style={{ justifyContent: "space-between" }}>
            {status === "pending" && (
              <span>
                <button
                  onClick={() => updateInterviewStatus(_id, "accepted")}
                  className="btn edit-btn"
                >
                  Accept
                </button>
                <button
                  type="button"
                  className="btn delete-btn"
                  onClick={() => updateInterviewStatus(_id, "rejected")}
                >
                  Decline
                </button>
              </span>
            )}
            <span>
              <Link
                type="button"
                className="btn info-btn"
                to={`/single-interview/${_id}`}
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

export default UserInterview;
