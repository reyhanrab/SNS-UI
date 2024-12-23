import ApiService, { handleNetworkError, dispatchAction } from "../../middleware/ApiService";
import { GETREGISTRATIONS } from "../registrations/ActionCreators";
import { CAMPAIGNSDATA, CAMPAIGNMETADATA, CAMPAIGNSPAGINATED, CAMPAIGNBYID } from "./Actions";

export const GETCAMPAIGNSDATA = () => async (dispatch) => {
  try {
    const apiResponse = await ApiService.get(`/campaign`);

    if (apiResponse) {
      dispatchAction(dispatch, CAMPAIGNSDATA, apiResponse.data.results);
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

export const GETCAMPAIGNBYID = (id) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.get(`/campaign/${id}`);

    if (apiResponse) {
      dispatchAction(dispatch, CAMPAIGNBYID, apiResponse.data.results);
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

export const GETPAGINATEDCAMPAIGNS =
  (page, limit, filter = {}) =>
  async (dispatch) => {
    try {
      // Convert filter object to URL query parameters
      const filterQuery = new URLSearchParams(filter).toString();
      const apiResponse = await ApiService.get(
        `/campaign/paginated?page=${page}&limit=${limit}&${filterQuery}`
      );

      if (apiResponse) {
        dispatchAction(dispatch, CAMPAIGNSPAGINATED, apiResponse.data.results);
        dispatchAction(dispatch, CAMPAIGNMETADATA, apiResponse.data.metadata);
      }
    } catch (error) {
      handleNetworkError(error);
    }
  };

export const ADDCAMPAIGNSDATA = (obj, handleCreateModal) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.post(`/campaign`, obj);
    if (apiResponse) {
      dispatch(GETCAMPAIGNSDATA());
      handleCreateModal();
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

export const EDITCAMPAIGNSDATA = (id, obj, handleUpdateModal) => async (dispatch) => {
  try {
    delete obj?._id;
    const apiResponse = await ApiService.patch(`/campaign/${id}`, obj);
    if (apiResponse) {
      dispatch(GETCAMPAIGNSDATA());
      handleUpdateModal();
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

export const DELETECAMPAIGNSDATA = (id, currentPage, limit, filter) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.delete(`/campaign/${id}`);
    if (apiResponse) {
      dispatch(GETPAGINATEDCAMPAIGNS(currentPage, limit, filter));
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

export const REGISTERFORCAMPAGIN = (id, userId, handleDialog) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.post(`/campaign/${id}/registration`, {
      volunteer: userId,
    });
    if (apiResponse) {
      dispatch(GETREGISTRATIONS());
      handleDialog();
    }
  } catch (error) {
    handleNetworkError(error);
  }
};
