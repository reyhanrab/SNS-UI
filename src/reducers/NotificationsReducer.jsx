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
      return {
        ...state,
        loading: false,
        notifications: [...state.notifications, ...action.payload],
        hasMore: action.payload.length === 20, // Assuming 20 is the limit
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
