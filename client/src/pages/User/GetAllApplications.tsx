import { useEffect } from "react";
import Wrapper from "../../assets/wrappers/JobsContainer";
import { Alert, Application, Job, Loading } from "../../components";
import { useAppContext } from "../../context/appContext";

const GetAllApplications = () => {
  const {
    showAlert,
    getAllApplications,
    totalApplications,
    applications,
    isLoading,
  } = useAppContext();

  useEffect(() => {
    getAllApplications();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (applications?.length === 0) {
    return (
      <Wrapper>
        <h5>No application found...</h5>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {showAlert && <Alert />}
      <h5>{totalApplications} applications found</h5>
      <div className="jobs">
        {applications?.map((application) => {
          return <Application {...application} key={application._id} />;
        })}
      </div>
      {/* {numOfPages > 1 && <PageBtnContainer />} */}
    </Wrapper>
  );
};
export default GetAllApplications;
