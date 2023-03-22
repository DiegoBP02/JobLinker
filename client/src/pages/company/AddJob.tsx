import { FormRow, Alert, FormRowSelect } from "../../components";
import { useAppContext } from "../../context/appContext";
import Wrapper from "../../assets/wrappers/DashboardFormPage";

const AddJob = () => {
  const {
    showAlert,
    displayAlert,
    handleChange,
    position,
    description,
    location,
    salary,
    jobType,
    jobTypeOptions,
    createJob,
  } = useAppContext();

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!position || !description || !location || !salary || !jobType) {
      displayAlert();
      return;
    }
    // if (isEditing) {
    //   editJob();
    //   return;
    // }
    createJob();
  };

  const handleJobInput = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    handleChange(e.target.name, e.target.value);
  };

  return (
    <Wrapper>
      <form className="form">
        {/* <h3>{isEditing ? "edit job" : "add job"}</h3> */}
        {showAlert && <Alert />}

        <div className="form-center">
          {/* position */}
          <FormRow
            type="text"
            name="position"
            value={position}
            handleChange={handleJobInput}
          />
          {/* description */}
          <FormRow
            type="text"
            name="description"
            value={description}
            handleChange={handleJobInput}
          />
          {/* location */}
          <FormRow
            type="text"
            labelText="location"
            name="location"
            value={location}
            handleChange={handleJobInput}
          />
          {/* job type */}
          <FormRowSelect
            labelText="type"
            name="jobType"
            value={jobType}
            handleChange={handleJobInput}
            list={jobTypeOptions}
          />
          {/* salary*/}
          <FormRow
            type="number"
            labelText="salary"
            name="salary"
            value={salary}
            handleChange={handleJobInput}
          />
          <div className="btn-container">
            <button
              className="btn btn-block submit-btn"
              type="submit"
              onClick={handleSubmit}
            >
              submit
            </button>
            <button
              className="btn btn-block clear-btn"
              onClick={(e) => {
                e.preventDefault();
                // clearValues();
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
export default AddJob;
