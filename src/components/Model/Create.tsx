import axios from "axios";
import {
  ChangeEvent,
  FC,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { authHeader } from "../Services/BaseService";
import BASE_URL from "../Services/Constant";
import "./Create.css";

interface Pros {
  createCard: any;
  ref: any;
}

const Create: FC<Pros> = forwardRef((props, ref) => {
  const [show, setShow] = useState(false);
  const [createCards, setCreateCards] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    //@ts-ignore
    setCreateCards(props.createCard, "hereee");
  }, [props.createCard]);


  useImperativeHandle(ref, () => ({
    showModel() {
      setTimeout(() => {
        setShow(true);
      }, 0);
    },
  }));

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateCards((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleCreateEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!createCards.name || !createCards.description) {
      return;
    }

    if (props.createCard._id) {
      axios
        .patch(`${BASE_URL}/card/update/${props.createCard._id}`, createCards, {
          headers: authHeader(),
        })
        .then((resp) => {
          console.log(resp);
          setLoading(false);
          setShow(false);
          setCreateCards({
            name: "",
            description: "",
          });
          window.location.reload();
        })
        .catch((error) => {
          setLoading(false);

          console.log(error);
        });
          setLoading(false);
      
    } else {
      axios
        .post(`${BASE_URL}/card/create`, createCards, {
          headers: authHeader(),
        })
        .then(() => {
          setLoading(false);
          setShow(false);
          setCreateCards({
            name: "",
            description: "",
          });
          window.location.reload();
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
          setLoading(false);
      
    }
  };

  return (
    <>
      {show ? (
        <div className="model">
          <div className=" contain">
            <form>
              <div className="modal-header">
                <h5 className="modal-title"> Create Item</h5>
              </div>
              <hr />
              <div className="modal-body">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={createCards.name}
                    name="name"
                    placeholder="Input item name here"
                    required
                    onChange={(e) => handleChange(e)}
                  />
                </div>
                <div className="form-group">
                  <label>Add Note</label>
                  <textarea
                    className="form-control"
                    placeholder="Type here"
                    id="floatingTextarea2"
                    value={createCards.description}
                    name="description"
                    required
                    style={{ height: "92px" }}
                    // @ts-ignore
                    onChange={(e) => handleChange(e)}
                  ></textarea>
                </div>
              </div>
              <div className="model-footer">
                <button
                  type="button"
                  className="cancel"
                  onClick={() => setShow(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="event"
                  // @ts-ignore
                  onClick={(e) => handleCreateEvent(e)}
                >
                  {loading ? "Loading..." : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
});

export default Create;
