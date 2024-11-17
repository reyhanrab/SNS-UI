import { SAVE_USER_DATA, SAVE_USER_DATA_BYID, DONATIONS_BY_ID, DONATIONSBYID_METADATA } from "./Types";

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

export const DONATIONSBYID = (value) => {
  return {
    type: DONATIONS_BY_ID,
    payload: { value },
  };
};

export const DONATIONSBYIDMETADATA = (value) => {
  return {
    type: DONATIONSBYID_METADATA,
    payload: { value },
  };
};
