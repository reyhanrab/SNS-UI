import ApiService, { dispatchApiMessage, handleNetworkError } from "../../middleware/ApiService";
import { ERRORMSG, SUCCESSMSG } from "./Actions";

export const SIGNUP = (obj, formRef, navigate, setLoading) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.post(`/auth/signup`, { data: obj });
    // Update loading state after API response
    setLoading(false);
    if (apiResponse.status == 200) {
      formRef.current.reset();
      dispatchApiMessage(dispatch, SUCCESSMSG, apiResponse.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      dispatchApiMessage(dispatch, ERRORMSG, apiResponse.data.message);
    }
  } catch (error) {
    setLoading(false); // Ensure loading is turned off on error
    handleNetworkError(error);
  }
};

export const LOGIN = (obj, formRef, navigate, setLoading) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.patch(`/auth/login`, obj);

    // Update loading state after API response
    setLoading(false);

    if (apiResponse.status === 200) {
      formRef.current.reset();
      navigate("/dashboard");
      localStorage.setItem("email", apiResponse.data.results.email);
      localStorage.setItem("userId", apiResponse.data.results._id);
      localStorage.setItem(
        "name",
        `${apiResponse.data.results.firstname} ${apiResponse.data.results.lastname}`
      );
      localStorage.setItem("role", apiResponse.data.results.role);
    }
  } catch (error) {
    dispatchApiMessage(dispatch, ERRORMSG, error.response.data.message);
    setLoading(false); // Ensure loading is turned off on error
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
