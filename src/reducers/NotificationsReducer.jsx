import {
  NOTIFICATION_SUCCESS,
  NOTIFICATIONS_REQUEST,
  NOTIFICATIONS_FAILURE,
} from "../actions/campaigns/Types";

const initialState = {
  notifications: [],
  loading: false,
  error: null,
  hasMore: true,
};

const NotificationsReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case NOTIFICATIONS_REQUEST:
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
    case NOTIFICATIONS_FAILURE:
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
