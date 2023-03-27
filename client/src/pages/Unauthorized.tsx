import { Link } from "react-router-dom";
import img from "../assets/images/unauthorized/unauthorized.svg";
import Wrapper from "../assets/wrappers/Error";
import { useAppContext } from "../context/appContext";
import { useEffect } from "react";

const Unauthorized = () => {
  const { logoutUser } = useAppContext();

  useEffect(() => {
    logoutUser();
  }, []);

  return (
    <Wrapper className="full-page">
      <div>
        <img src={img} alt="not found" style={{ maxWidth: "450px" }} />
        <h2>Unauthorized!</h2>
        <p>You don't have the authorization to access this page!</p>
        <Link to="/landing" className="link">
          Back to landing page
        </Link>
      </div>
    </Wrapper>
  );
};

export default Unauthorized;
