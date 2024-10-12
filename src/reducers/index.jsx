import { combineReducers } from "redux";
import GeneralReducer from "./GeneralReducer";
import CampaignsReducer from "./CampaignsReducer";
import DonationsReducer from "./DonationsReducer";
import UsersReducer from "./UsersReducer";

export default combineReducers({
  GeneralReducer: GeneralReducer,
  CampaignsReducer: CampaignsReducer,
  DonationsReducer: DonationsReducer,
  UsersReducer: UsersReducer,
});
