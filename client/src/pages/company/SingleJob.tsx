import styled from "styled-components";
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

const Wrapper = styled.section`
  border-radius: var(--borderRadius);
  width: 100%;
  background: var(--white);
  padding: 3rem 2rem;
  box-shadow: var(--shadow-2);
`;

export default SingleJob;
