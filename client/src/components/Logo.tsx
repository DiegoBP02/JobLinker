import logo from "../assets/images/logo/logo.svg";
import { Link } from "react-router-dom";

interface LogoProps {
  center?: boolean;
  noMargin?: boolean;
  widthFix?: boolean;
}

const Logo: React.FC<LogoProps> = ({ center, noMargin, widthFix }) => {
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
  return <img src={logo} alt="logo image" className="sideBar" />;
  // <Link className={className} to="/">
  {
    /* <h2>JobLinker</h2> */
  }
  {
    /* </Link> */
  }
};
export default Logo;
