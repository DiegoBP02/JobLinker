import moment from "moment";
import { BsLightningCharge } from "react-icons/bs";
import { TbHierarchy3 } from "react-icons/tb";
import { FaCalendarAlt, FaClock, FaInfoCircle } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { InterviewProps, useAppContext } from "../../context/appContext";
import Wrapper from "../../assets/wrappers/SingleInterview";
import JobInfo from "../../components/JobInfo";
import { useEffect } from "react";

const SingleInterview = () => {
  const { interviews, setCompanyId, updateInterviewStatus, getAllJobs } =
    useAppContext();
  const { id } = useParams();

  const interview = interviews?.find(
    (interview) => interview._id === id
  ) as InterviewProps;
  const { position, status, date, job, _id, companyId, message } = interview;

  const momentDate = moment(date);
  const formattedDate = momentDate.format("DD/MM/YYYY");
  const formattedTime = momentDate.format("hh:mm A");

  useEffect(() => {
    getAllJobs();
  }, []);

  return (
    <Wrapper>
      <header>
        <div className="main-icon">{position.charAt(0)}</div>
        <div className="info">
          <Link to={`/single-job/${job._id}`}>
            <h5>{position}</h5>
          </Link>
          <Link to="/company-jobs" onClick={() => setCompanyId(companyId._id)}>
            <p>{companyId.fullName}</p>
          </Link>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <JobInfo icon={<FaInfoCircle />} text={message} />
          <JobInfo icon={<FaCalendarAlt />} text={formattedDate} />
          <JobInfo icon={<FaClock />} text={formattedTime} />
          <JobInfo icon={<BsLightningCharge />} text={status} />
          <JobInfo icon={<TbHierarchy3 />} text={job.position} />
        </div>
        {status === "pending" && (
          <footer>
            <div
              className="actions"
              style={{ justifyContent: "space-between" }}
            >
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
            </div>
          </footer>
        )}
      </div>
    </Wrapper>
  );
};

export default SingleInterview;
