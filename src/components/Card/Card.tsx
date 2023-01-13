import { FC } from "react";
import { useSelector } from "react-redux";
import "./Card.css";

interface Pros {
  name: String;
  description: String;
}

const Card: FC<Pros> = ({ name, description }) => {
  const currentUser = useSelector((state: any) => state.user);

  console.log();

  return (
    <div className="cardsComponent">
      <header>
        <small>{`${currentUser.user.firstName} ${currentUser.user.lastName}`}</small>
        <h4>{name}</h4>
      </header>
      <div className="cardsComponent-body">
        <small>description</small>
        <p>{description}</p>
      </div>
      <div className="cardsComponent-footer">
        <button className="btn edit">Edit</button>
        <button className="btn delete">Delete</button>
      </div>
    </div>
  );
};

export default Card;
