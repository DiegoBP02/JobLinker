import { companyLinks, userLinks } from "../utils/links";
import { NavLink } from "react-router-dom";
import { useAppContext, User } from "../context/appContext";

const NavLinks: React.FC<{
  toggleSidebar?: () => void;
}> = ({ toggleSidebar }) => {
  const { user } = useAppContext();
  const { role } = user as User;

  const links =
    role === "company" ? companyLinks : role === "user" ? userLinks : null;

  return (
    <div className="nav-links">
      {links?.map((link) => {
        const { id, text, path, icon } = link;

        return (
          <NavLink
            to={path}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            key={id}
            onClick={toggleSidebar}
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
