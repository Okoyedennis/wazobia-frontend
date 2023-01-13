import { CLEAR_CURRENT_USER, SET_CURRENT_USER } from "../types";

//@ts-ignore
const userReducer = (state = {}, action) => {
  switch (action?.type) {
    case SET_CURRENT_USER:
      localStorage.setItem("currentUser", JSON.stringify(action?.payload));
      return action?.payload;
    case CLEAR_CURRENT_USER:
      localStorage.removeItem("currentUser");
      return null;
    default:
      //@ts-ignore
      return JSON.parse(localStorage.getItem("currentUser"));
  }
};

export default userReducer;
