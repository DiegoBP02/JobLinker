import { useEffect } from "react";
import Wrapper from "../../assets/wrappers/JobsContainer";
import { Alert, Job, Loading } from "../../components";
import { useAppContext } from "../../context/appContext";

const CompanyJobs = () => {
  const { showAlert, getJobs, totalJobs, jobs, isLoading } = useAppContext();

  useEffect(() => {
    getJobs();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (jobs?.length === 0) {
    return <Wrapper>No jobs to display...</Wrapper>;
  }

  return (
    <Wrapper>
      {showAlert && <Alert />}
      <h5>
        {totalJobs} job{jobs?.length && "s"} found
      </h5>
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
