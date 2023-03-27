import moment from "moment";
import { BsLightningCharge } from "react-icons/bs";
import { TbHierarchy3 } from "react-icons/tb";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import styled from "styled-components";
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

const Wrapper = styled.article`
  background: var(--white);
  border-radius: var(--borderRadius);
  display: grid;
  grid-template-rows: 1fr auto;
  box-shadow: var(--shadow-2);

  header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--grey-100);
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    h5 {
      letter-spacing: 0;
    }
  }
  .main-icon {
    width: 60px;
    height: 60px;
    display: grid;
    place-items: center;
    background: var(--primary);
    border-radius: var(--borderRadius);
    font-size: 1.5rem;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--white);
    margin-right: 2rem;
  }
  .info {
    h5 {
      margin-bottom: 0.25rem;
    }
    p {
      margin: 0;
      text-transform: capitalize;
      color: var(--grey-400);
      letter-spacing: var(--letterSpacing);
    }
  }
  .pending {
    background: #fcefc7;
    color: #e9b949;
  }
  .interview {
    background: #e0e8f9;
    color: #647acb;
  }
  .declined {
    color: #d66a6a;
    background: #ffeeee;
  }
  .content {
    padding: 1rem 1.5rem;
  }
  .content-center {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 0.5rem;
    @media (min-width: 576px) {
      grid-template-columns: 1fr 1fr;
    }
    @media (min-width: 992px) {
      grid-template-columns: 1fr;
    }
    @media (min-width: 1120px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  .status {
    border-radius: var(--borderRadius);
    text-transform: capitalize;
    letter-spacing: var(--letterSpacing);
    text-align: center;
    width: 100px;
    height: 30px;
  }
  footer {
    margin-top: 1rem;
  }
  .edit-btn,
  .delete-btn {
    letter-spacing: var(--letterSpacing);
    cursor: pointer;
    height: 30px;
  }
  .edit-btn {
    color: var(--green-dark);
    background: var(--green-light);
    margin-right: 0.5rem;
  }
  .delete-btn {
    color: var(--red-dark);
    background: var(--red-light);
  }
  .info-btn {
    background: var(--primary-400);
  }
  .actions {
    display: flex;
    justify-content: flex-start;
  }
  &:hover .actions {
    visibility: visible;
  }
`;
export default Interview;
