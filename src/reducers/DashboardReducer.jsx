import {
  SUMMARY_DATA,
  CAMPAIGN_STATUS,
  DONATION_TRENDS,
  VOLUNTEER_TRENDS,
  CAMPAIGN_DONATIONS,
} from "../actions/dashboard/Types";

const initialState = {
  summaryData: {},
  campaignStatus: [],
  donationTrends: [],
  volunteerTrends: [],
  campaignDonations: [],
};

const DashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUMMARY_DATA:
      return { ...state, summaryData: action.payload.value };
    case CAMPAIGN_STATUS:
      return { ...state, campaignStatus: action.payload.value };
    case DONATION_TRENDS:
      return { ...state, donationTrends: action.payload.value };
    case VOLUNTEER_TRENDS:
      return { ...state, volunteerTrends: action.payload.value };
    case CAMPAIGN_DONATIONS:
      return { ...state, campaignDonations: action.payload.value };
    default:
      return state;
  }
};

export default DashboardReducer;
