import Wrapper from "../assets/wrappers/Navbar";
// import { useAppContext } from "../context/appContext";
import { FaUserCircle } from "react-icons/fa";
import { RiArrowDownSFill } from "react-icons/ri";
import { useState } from "react";
import Logo from "./Logo";

const Navbar = () => {
  // const { user, logoutUser } = useAppContext();
  const [showLogout, setShowLogout] = useState<boolean>(false);

  // const firstName = user.name.split(" ")[0];

  return (
    <Wrapper>
      <header className="header">
        <Logo noMargin />
        <div className="btns">
          <button className="btn" onClick={() => setShowLogout(!showLogout)}>
            <FaUserCircle />
            Diego
            <RiArrowDownSFill />
          </button>
          <button
            className={showLogout ? "btn logout show-dropdown" : "btn logout "}
            // onClick={logoutUser}
          >
            Logout
          </button>
        </div>
      </header>
    </Wrapper>
  );
};

export default Navbar;
