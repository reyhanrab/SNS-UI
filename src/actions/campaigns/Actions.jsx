import { CAMPAIGNS_DATA, CAMPAIGN_METADATA } from "./Types";

/*------------------------------SAVE CAMPAIGN DATA-------------------------------------------*/

export const CAMPAIGNSDATA = (value) => {
  return {
    type: CAMPAIGNS_DATA,
    payload: { value },
  };
};

/*------------------------------SAVE CAMPAIGN PAGINATION DATA-------------------------------------------*/

export const CAMPAIGNMETADATA = (value) => {
  return {
    type: CAMPAIGN_METADATA,
    payload: { value },
  };
};

