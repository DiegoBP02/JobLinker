import styled from "styled-components";

const Wrapper = styled.section`
  border-radius: var(--borderRadius);
  width: 100%;
  background: var(--white);
  padding: 3rem 2rem 4rem;
  box-shadow: var(--shadow-2);
  header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--grey-100);
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    h5 {
      letter-spacing: 0;
    }
  }
  .main-icon {
    width: 60px;
    height: 60px;
    display: grid;
    place-items: center;
    background: var(--primary);
    border-radius: var(--borderRadius);
    font-size: 1.5rem;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--white);
    margin-right: 2rem;
  }
  .info {
    h5 {
      margin-bottom: 0.25rem;
    }
    p {
      margin: 0;
      text-transform: capitalize;
      color: var(--grey-400);
      letter-spacing: var(--letterSpacing);
    }
  }
  .content {
    padding: 1rem 1.5rem;
  }
  ul {
    list-style-type: circle;
  }
  .mainContent p {
    max-width: none;
    margin-top: 0.25rem;
  }
  .singleInfo {
    margin-top: 0.75rem;
  }
  .updateBtn {
    margin-top: 1rem;
  }
  footer {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    place-items: center;
  }
  .widthFix {
    width: fit-content;
  }
  .mt {
    margin-top: 1rem;
  }
`;

export default Wrapper;
