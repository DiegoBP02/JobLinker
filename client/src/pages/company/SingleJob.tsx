import Wrapper from "../../assets/wrappers/SingleJob";
import GetApplicants from "../../components/GetApplicants";
import SingleJobInfo from "../../components/SingleJobInfo";

const SingleJob = () => {
  return (
    <Wrapper>
      <SingleJobInfo />
      <GetApplicants />
    </Wrapper>
  );
};

export default SingleJob;
