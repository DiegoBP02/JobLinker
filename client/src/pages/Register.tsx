import { useEffect, useState } from "react";
import { Alert, FormRow, Logo } from "../components";
import Wrapper from "../assets/wrappers/Register";
import { useAppContext } from "../context/appContext";
import { useNavigate } from "react-router-dom";

interface initialStateProps {
  name: string;
  email: string;
  password: string;
  role: string;
  isMember: boolean;
}

const initialState = {
  name: "",
  email: "",
  password: "",
  role: "user",
  isMember: true,
};

function Register() {
  const [values, setValues] = useState<initialStateProps>(initialState);
  const { isLoading, showAlert, displayAlert, setupUser, user } =
    useAppContext();
  const navigate = useNavigate();

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, role: e.target.value });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, email, password, isMember, role } = values;
    if (!email || !password || !role || (!isMember && !name)) {
      displayAlert();
      return;
    }

    const currentUser = { fullName: name, email, password, role };
    if (isMember) {
      setupUser(currentUser, "login", "Login successful! Redirecting...");
    } else {
      setupUser(currentUser, "register", "User created! Redirecting...");
    }
  };

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, [user, navigate]);

  return (
    <Wrapper className="full-page ">
      <form className="form" onSubmit={onSubmit}>
        <Logo center widthFix />
        <h3> {values.isMember ? "Login" : "Register"}</h3>
        {showAlert && <Alert />}
        {/* name field */}
        {!values.isMember && (
          <FormRow
            type="text"
            name="name"
            value={values.name}
            handleChange={handleChange}
          />
        )}
        {/* email field */}
        <FormRow
          name="email"
          type="email"
          value={values.email}
          handleChange={handleChange}
        />
        {/* email field */}
        <FormRow
          name="password"
          type="password"
          value={values.password}
          handleChange={handleChange}
        />

        {!values.isMember && (
          <div className="mt">
            <input
              type="radio"
              value="user"
              id="user"
              name="account"
              checked={values.role === "user"}
              onChange={handleRoleChange}
            />
            <label htmlFor="user" className="radio">
              User
            </label>
            <input
              type="radio"
              value="company"
              id="company"
              name="account"
              checked={values.role === "company"}
              onChange={handleRoleChange}
            />
            <label htmlFor="company" className="radio">
              Company
            </label>
          </div>
        )}
        <button type="submit" className="btn btn-block mt" disabled={isLoading}>
          submit
        </button>
        <p>
          {values.isMember ? "Not a member yet?" : "Already a member?"}
          <button type="button" className="member-btn " onClick={toggleMember}>
            {values.isMember ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </Wrapper>
  );
}

export default Register;
