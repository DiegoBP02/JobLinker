import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useAppContext } from "../context/appContext";
import Applicant from "./Applicant";
import Loading from "./Loading";

const GetApplicants = () => {
  const {
    getApplicants,
    totalApplicants,
    applicants,
    showApplicants,
    toggleApplicants,
    isLoading,
  } = useAppContext();
  const { id } = useParams();

  return (
    <Wrapper>
      <header className="headerContainer">
        <button
          type="button"
          className="btn applicants-btn"
          onClick={() => {
            getApplicants(id || "");
            toggleApplicants();
          }}
        >
          {showApplicants ? "Hide Applicants" : "Get Applicants"}
        </button>
      </header>
      {/* {showAlert && <Alert />} */}
      {isLoading ? (
        <Loading />
      ) : (
        showApplicants && (
          <section>
            <h5>
              {totalApplicants} applicant{applicants?.length && "s"} found
            </h5>
            <div className="applicants">
              {applicants?.map((applicant) => {
                return <Applicant {...applicant} key={applicant._id} />;
              })}
            </div>
          </section>
        )
      )}
    </Wrapper>
  );
};

const Wrapper = styled.section`
  margin-top: 2rem;
  .headerContainer {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
  }
  h2 {
    text-transform: none;
  }
  & > h5 {
    font-weight: 700;
  }
  .applicants {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 2rem;
  }
  .applicants-btn {
    margin-bottom: 1.5rem;
  }
  @media (min-width: 992px) {
    .applicants {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
  }
`;
export default GetApplicants;
