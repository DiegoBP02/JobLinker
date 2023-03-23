import { ApplicantProps } from "../context/appContext";
import styled from "styled-components";
import moment from "moment";
import JobInfo from "./JobInfo";
import {
  FaBriefcase,
  FaCalendarAlt,
  FaGraduationCap,
  FaUniversity,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Applicant: React.FC<ApplicantProps> = (application) => {
  const { _id, createdAt, portfolio, education, status, user } = application;

  let date = moment(createdAt).format("MMM Do, YYYY");

  return (
    <Wrapper>
      <header>
        <div className="main-icon">{user.fullName.charAt(0)}</div>
        <div className="info">
          <h5>{user.fullName}</h5>
          <a href={portfolio.url} target="_blank">
            {portfolio.title}
          </a>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <JobInfo icon={<FaCalendarAlt />} text={date} />
          <JobInfo icon={<FaGraduationCap />} text={education.degree} />
          <JobInfo icon={<FaUniversity />} text={education.instituition} />
          <JobInfo icon={<FaBriefcase />} text={status} />
        </div>
        <footer>
          <div className="actions">
            <Link
              type="button"
              className="btn info-btn"
              to={`/single-application/${application._id}`}
            >
              More info...
            </Link>
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

  footer {
    margin-top: 1rem;
  }
  .info-btn {
    background: var(--primary-400);
  }
  .actions {
    display: flex;
    justify-content: flex-end;
  }
  &:hover .actions {
    visibility: visible;
  }
`;

export default Applicant;
