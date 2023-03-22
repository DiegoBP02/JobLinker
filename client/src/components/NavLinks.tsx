import links from "../utils/links";
import { NavLink } from "react-router-dom";
import { useAppContext } from "../context/appContext";

const NavLinks = () => {
  const { toggleSidebar } = useAppContext();
  return (
    <div className="nav-links">
      {links.map((link) => {
        const { id, text, path, icon } = link;

        return (
          <NavLink
            to={path}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            key={id}
            // onClick={toggleSidebar}
          >
            <span className="icon">{icon}</span>
            {text}
          </NavLink>
        );
      })}
    </div>
  );
};
export default NavLinks;
