import { SUMMARY_DATA, CAMPAIGN_STATUS, DONATION_TRENDS, VOLUNTEER_TRENDS, CAMPAIGN_DONATIONS } from "./Types";

export const SUMMARYDATA = (value) => {
  return {
    type: SUMMARY_DATA,
    payload: { value },
  };
};

export const CAMPAIGNSTATUS = (value) => {
  return {
    type: CAMPAIGN_STATUS,
    payload: { value },
  };
};

export const DONATIONTRENDS = (value) => {
  return {
    type: DONATION_TRENDS,
    payload: { value },
  };
};

export const VOLUNTEERTRENDS = (value) => {
  return {
    type: VOLUNTEER_TRENDS,
    payload: { value },
  };
};

export const CAMPAIGNDONATIONS = (value) => {
  return {
    type: CAMPAIGN_DONATIONS,
    payload: { value },
  };
};

