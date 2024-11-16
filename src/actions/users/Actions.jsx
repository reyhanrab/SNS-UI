import { SAVE_USER_DATA, SAVE_USER_DATA_BYID } from "./Types";

export const SAVEUSERDATA = (value) => {
  return {
    type: SAVE_USER_DATA,
    payload: { value },
  };
};

export const SAVEUSERDATABYID = (value) => {
  return {
    type: SAVE_USER_DATA_BYID,
    payload: { value },
  };
};

