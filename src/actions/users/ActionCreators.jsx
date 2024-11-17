import ApiService, { handleNetworkError, dispatchAction } from "../../middleware/ApiService";
import { SAVEUSERDATA, SAVEUSERDATABYID, DONATIONSBYID, DONATIONSBYIDMETADATA } from "./Actions";

export const GETUSERDATA = () => async (dispatch) => {
  try {
    const apiResponse = await ApiService.get(`/api/user`);
    if (apiResponse) {
      dispatchAction(dispatch, SAVEUSERDATA, apiResponse.data.results);
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

export const GETUSERDATABYID = (id) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.get(`/user/${id}`);
    if (apiResponse) {
      dispatchAction(dispatch, SAVEUSERDATABYID, apiResponse.data.results);
    }
  } catch (error) {
    handleNetworkError(error);
  }
};
export const GETDONATIONSBYID = (id, page, limit) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.get(`/user/${id}/donations?page=${page}&limit=${limit}`);

    if (apiResponse) {
      // Dispatch the donations data and metadata
      dispatchAction(dispatch, DONATIONSBYID, apiResponse.data.results);
      dispatchAction(dispatch, DONATIONSBYIDMETADATA, apiResponse.data.metadata);
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

export const CREATEUSER = (obj, formRef, handleDialog, showDialog) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.post(`/user`, { data: obj });
    if (apiResponse) {
      dispatch(GETUSERDATA());
      formRef.current.reset();
      handleDialog(!showDialog);
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

export const EDITUSER = (id, obj, setSuccess, setError, setLoading) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.patch(`/user/${id}`, obj);
    if (apiResponse) {
      dispatch(GETUSERDATABYID(id));
      setSuccess(true);
    }
  } catch (error) {
    setError("Failed to update profile. Please try again.");
    handleNetworkError(error);
  } finally {
    setLoading(false);
  }
};

export const CHANGEPASSWORD =
  (id, obj, handleCloseModal, setSuccess, setError) => async (dispatch) => {
    try {
      const apiResponse = await ApiService.patch(`/user/${id}/change-password`, obj);
      if (apiResponse) {
        dispatch(GETUSERDATABYID(id));
        handleCloseModal();
        setSuccess(true);
      }
    } catch (error) {
      setError("Failed to change password. Please try again.");
      handleNetworkError(error);
    }
  };

export const DELETEUSER = (id) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.delete(`/user/${id}`);
    if (apiResponse) {
      dispatch(GETUSERDATA());
    }
  } catch (error) {
    handleNetworkError(error);
  }
};
