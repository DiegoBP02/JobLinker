import styled from "styled-components";

const Wrapper = styled.section`
  margin-top: 2rem;
  .headerContainer {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
  }
  h2 {
    text-transform: none;
  }
  & > h5 {
    font-weight: 700;
  }
  .applicants {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 2rem;
  }
  .applicants-btn {
    margin-bottom: 1.5rem;
  }
  @media (min-width: 992px) {
    .applicants {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
  }
`;

export default Wrapper;
