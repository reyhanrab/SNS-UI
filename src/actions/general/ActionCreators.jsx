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

export const LOGIN = (obj, formRef, navigate) => async () => {
  try {
    const apiResponse = await ApiService.patch(`/auth/login`, obj);
    if (apiResponse.status == 200) {
      formRef.current.reset();
      navigate("/dashboard");
      localStorage.setItem("email", apiResponse.data.results.email);
      localStorage.setItem("userId", apiResponse.data.results._id);
      localStorage.setItem("name", `${apiResponse.data.results.firstname} ${apiResponse.data.results.firstname}`);

    } else {
      dispatchApiMessage(dispatch, ERRORMSG, apiResponse.data.results.message);
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

export const LOGOUT = (userId, navigate) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.patch(`/auth/logout`, { userId: userId });
    if (apiResponse.status == 200) {
      localStorage.clear();
      navigate("/login");
    }
  } catch (error) {
    handleNetworkError(error);
  }
};
