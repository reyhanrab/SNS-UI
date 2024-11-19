import ApiService, { handleNetworkError, dispatchAction } from "../../middleware/ApiService";
import { SUMMARYDATA, CAMPAIGNSTATUS, DONATIONTRENDS, VOLUNTEERTRENDS, CAMPAIGNDONATIONS } from "./Actions";

// Fetch summary data (for example, general dashboard info)
export const GETSUMMARYDATA = () => async (dispatch) => {
  try {
    const apiResponse = await ApiService.get(`/metric/summary`); // Use your actual API endpoint
    if (apiResponse) {
      dispatchAction(dispatch, SUMMARYDATA, apiResponse.data.results);
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

// Fetch campaign status (ongoing, upcoming, completed)
export const GETCAMPAIGNSTATUS = () => async (dispatch) => {
  try {
    const apiResponse = await ApiService.get(`/metric/campaign-status`);
    if (apiResponse) {
      dispatchAction(dispatch, CAMPAIGNSTATUS, apiResponse.data.results);
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

// Fetch donation trends
export const GETDONATIONTRENDS = () => async (dispatch) => {
  try {
    const apiResponse = await ApiService.get(`/metric/donation-trends`);
    if (apiResponse) {
      dispatchAction(dispatch, DONATIONTRENDS, apiResponse.data.results);
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

// Fetch volunteer trends (e.g., volunteer registrations per campaign)
export const GETVOLUNTEERTRENDS = () => async (dispatch) => {
  try {
    const apiResponse = await ApiService.get(`/metric/volunteer-trends`);
    if (apiResponse) {
      dispatchAction(dispatch, VOLUNTEERTRENDS, apiResponse.data.results);
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

// Fetch donations per campaign
export const GETCAMPAIGNDONATIONS = () => async (dispatch) => {
  try {
    const apiResponse = await ApiService.get(`/metric/campaign-donations`);
    if (apiResponse) {
      dispatchAction(dispatch, CAMPAIGNDONATIONS, apiResponse.data.results);
    }
  } catch (error) {
    handleNetworkError(error);
  }
};
