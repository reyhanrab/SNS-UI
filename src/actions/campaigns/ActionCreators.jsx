import ApiService, { handleNetworkError, dispatchAction } from "../../middleware/ApiService";
import { CAMPAIGNSDATA, CAMPAIGNMETADATA } from "./Actions";

export const GETCAMPAIGNSDATA = (page, limit) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.get(`/campaigns?page=${page}&limit=${limit}`);
    if (apiResponse) {
      dispatchAction(dispatch, CAMPAIGNSDATA, apiResponse.data.results);
      dispatchAction(dispatch, CAMPAIGNMETADATA, apiResponse.data.metadata);
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

export const ADDCAMPAIGNSDATA = (obj, handleCreateModal) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.post(`/campaigns`, obj);
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
    const apiResponse = await ApiService.patch(`/campaigns/${id}`, obj);
    if (apiResponse) {
      dispatch(GETCAMPAIGNSDATA());
      handleUpdateModal();
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
