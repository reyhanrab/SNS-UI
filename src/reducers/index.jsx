import { combineReducers } from "redux";
import GeneralReducer from "./GeneralReducer";
import CampaignsReducer from "./CampaignsReducer";

export default combineReducers({
  GeneralReducer: GeneralReducer,
  CampaignsReducer: CampaignsReducer,
});
