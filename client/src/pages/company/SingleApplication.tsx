import { useParams } from "react-router-dom";
import styled from "styled-components";
import { ApplicantProps, useAppContext } from "../../context/appContext";

const SingleApplication = () => {
  const { id } = useParams();
  const { applicants } = useAppContext();
  const applicant = applicants?.find(
    (applicant) => applicant._id === id
  ) as ApplicantProps;
  const {
    resume,
    experience,
    portfolio,
    certifications,
    education,
    status,
    job,
    user,
  } = applicant;

  return (
    <Wrapper>
      <header>
        <div className="main-icon">{user.fullName.charAt(0)}</div>
        <div className="info">
          <h5>{user.fullName}</h5>
          <p>{user.email}</p>
        </div>
      </header>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  border-radius: var(--borderRadius);
  width: 100%;
  background: var(--white);
  padding: 3rem 2rem 4rem;
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
`;

export default SingleApplication;
