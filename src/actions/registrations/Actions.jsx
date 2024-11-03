import { REGISTRATIONS_DATA, REGISTRATION_METADATA } from "./Types";

/*------------------------------SAVE REGISTRATION DATA-------------------------------------------*/

export const REGISTRATIONSDATA = (value) => {
  return {
    type: REGISTRATIONS_DATA,
    payload: { value },
  };
};

/*------------------------------SAVE REGISTRATION PAGINATION DATA-------------------------------------------*/

export const REGISTRATIONMETADATA = (value) => {
  return {
    type: REGISTRATION_METADATA,
    payload: { value },
  };
};

