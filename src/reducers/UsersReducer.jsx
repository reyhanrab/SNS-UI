import { SAVE_USER_DATA, SAVE_USER_DATA_BYID } from "../actions/users/Types";

const initialState = {
  userData: [],
  userDataById: null,
};

const UsersReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SAVE_USER_DATA:
      return Object.assign({}, state, {
        userData: action.payload.value,
      });
    case SAVE_USER_DATA_BYID:
      return Object.assign({}, state, {
        userDataById: action.payload.value,
      });
    default:
      return state;
  }
};

export default UsersReducer;
