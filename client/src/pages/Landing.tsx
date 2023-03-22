import Wrapper from "../assets/wrappers/Landing";
import { Link, Navigate } from "react-router-dom";
import img from "../assets/images/landing/landing.svg";
import logo from "../assets/images/logo/logo.svg";
import { useAppContext } from "../context/appContext";

const Landing = () => {
  const { user } = useAppContext();
  return (
    <>
      {user && <Navigate to="/" />}
      <Wrapper>
        <nav className="nav">
          <img src={logo} alt="logo image" className="sideBar" />
        </nav>
        <div className="container page">
          <div className="info">
            <h1>JobLinker</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Neque
              aliquid voluptates, explicabo rem nesciunt eum consequuntur
              consectetur veritatis optio amet sunt.
            </p>
            <Link to="/register" className="btn btn-hero">
              Login / Register
            </Link>
          </div>
          <img src={img} alt="JobLinker landing" className="img" />
        </div>
      </Wrapper>
    </>
  );
};

export default Landing;
