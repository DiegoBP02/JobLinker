import Wrapper from "../../assets/wrappers/CreateApplication";
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
    certifications,
    handleCertificationChange,
    handleAddCertification,
    handleRemoveCertification,
    resume,
    titleExperience,
    companyExperience,
    locationExperience,
    startDateExperience,
    endDateExperience,
    responsibilitiesExperience,
    titlePortfolio,
    urlPortfolio,
    degreeEducation,
    instituitionEducation,
    locationEducation,
    graduationEducation,
    createApplication,
  } = useAppContext();

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (
      !resume ||
      !titleExperience ||
      !companyExperience ||
      !locationExperience ||
      !startDateExperience ||
      !endDateExperience ||
      !responsibilitiesExperience ||
      !titlePortfolio ||
      !urlPortfolio ||
      !degreeEducation ||
      !instituitionEducation ||
      !locationEducation ||
      !graduationEducation
    ) {
      displayAlert();
      return;
    }

    createApplication(jobId);
    clearAlert();
  };

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    handleChange(e.target.name, e.target.value);
  };

  return (
    <Wrapper>
      <form className="form">
        {showAlert && <Alert />}
        {/* resume */}
        <section>
          <h4>Resume</h4>
          <textarea
            name="resume"
            value={resume}
            className="resume mb"
            onChange={handleInputChange}
          ></textarea>
        </section>
        <div className="form-center">
          {/* experience */}
          <section>
            <h4>Experience</h4>
            <FormRow
              type="text"
              labelText="title"
              name="titleExperience"
              value={titleExperience}
              handleChange={handleInputChange}
            />
            <FormRow
              type="text"
              labelText="company"
              name="companyExperience"
              value={companyExperience}
              handleChange={handleInputChange}
            />
            <FormRow
              type="text"
              labelText="location"
              name="locationExperience"
              value={locationExperience}
              handleChange={handleInputChange}
            />
            <div className="form-row">
              <label htmlFor="date" className="form-label">
                Start Date
              </label>
              <input
                type="date"
                name="startDateExperience"
                id="date"
                value={startDateExperience}
                className="form-input dateInput"
                onChange={handleInputChange}
              ></input>
            </div>
            <div className="form-row">
              <label htmlFor="date" className="form-label">
                End Date
              </label>
              <input
                type="date"
                name="endDateExperience"
                id="date"
                value={endDateExperience}
                className="form-input dateInput"
                onChange={handleInputChange}
              ></input>
            </div>
            <FormRow
              type="text"
              labelText="responsabilities"
              name="responsibilitiesExperience"
              value={responsibilitiesExperience}
              handleChange={handleInputChange}
            />
          </section>
          <section>
            <div>
              <h4>Portfolio</h4>
              <FormRow
                type="text"
                labelText="title"
                name="titlePortfolio"
                value={titlePortfolio}
                handleChange={handleInputChange}
              />
              <FormRow
                type="text"
                labelText="url"
                name="urlPortfolio"
                value={urlPortfolio}
                handleChange={handleInputChange}
              />
            </div>
            <div>
              <h4>Certifications</h4>
              {certifications.map((certification, index) => (
                <div className="form-row">
                  <label htmlFor={`cert. ${index + 1}`} className="form-label">
                    {`cert. ${index + 1}`}
                  </label>
                  <p
                    onClick={() => handleRemoveCertification(index)}
                    style={{ color: "red", margin: 0, cursor: "pointer" }}
                  >
                    x
                  </p>
                  <input
                    type="text"
                    value={certification}
                    name={`certification ${index + 1}`}
                    onChange={(e) =>
                      handleCertificationChange(index, e.target.value)
                    }
                    className="form-input"
                  />
                </div>
              ))}
              {certifications.length < 5 && (
                <div className="addBtn">
                  <button
                    type="button"
                    className="btn mb"
                    onClick={handleAddCertification}
                  >
                    Add Certification
                  </button>
                </div>
              )}
            </div>
          </section>
          <section>
            <h4>Education</h4>
            <FormRow
              type="text"
              labelText="degree"
              name="degreeEducation"
              value={degreeEducation}
              handleChange={handleInputChange}
            />
            <FormRow
              type="text"
              labelText="instituition"
              name="instituitionEducation"
              value={instituitionEducation}
              handleChange={handleInputChange}
            />
            <FormRow
              type="text"
              labelText="location"
              name="locationEducation"
              value={locationEducation}
              handleChange={handleInputChange}
            />
            <div className="form-row">
              <label htmlFor="date" className="form-label">
                Graduating
              </label>
              <input
                type="date"
                name="graduationEducation"
                id="graduation"
                value={graduationEducation}
                className="form-input dateInput"
                onChange={handleInputChange}
              ></input>
            </div>
          </section>
        </div>
        <div className="btn-container mt">
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
      </form>
    </Wrapper>
  );
};

export default CreateApplication;
