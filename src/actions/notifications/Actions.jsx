import { NOTIFICATION_SUCCESS, NOTIFICATION_REQUEST, NOTIFICATION_FAILURE } from "./Types";

export const NOTIFICATIONREQUEST = () => ({
  type: NOTIFICATION_REQUEST,
});

export const NOTIFICATIONSUCESS = (notifications) => ({
  type: NOTIFICATION_SUCCESS,
  payload: notifications,
});

export const NOTIFICATIONFAILURE = (error) => ({
  type: NOTIFICATION_FAILURE,
  payload: error,
});
