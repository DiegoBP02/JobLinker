import moment from "moment";
import {
  FaBriefcase,
  FaCalendarAlt,
  FaLocationArrow,
  FaDollarSign,
  FaInfoCircle,
} from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import JobInfo from "../components/JobInfo";
import { JobProps, useAppContext } from "../context/appContext";

const SingleJobInfo = () => {
  const { deleteJob, jobs } = useAppContext();
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
        <footer>
          <div className="actions">
            <Link
              type="button"
              className="btn delete-btn"
              onClick={() => deleteJob(id || "")}
              to="/company-jobs"
            >
              Delete
            </Link>
          </div>
        </footer>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
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
    & > :last-child {
      grid-column: span 2;
      align-items: baseline;
    }
  }

  footer {
    margin-top: 1rem;
  }
  .delete-btn {
    letter-spacing: var(--letterSpacing);
    cursor: pointer;
    height: 30px;
    color: var(--red-dark);
    background: var(--red-light);
  }
  .actions {
    display: flex;
    justify-content: center;
  }
  &:hover .actions {
    visibility: visible;
  }
`;

export default SingleJobInfo;
