import moment from "moment";
import { FaBriefcase, FaGraduationCap, FaInfoCircle } from "react-icons/fa";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { CgWebsite } from "react-icons/cg";
import { BsFillLightningChargeFill, BsLightningCharge } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import JobInfo from "../../components/JobInfo";
import { ApplicantProps, useAppContext } from "../../context/appContext";
import { FormRowSelect, Loading } from "../../components";
import { useState } from "react";
import Wrapper from "../../assets/wrappers/SingleApplication";

const SingleApplication = () => {
  const { id } = useParams();
  const { applicants, updateStatus, isLoading } = useAppContext();
  const applicant = applicants?.find(
    (applicant) => applicant._id === id
  ) as ApplicantProps;
  const {
    experience,
    education,
    resume,
    portfolio,
    certifications,
    status,
    job,
    user,
    _id,
  } = applicant;
  const [newStatus, setNewStatus] = useState(status);

  const statusOptions = [
    "pending",
    "analysis",
    "analyzed",
    "approved",
    "rejected",
  ];

  const experienceStart = moment(experience.startDate).format("MMM Do, YYYY");
  const experienceEnd = moment(experience.endDate).format("MMM Do, YYYY");
  const gratuationDate = moment(education.graduation).format("MMM Do, YYYY");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewStatus(e.target.value);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Wrapper>
      <header>
        <div className="main-icon">{user.fullName.charAt(0)}</div>
        <div className="info">
          <h5>{user.fullName}</h5>
          <p>{user.email}</p>
        </div>
      </header>
      <div className="content">
        <section className="mainContent">
          <div className="singleInfo">
            <JobInfo icon={<FaBriefcase />} text="Experience" />
            <p>
              {experience.title} / {experience.company} / {experienceStart} -{" "}
              {experienceEnd}
              <ul>
                {experience.responsibilities.map((resp) => {
                  return <li>{resp}</li>;
                })}
              </ul>
            </p>
          </div>
          <div className="singleInfo">
            <JobInfo icon={<FaGraduationCap />} text="Education" />
            <p>
              {education.degree} / {education.instituition} / Graduated in{" "}
              {gratuationDate}
            </p>
          </div>
          <div className="singleInfo">
            <JobInfo icon={<AiOutlineUnorderedList />} text="Certifications" />
            <ul>
              {certifications?.map((cert) => {
                return <li>{cert}</li>;
              })}
            </ul>
          </div>
          <div className="singleInfo">
            <JobInfo icon={<CgWebsite />} text="Portfolio" />
            <a href={portfolio.url} target="_blank">
              {portfolio.title}
            </a>
          </div>
          <div className="singleInfo">
            {" "}
            <JobInfo icon={<FaInfoCircle />} text="Resume" />
            <p>{resume}</p>
          </div>
          <div className="singleInfo">
            {" "}
            <JobInfo icon={<BsLightningCharge />} text="Current Status" />
            {status}
          </div>
          <div className="singleInfo">
            <JobInfo
              icon={<BsFillLightningChargeFill />}
              text="Update Status"
            />
          </div>

          <FormRowSelect
            list={statusOptions}
            value={newStatus}
            name=""
            handleChange={handleChange}
          />
          <button
            className="btn updateBtn"
            onClick={() => updateStatus(_id, job, newStatus)}
          >
            Update
          </button>
        </section>
        <footer>
          <Link
            className="btn widthFix mt"
            to={`/add-interview/${job}/${user._id}`}
          >
            Create Interview
          </Link>
          <Link className="btn widthFix mt" to={`/single-job/${job}`}>
            Back to job
          </Link>
        </footer>
      </div>
    </Wrapper>
  );
};

export default SingleApplication;
