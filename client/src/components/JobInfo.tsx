import { Moment } from "moment";
import React from "react";
import { IconType } from "react-icons/lib";
import Wrapper from "../assets/wrappers/JobInfo";

type JobInfoProps = {
  icon: JSX.Element;
  text: string;
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
