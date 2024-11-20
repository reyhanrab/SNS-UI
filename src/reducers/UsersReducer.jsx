import {
  SAVE_USER_DATA,
  SAVE_USER_DATA_BYID,
  DONATIONS_BY_ID,
  DONATIONSBYID_METADATA,
  DONATION_SUMMARY,
} from "../actions/users/Types";

const initialState = {
  userData: [],
  userDataById: {},
  donationsById: [],
  donationsByIdMetadata: {},
  donationSummary: [],
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
    case DONATIONS_BY_ID:
      return Object.assign({}, state, {
        donationsById: action.payload.value,
      });
    case DONATIONSBYID_METADATA:
      return Object.assign({}, state, {
        donationsByIdMetadata: action.payload.value,
      });
    case DONATION_SUMMARY:
      return Object.assign({}, state, {
        donationSummary: action.payload.value,
      });
    default:
      return state;
  }
};

export default UsersReducer;
