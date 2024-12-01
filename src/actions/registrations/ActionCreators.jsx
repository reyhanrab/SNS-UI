import ApiService, { handleNetworkError, dispatchAction } from "../../middleware/ApiService";
import { REGISTRATIONSDATA, REGISTRATIONMETADATA } from "./Actions";

export const GETREGISTRATIONS =
  (page, limit, filter = {}) =>
  async (dispatch) => {
    try {
      // Convert filter object to URL query parameters
      const filterQuery = new URLSearchParams(filter).toString();
      const apiResponse = await ApiService.get(
        `/registration?page=${page}&limit=${limit}&${filterQuery}`
      );

      if (apiResponse) {
        dispatchAction(dispatch, REGISTRATIONSDATA, apiResponse.data.results);
        dispatchAction(dispatch, REGISTRATIONMETADATA, apiResponse.data.metadata);
      }
    } catch (error) {
      handleNetworkError(error);
    }
  };

  export const CAMPAIGNCHECKIN = (id, onClose) => async (dispatch) => {
    console.log("onClose",onClose)
    try {
      const apiResponse = await ApiService.post(`/registration/${id}/check-in`);
      if (apiResponse) {
        dispatch(GETREGISTRATIONS());
        onClose();
        return "Successfully checked in!"; // Return success message
      }
    } catch (error) {
      handleNetworkError(error);
      return "Check-in failed, please try again."; // Return failure message
    }
  };
  
  export const CAMPAIGNCHECKOUT = (id, onClose) => async (dispatch) => {
    try {
      const apiResponse = await ApiService.post(`/registration/${id}/check-out`);
      if (apiResponse) {
        dispatch(GETREGISTRATIONS());
        onClose();
        return "Successfully checked out!"; // Return success message
      }
    } catch (error) {
      handleNetworkError(error);
      return "Check-out failed, please try again."; // Return failure message
    }
  };