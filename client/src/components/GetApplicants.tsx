import { useParams } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/GetApplicants";
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
            <h5>{totalApplicants} applicants found</h5>
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

export default GetApplicants;
