import { useEffect } from "react";
import Wrapper from "../../assets/wrappers/JobsContainer";
import { Alert, Job, Loading } from "../../components";
import { useAppContext } from "../../context/appContext";

const CompanyJobs = () => {
  const { showAlert, getAllJobs, totalJobs, jobs, isLoading } = useAppContext();

  useEffect(() => {
    getAllJobs();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (jobs?.length === 0) {
    return (
      <Wrapper>
        <h5>No job found...</h5>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {showAlert && <Alert />}
      <h5>{totalJobs} jobs found</h5>
      <div className="jobs">
        {jobs?.map((job) => {
          return <Job {...job} key={job._id} />;
        })}
      </div>
      {/* {numOfPages > 1 && <PageBtnContainer />} */}
    </Wrapper>
  );
};
export default CompanyJobs;
