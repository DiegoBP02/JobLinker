import Wrapper from "../../assets/wrappers/AddInterview";
import { Alert, FormRow, FormRowSelect } from "../../components";
import { useAppContext } from "../../context/appContext";
import { useEffect, useState } from "react";
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
    getCompanyJobs,
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
    getCompanyJobs();
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
