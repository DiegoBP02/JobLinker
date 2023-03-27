import Wrapper from "../../assets/wrappers/AddInterview";
import { Alert, FormRow, FormRowSelect } from "../../components";
import { useAppContext } from "../../context/appContext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type Params = {
  jobId: string;
  userId: string;
};

const CreateApplication = () => {
  const { jobId } = useParams<keyof Params>() as Params;

  const {
    showAlert,
    displayAlert,
    isLoading,
    clearValues,
    message,
    handleChange,
    clearAlert,
  } = useAppContext();

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // if (!) {
    //   displayAlert();
    //   return;
    // }

    // createApplication()
    clearAlert();
  };

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    handleChange(e.target.name, e.target.value);
  };

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

          <div className="btn-container">
            <button
              className="btn btn-block submit-btn"
              type="submit"
              onClick={handleSubmit}
            >
              "submit"
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

export default CreateApplication;
