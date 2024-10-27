import {
  NOTIFICATION_SUCCESS,
  NOTIFICATION_REQUEST,
  NOTIFICATION_FAILURE,
} from "../actions/notifications/Types";

const initialState = {
  notifications: [],
  loading: false,
  error: null,
  hasMore: true,
};

const NotificationsReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case NOTIFICATION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case NOTIFICATION_SUCCESS:
      const newNotifications = action.payload.filter(
        (newNotif) => !state.notifications.some(
          (existingNotif) => existingNotif._id === newNotif._id
        )
      );
      return {
        ...state,
        loading: false,
        notifications: [...state.notifications, ...newNotifications],
        hasMore: newNotifications.length === 20, // Assuming 20 is the limit
      };
    case NOTIFICATION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default NotificationsReducer;
