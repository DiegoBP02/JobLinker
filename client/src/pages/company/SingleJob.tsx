import Wrapper from "../../assets/wrappers/SingleJob";
import GetApplicants from "../../components/GetApplicants";
import SingleJobInfo from "../../components/SingleJobInfo";
import { useAppContext, User } from "../../context/appContext";

const SingleJob = () => {
  const { user } = useAppContext();
  const { role } = user as User;

  return (
    <Wrapper>
      <SingleJobInfo />
      {role === "company" || role === "admin" ? <GetApplicants /> : null}
    </Wrapper>
  );
};

export default SingleJob;
