import ApiService, { handleNetworkError, dispatchAction } from "../../middleware/ApiService";
import { CAMPAIGNSDATA, CAMPAIGNMETADATA } from "./Actions";

export const GETCAMPAIGNSDATA = (page, limit) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.get(`/campaigns?page=${page}&limit=${limit}`);
    if (apiResponse) {
      console.log("", apiResponse);
      dispatchAction(dispatch, CAMPAIGNSDATA, apiResponse.data.results);
      dispatchAction(dispatch, CAMPAIGNMETADATA, apiResponse.data.metadata);
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

export const ADDCAMPAIGNSDATA = (obj, handleDialog) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.post(`/campaigns`, obj);
    if (apiResponse) {
      dispatch(GETCAMPAIGNSDATA());
      handleDialog(false);
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

export const EDITCAMPAIGNSDATA =
  (id, obj, formRef, handleDialog, showDialog) => async (dispatch) => {
    try {
      const apiResponse = await ApiService.patch(`/campaigns/${id}`, { data: obj });
      if (apiResponse) {
        dispatch(GETCAMPAIGNSDATA());
        formRef.current.reset();
        handleDialog(!showDialog);
      }
    } catch (error) {
      handleNetworkError(error);
    }
  };

export const EDITPROFILE = (id, obj, formRef) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.patch(`/campaigns/${id}`, { data: obj });
    if (apiResponse) {
      dispatch(GETCAMPAIGNSDATA());
      formRef.current.reset();
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

export const DELETECAMPAIGNSDATA = (id) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.delete(`/campaigns/${id}`);
    if (apiResponse) {
      dispatch(GETCAMPAIGNSDATA());
    }
  } catch (error) {
    handleNetworkError(error);
  }
};
