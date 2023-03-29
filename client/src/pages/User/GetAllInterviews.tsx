import Wrapper from "../../assets/wrappers/CompanyInterviews";
import { Alert, Interview, Loading, UserInterview } from "../../components";
import { useAppContext } from "../../context/appContext";
import { useEffect } from "react";

const GetAllInterviews = () => {
  const {
    showAlert,
    interviews,
    totalInterviews,
    getAllInterviews,
    isLoading,
  } = useAppContext();

  useEffect(() => {
    getAllInterviews();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (totalInterviews === 0) {
    return (
      <Wrapper>
        <h5>No interview found...</h5>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {showAlert && <Alert />}
      <h5>{interviews?.length} interviews found</h5>
      <div className="interviews">
        {interviews?.map((interview) => {
          return <UserInterview {...interview} key={interview._id} />;
        })}
      </div>
      {/* {numOfPages > 1 && <PageBtnContainer />} */}
    </Wrapper>
  );
};

export default GetAllInterviews;
