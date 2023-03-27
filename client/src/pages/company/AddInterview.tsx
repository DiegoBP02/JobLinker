import styled from "styled-components";
import { Alert, FormRow, FormRowSelect } from "../../components";
import { useAppContext } from "../../context/appContext";
import { useEffect, useState } from "react";
import GetApplicants from "../../components/GetApplicants";
import { useParams } from "react-router-dom";

type Params = {
  jobId: string;
  userId: string;
};

const AddInterview = () => {
  const { jobId, userId } = useParams<keyof Params>() as Params;

  const {
    showAlert,
    displayAlert,
    isLoading,
    clearValues,
    getJobs,
    message,
    date,
    time,
    handleChange,
    createInterview,
    clearAlert,
    isEditingInterview,
    editInterview,
  } = useAppContext();

  const arr = [];
  for (let i = 6; i <= 18; i++) {
    arr.push(i);
  }

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!message || !date) {
      displayAlert();
      return;
    }

    if (isEditingInterview) {
      editInterview();
      return;
    }

    createInterview(userId, jobId);
    clearAlert();
  };

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    handleChange(e.target.name, e.target.value);
  };

  useEffect(() => {
    getJobs();
    clearValues();
  }, []);

  return (
    <Wrapper>
      <form className="form">
        {showAlert && <Alert />}

        <div className="form-center">
          {/* message */}
          <FormRow
            type="text"
            name="message"
            value={message}
            handleChange={handleInputChange}
          />

          {/* date */}
          <div className="form-row">
            <label htmlFor="date" className="form-label">
              date
            </label>
            <input
              type="date"
              name="date"
              id="date"
              value={date}
              className="form-input dateInput"
              onChange={handleInputChange}
            ></input>
          </div>
          <FormRowSelect
            name="time"
            value={time}
            handleChange={handleInputChange}
            list={arr}
          />

          <div className="btn-container">
            <button
              className="btn btn-block submit-btn"
              type="submit"
              onClick={handleSubmit}
            >
              {isEditingInterview ? "edit" : "submit"}
            </button>
            <button
              className="btn btn-block clear-btn"
              type="submit"
              disabled={isLoading}
              onClick={(e) => {
                handleSubmit(e);
                clearValues();
              }}
            >
              clear
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};

export default AddInterview;

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
    .btn-container {
      margin-top: 0;
    }
  }
  @media (min-width: 1120px) {
    .form-center {
      grid-template-columns: 1fr 1fr 1fr;
    }
    .form-center button {
      margin-top: 0;
    }
  }
  .dateInput:focus {
    outline: none;
    border: 1.5px solid #000;
  }
`;
