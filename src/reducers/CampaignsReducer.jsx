import { CAMPAIGNS_DATA } from "../actions/campaigns/Types";

const initialState = {
  campaignsData: [],
};

const CampaignsReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case CAMPAIGNS_DATA:
      return Object.assign({}, state, {
        campaignsData: action.payload.value,
      });
    default:
      return state;
  }
};

export default CampaignsReducer;
