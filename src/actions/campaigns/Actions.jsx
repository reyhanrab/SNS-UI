import { CAMPAIGNS_DATA } from "./Types";

/*------------------------------SAVE USERS DATA-------------------------------------------*/

export const CAMPAIGNSDATA = (value) => {
  return {
    type: CAMPAIGNS_DATA,
    payload: { value },
  };
};
