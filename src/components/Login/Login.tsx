import axios from "axios";
import { useState, ChangeEvent, FC, useEffect } from "react";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import BASE_URL from "../Services/Constant";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../../store/actions/user";

const Login: FC = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [togglePassword, setTogglePassword] = useState(false);
  const [emailValidated, setEmailValidated] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: any) => state.user);

  // validated states

  const handleTogglePassword = () => {
    setTogglePassword(!togglePassword);
  };
    
  useEffect(() => {
    if (currentUser?.user._id) {
      navigate("/");
    }
    // eslint-disable-next-line
  }, []);


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

    setUser((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post(`${BASE_URL}/auth/login`, user)
      .then((resp) => {
        if (resp.status === 200) {
          dispatch(setCurrentUser(resp.data));
          toast.success("Login successfully.", {
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
      })
      .catch((error) => {
        setLoading(false);

        if (error.response.status === 404) {
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
      });
  };

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
          <h3>Log in</h3>
          <p>
            If you have don't have an account,{" "}
            <Link to="/register">Sign up</Link>
          </p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="form__row">
            <div className="input__wrapper">
              <label>Email Address</label>

              <input
                type="text"
                placeholder="Type here"
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
                placeholder="Type your password here"
                name="password"
                onChange={(e) => handleChange(e)}
              />
              <p onClick={handleTogglePassword}>
                {togglePassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </p>
            </div>
          </div>
          <button disabled={!emailValidated}>
            {loading ? "Loading..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
