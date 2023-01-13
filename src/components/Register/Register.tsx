import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import "./Register.css";
import { ChangeEvent, FC, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import BASE_URL from "../Services/Constant";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setCurrentUser } from "../../store/actions/user";

const Register: FC = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const [togglePassword, setTogglePassword] = useState(false);
  // validated states
  const [upperValidated, setUpperValidated] = useState(false);
  const [numberValidated, setNumberValidated] = useState(false);
  const [specialValidated, setSpecialValidated] = useState(false);
  const [lengthValidated, setLengthValidated] = useState(false);
  const [emailValidated, setEmailValidated] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleTogglePassword = () => {
    setTogglePassword(!togglePassword);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "email") {
      const mailformat = new RegExp(
        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      );

      if (mailformat.test(value)) {
        setEmailValidated(true);
      } else {
        setEmailValidated(false);
      }
    }

    if (name === "password") {
      const upper = new RegExp("(?=.*[A-Z])");
      const number = new RegExp("(?=.*[0-9])");
      const special = new RegExp("(?=.*[!@#$%^&*])");
      const length = new RegExp("(?=.{8,})");

      if (upper.test(value)) {
        setUpperValidated(true);
      } else {
        setUpperValidated(false);
      }

      if (number.test(value)) {
        setNumberValidated(true);
      } else {
        setNumberValidated(false);
      }

      if (special.test(value)) {
        setSpecialValidated(true);
      } else {
        setSpecialValidated(false);
      }

      if (length.test(value)) {
        setLengthValidated(true);
      } else {
        setLengthValidated(false);
      }
    }

    setUser((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!user.firstName || !user.lastName || !user.email || !user.password) {
      setLoading(false);
      return;
    }

    axios
      .post(`${BASE_URL}/auth/register`, user)
      .then((resp) => {
        setLoading(false);

        if (resp.status === 201) {
          dispatch(setCurrentUser(resp.data));
          toast.success("Login Successful.", {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setTimeout(() => {
            navigate("/");
          }, 3000);
        }
        console.log(resp);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          toast.error(error.response.data.message, {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
       
        } else {
          toast.error("Unexpected error", {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        console.log(error);
           setLoading(false);
      });
  };

  //1$A12345

  return (
    <div className="register">
      <ToastContainer
        theme="colored"
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition={Bounce}
      />
      <div className="register__wrapper contain">
        <div className="register__header">
          <h3>Create an Account</h3>
          <p>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
        <form onSubmit={handleRegister}>
          <div className="form__row">
            <div className="input__wrapper">
              <label>First Name</label>
              <input
                type="text"
                placeholder="Type here"
                name="firstName"
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="input__wrapper">
              <label>Last Name</label>
              <input
                type="text"
                placeholder="Type here"
                name="lastName"
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>
          <div className="form__row">
            <div className="input__wrapper">
              <label>Email Address</label>

              <input
                type="text"
                placeholder="Type your email address here"
                name="email"
                onChange={(e) => handleChange(e)}
              />
              {user.email.length !== 0 ? (
                emailValidated ? null : (
                  <p>Wrong email format! </p>
                )
              ) : null}
            </div>
          </div>
          <div className="password__wrapper">
            <label>Password</label>
            <div className="passwordInput__wrapper">
              <input
                type={togglePassword ? "text" : "password"}
                placeholder="Type your password"
                name="password"
                onChange={(e) => handleChange(e)}
              />
              <p onClick={handleTogglePassword}>
                {togglePassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </p>
            </div>
            <main>
              <ul className={upperValidated ? "validated" : "not-validated"}>
                <li>At least one uppercase letter</li>
              </ul>
              <ul className={numberValidated ? "validated" : "not-validated"}>
                <li> At least one number</li>
              </ul>
              <ul className={specialValidated ? "validated" : "not-validated"}>
                <li>At least one special character</li>
              </ul>
              <ul className={lengthValidated ? "validated" : "not-validated"}>
                <li>At least 8 characters</li>
              </ul>
            </main>
          </div>
          <button
            disabled={
              !upperValidated ||
              !numberValidated ||
              !specialValidated ||
              !lengthValidated ||
              !emailValidated
            }
          >
            {loading ? "Load..." : " Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
