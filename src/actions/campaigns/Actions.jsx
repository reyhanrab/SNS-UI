import { CAMPAIGNS_DATA, CAMPAIGN_METADATA, CAMPAIGNS_PAGINATED, CAMPAIGN_BY_ID } from "./Types";

/*------------------------------SAVE CAMPAIGN DATA-------------------------------------------*/

export const CAMPAIGNSDATA = (value) => {
  return {
    type: CAMPAIGNS_DATA,
    payload: { value },
  };
};

/*------------------------------SAVE CAMPAIGN PAGINATION METADATA DATA-------------------------------------------*/

export const CAMPAIGNMETADATA = (value) => {
  return {
    type: CAMPAIGN_METADATA,
    payload: { value },
  };
};

/*------------------------------SAVE CAMPAIGN PAGINATION DATA-------------------------------------------*/

export const CAMPAIGNSPAGINATED = (value) => {
  return {
    type: CAMPAIGNS_PAGINATED,
    payload: { value },
  };
};

/*------------------------------SAVE CAMPAIGN BY ID DATA-------------------------------------------*/

export const CAMPAIGNBYID = (value) => {
  return {
    type: CAMPAIGN_BY_ID,
    payload: { value },
  };
};

