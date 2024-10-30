import { CAMPAIGNS_DATA, CAMPAIGN_METADATA } from "../actions/campaigns/Types";

const initialState = {
  campaignsData: [],
  metadata: {}
};

const CampaignsReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case CAMPAIGNS_DATA:
      return Object.assign({}, state, {
        campaignsData: action.payload.value,
        metadata: action.payload.metadata
      });
      case CAMPAIGN_METADATA:
        return Object.assign({}, state, {
          metadata: action.payload.value
        });
    default:
      return state;
  }
};

export default CampaignsReducer;
