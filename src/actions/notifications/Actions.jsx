import { NOTIFICATION_SUCCESS, NOTIFICATIONS_REQUEST, NOTIFICATIONS_FAILURE } from "./Types";

export const NOTIFICATIONREQUEST = () => ({
  type: NOTIFICATIONS_REQUEST,
});

export const NOTIFICATIONSUCESS = (notifications) => ({
  type: NOTIFICATION_SUCCESS,
  payload: notifications,
});

export const NOTIFICATIONFAILURE = (error) => ({
  type: NOTIFICATIONS_FAILURE,
  payload: error,
});
