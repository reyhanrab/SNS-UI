import ApiService, { dispatchApiMessage, handleNetworkError } from "../../middleware/ApiService";
import { ERRORMSG, SUCCESSMSG } from "./Actions";

export const SIGNUP = (obj, formRef, navigate) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.post(`/auth/signup`, { data: obj });
    if (apiResponse.status == 200) {
      formRef.current.reset();
      dispatchApiMessage(dispatch, SUCCESSMSG, apiResponse.data.message);
      setTimeout(() => {
        navigate("/login")
      }, 2000);
    } else {
      dispatchApiMessage(dispatch, ERRORMSG, apiResponse.data.message);
    }
  } catch (error) {
    handleNetworkError(error);
  }
};