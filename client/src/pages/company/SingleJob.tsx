import { FaBriefcase, FaCalendarAlt, FaLocationArrow } from "react-icons/fa";
import { Link } from "react-router-dom";
import styled from "styled-components";
import JobInfo from "../../components/JobInfo";
import { useAppContext } from "../../context/appContext";

const SingleJob = () => {
  const { deleteJob } = useAppContext();

  // let date = moment(job.createdAt).format("MMM Do, YYYY");

  return (
    <Wrapper>
      <header>
        <div className="main-icon">C</div>
        <div className="info">
          <h5>Software Engineerr</h5>
          <p>Google</p>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <JobInfo icon={<FaLocationArrow />} text="San Andreas, GTA" />
          <JobInfo icon={<FaCalendarAlt />} text="04/04/2020" />
          <JobInfo icon={<FaBriefcase />} text="part-time" />
          <JobInfo icon={<FaBriefcase />} text="40000" />
          <JobInfo
            icon={<FaBriefcase />}
            text="We're seeking a frontend engineer to join our team and help develop engaging and user-friendly applications for our clients. This individual should have experience with modern frontend frameworks such as React or Angular, as well as proficiency in HTML, CSS, and JavaScript."
          />
        </div>
        <footer>
          <div className="actions">
            <button
              type="button"
              className="btn delete-btn"
              // onClick={() => deleteJob(job._id)}
            >
              Delete
            </button>
          </div>
        </footer>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  border-radius: var(--borderRadius);
  width: 100%;
  background: var(--white);
  padding: 3rem 2rem;
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

export default SingleJob;
