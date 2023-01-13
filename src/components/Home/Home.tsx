import { FC, useEffect, useRef, useState } from "react";
import "./Home.css";
import { FiPlus } from "react-icons/fi";
import Create from "../Model/Create";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../Services/Constant";
import { authHeader } from "../Services/BaseService";
import Delete from "../Model/Delete";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home: FC = () => {
  const [createCard, setCreateCard] = useState({
    name: "",
    description: "",
  });
  const [event, setEvent] = useState([]);
  const [flag, setFlag] = useState(false);

  const createCardComponent = useRef();
  const deleteComponent = useRef();
  const currentUser = useSelector((state: any) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser?.user._id) {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  const createEvent = (): void => {
    if (!flag) {
          toast.error("Please verify your account if you want to create an event", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
      return;
    }
    setCreateCard({
      name: "",
      description: "",
    });
    // @ts-ignore
    createCardComponent.current?.showModel();
  };

  const editProductRequest = (item: any) => {
    setCreateCard(Object.assign({}, item));
    // @ts-ignore
    createCardComponent.current?.showModel();
  };

  const deleteEvent = (item: any) => {
    setCreateCard(item);
    // @ts-ignore
    deleteComponent.current?.showDeleteModal();
  };

  const handleDeleteEvent = () => {
    // @ts-ignore
    axios.delete(`${BASE_URL}/card/delete/${createCard._id}`, {
        headers: authHeader(),
      })
      .then((resp) => {
        // @ts-ignore
        setEvent(event.filter((del) => del._id !== createCard._id));
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/card/read`, {
        headers: authHeader(),
      })
      .then((resp) => {
        setEvent(resp.data);
      })
      .catch((error) => {
        console.log(error);
      });
    // @ts-ignore
  }, []);

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
    <>
      <div className="home">
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
        {event.length !== 0 ? (
          <div className="home__wrapper contain">
            {event.map((item: any) => (
              <div className="cardsComponent">
                <header>
                  <small>{`${currentUser.user.firstName} ${currentUser.user.lastName}`}</small>
                  <h4>{item.name}</h4>
                </header>
                <div className="cardsComponent-body">
                  <small>description</small>
                  <p>{item.description}</p>
                </div>
                <div className="cardsComponent-footer">
                  <button
                    className="btn edit"
                    onClick={() => {
                      editProductRequest(item);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn delete"
                    onClick={() => deleteEvent(item)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="home__text-container">
            <h2>Your don't have any uploaded event</h2>
          </div>
        )}
      </div>
      <div className="footer">
        <div className="footer-wrapper contain">
          <FiPlus onClick={() => createEvent()} />
        </div>
      </div>
      <Create createCard={createCard} ref={createCardComponent} />
      <Delete ref={deleteComponent} onConfirmed={() => handleDeleteEvent()} />
    </>
  );
};

export default Home;
