import styled from "styled-components";

const Wrapper = styled.section`
  border-radius: var(--borderRadius);
  width: 100%;
  background: var(--white);
  padding: 3rem 2rem 4rem;
  box-shadow: var(--shadow-2);
  h3 {
    margin-top: 0;
  }
  .form {
    margin: 0;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
    max-width: 100%;
    width: 100%;
  }
  .form-row {
    margin-bottom: 0;
  }
  .form-center {
    display: grid;
    row-gap: 0.5rem;
  }
  .form-center button {
    align-self: end;
    height: 35px;
    margin-top: 1rem;
  }
  .btn-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 1rem;
    align-self: flex-end;
    margin-top: 0.5rem;
    button {
      height: 35px;
    }
  }
  .clear-btn {
    background: var(--grey-500);
  }
  .clear-btn:hover {
    background: var(--black);
  }
  @media (min-width: 992px) {
    .form-center {
      grid-template-columns: 1fr 1fr;
      align-items: center;
      column-gap: 1rem;
    }
    .form-center:first-child {
      grid-column: span 2;
    }
    .btn-container {
      margin-top: 0;
    }
  }
  @media (min-width: 1120px) {
    .form-center {
      grid-template-columns: 1fr 1fr;
    }
    .form-center button {
      margin-top: 0;
    }
    .form-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }
    .form-input {
      max-width: 20vw;
    }
  }
  .dateInput:focus {
    outline: none;
    border: 1.5px solid #000;
  }
  .form-label {
    margin-bottom: 0;
  }
  .addBtn {
    text-align: center;
  }
  .certification {
    display: flex;
    justify-content: space-between;
  }
  .mb {
    margin-bottom: 1rem;
  }
  .resume {
    display: block;
    resize: none;
    width: 100%;
    height: 5rem;
  }
  .mt {
    margin-top: 1rem;
  }
`;

export default Wrapper;
