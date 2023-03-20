import logo from "../assets/images/logo/logo.png";
import { Link } from "react-router-dom";
import { FunctionComponent } from "react";

interface LogoProps {
  center?: boolean;
  noMargin?: boolean;
  widthFix?: boolean;
}

const Logo: FunctionComponent<LogoProps> = ({ center, noMargin, widthFix }) => {
  let className = "nav";
  if (center) {
    className += " center";
  }
  if (noMargin) {
    className += " noMargin";
  }
  if (widthFix) {
    className += " widthFix";
  }
  return (
    <Link className={className} to="/">
      <img src={logo} alt="logo image" />
      <h2>JobLinker</h2>
    </Link>
  );
};
export default Logo;
