import React, { FC, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { RiArrowDownSFill, RiArrowUpSFill } from "react-icons/ri";
import axios from "axios";
import BASE_URL from "../Services/Constant";
import { useDispatch, useSelector } from "react-redux";
import { authHeader } from "../Services/BaseService";
import { clearCurrentUser } from "../../store/actions/user";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Header: FC = () => {
  const [detailsOpened, setDetailsOpened] = useState(false);
  const [flag, setFlag] = useState();

  const handleUserDetails = () => setDetailsOpened(!detailsOpened);

  const currentUser = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${BASE_URL}/auth/me`, {
        headers: authHeader(),
      })
      .then((resp) => {
        setFlag(resp.data.verified);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const logout = () => {
    axios
      .post(`${BASE_URL}/auth/logout`, currentUser.token, {
        headers: authHeader(),
      })
      .then((resp) => {
        if (resp.status === 200) {
          toast.success("Logout successful.", {
            position: "top-left",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        console.log(resp);
      })
      .catch((error) => {
        console.log(error);
      });
    dispatch(clearCurrentUser());
    navigate("/login");
  };

  const resendVerificationLink = () => {
    axios
      .post(`${BASE_URL}/auth/resend-link/${currentUser.user._id}`, {
        headers: authHeader(),
      })
      .then((resp) => {
        toast.success(resp.data.message, {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      })
      .catch((error) => {
        console.log(error);
            toast.error("Unexpected error", {
              position: "top-left",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
      });
  };

  return (
    <header>
      <ToastContainer
        theme="colored"
        position="top-center"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition={Bounce}
      />

      {flag ? null : (
        <div className="top__header">
          <p>
            You have not verified your email address. Click
            <Link to="#" onClick={resendVerificationLink}>
              {" "}
              here{" "}
            </Link>
            to resend verification link.
          </p>
        </div>
      )}

      <div className="bottom__header">
        <div className="bottom__header-wrapper contain">
          <h3>Dashboard</h3>
          <div onClick={handleUserDetails}>
            <p>{`${currentUser?.user?.firstName} ${currentUser?.user?.lastName}`}</p>
            {detailsOpened ? <RiArrowUpSFill /> : <RiArrowDownSFill />}
          </div>
          {detailsOpened && (
            <ul className="header-menu">
              <li onClick={logout}>Logout</li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
