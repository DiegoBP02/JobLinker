import Wrapper from "../../assets/wrappers/CompanyInterviews";
import { Alert, Interview, Loading } from "../../components";
import { useAppContext } from "../../context/appContext";
import { useEffect } from "react";

const CompanyInterviews = () => {
  const { showAlert, interviews, totalInterviews, getInterviews, isLoading } =
    useAppContext();

  useEffect(() => {
    getInterviews();
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
          return <Interview {...interview} key={interview._id} />;
        })}
      </div>
    </Wrapper>
  );
};

export default CompanyInterviews;
