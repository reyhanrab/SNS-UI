import { REGISTRATIONS_DATA, REGISTRATION_METADATA } from "../actions/registrations/Types";

const initialState = {
  registrationsData: [],
  metadata: {},
};

const RegistrationsReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case REGISTRATIONS_DATA:
      return Object.assign({}, state, {
        registrationsData: action.payload.value,
      });
    case REGISTRATION_METADATA:
      return Object.assign({}, state, {
        metadata: action.payload.value,
      });
    default:
      return state;
  }
};

export default RegistrationsReducer;
