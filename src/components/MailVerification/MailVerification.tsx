import "./MailVerification.css";
import { MdOutlineMarkEmailUnread, MdKeyboardArrowRight } from "react-icons/md";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../Services/Constant";
import { useSelector } from "react-redux";
import { authHeader } from "../Services/BaseService";
import { useEffect, useState } from "react";

const MailVerification = () => {
  const [flag, setFlag] = useState(false);
  const currentUser = useSelector((state: any) => state.user);

  console.log(`${BASE_URL}/auth/${currentUser.user._id}`);

  const verifyMail = () => {
    axios
      .get(
        `${BASE_URL}/auth/${currentUser.user._id}/verify/${currentUser.token}`,
        {
          headers: authHeader(),
        }
      )
      .then((resp) => {
        setFlag(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/auth/me`, {
        headers: authHeader(),
      })
      .then((resp) => {
        if (resp.data.verified) {
          setFlag(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <div className="mailVerification">
      <div className="mailVerification__wrapper contain">
        {flag ? (
          <IoIosCheckmarkCircleOutline className="lead-icon" />
        ) : (
          <MdOutlineMarkEmailUnread className="lead-icon" />
        )}
        {flag ? (
          <p>Your email address has been verified.</p>
        ) : (
          <p>Click button below to verify your mail</p>
        )}
        <div className="link-wrapper">
          {flag ? (
            <Link to="/">Go to Dashboard</Link>
          ) : (
            <Link to="#" onClick={verifyMail}>
              Verify
            </Link>
          )}

          <MdKeyboardArrowRight className="sub-icon" />
        </div>
      </div>
    </div>
  );
};

export default MailVerification;
