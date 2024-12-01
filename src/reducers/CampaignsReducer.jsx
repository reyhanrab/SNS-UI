import {
  CAMPAIGNS_DATA,
  CAMPAIGN_METADATA,
  CAMPAIGNS_PAGINATED,
  CAMPAIGN_BY_ID,
} from "../actions/campaigns/Types";

const initialState = {
  campaignsData: [],
  paginatedCampaignData: [],
  metadata: {},
  campaignById: {},
};

const CampaignsReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case CAMPAIGNS_DATA:
      return Object.assign({}, state, {
        campaignsData: action.payload.value,
        metadata: action.payload.metadata,
      });
    case CAMPAIGN_METADATA:
      return Object.assign({}, state, {
        metadata: action.payload.value,
      });
    case CAMPAIGNS_PAGINATED:
      return Object.assign({}, state, {
        paginatedCampaignData: action.payload.value,
      });
    case CAMPAIGN_BY_ID:
      return Object.assign({}, state, {
        campaignById: action.payload.value,
      });
    default:
      return state;
  }
};

export default CampaignsReducer;
