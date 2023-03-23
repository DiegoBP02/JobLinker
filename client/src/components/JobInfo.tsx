import React from "react";
import Wrapper from "../assets/wrappers/JobInfo";

type JobInfoProps = {
  icon: JSX.Element;
  text: string | number;
};

const JobInfo: React.FC<JobInfoProps> = ({ icon, text }) => {
  return (
    <Wrapper>
      <span className="icon">{icon}</span>
      <span className="text">{text}</span>
    </Wrapper>
  );
};
export default JobInfo;
