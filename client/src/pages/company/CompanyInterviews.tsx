import styled from "styled-components";
import { Alert, Interview } from "../../components";
import { useAppContext } from "../../context/appContext";
import { useEffect } from "react";

const CompanyInterviews = () => {
  const { showAlert, interviews, totalInterviews, getInterviews } =
    useAppContext();

  useEffect(() => {
    getInterviews();
  }, []);

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
      {/* {numOfPages > 1 && <PageBtnContainer />} */}
    </Wrapper>
  );
};

const Wrapper = styled.section`
  margin-top: 4rem;
  h2 {
    text-transform: none;
  }
  & > h5 {
    font-weight: 700;
  }
  .interviews {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 2rem;
  }
  @media (min-width: 992px) {
    .interviews {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
  }
`;
export default CompanyInterviews;
