import { combineReducers } from "redux";
import GeneralReducer from "./GeneralReducer";
import CampaignsReducer from "./CampaignsReducer";
import NotificationsReducer from "./NotificationsReducer";
import RegistrationsReducer from "./RegistrationsReducer";
import UsersReducer from "./UsersReducer";

export default combineReducers({
  GeneralReducer: GeneralReducer,
  CampaignsReducer: CampaignsReducer,
  NotificationsReducer: NotificationsReducer,
  RegistrationsReducer: RegistrationsReducer,
  UsersReducer: UsersReducer
});
