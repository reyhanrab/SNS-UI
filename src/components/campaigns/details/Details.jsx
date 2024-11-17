import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tabs,
  Tab,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import CampaignDetails from "./CampaignDetails";
import CampaignReport from "./CampaignReport";
import { useDispatch } from "react-redux";
import { GETCAMPAIGNBYID } from "../../../actions/campaigns/ActionCreators";

const Details = ({ open, onClose, campaignData, onRegister, onDonate }) => {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    dispatch(GETCAMPAIGNBYID(campaignData?._id));
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth={"lg"} fullWidth>
      {/* Tabs in Dialog Title */}
      <DialogTitle>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          centered
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Details" />
          <Tab label="Report" />
        </Tabs>
      </DialogTitle>

      <Divider />

      {/* Dialog Content */}
      <DialogContent>
        {activeTab === 0 && (
          <>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                mb: 2,
                textAlign: "center",
              }}
            >
              Campaign Details
            </Typography>
            <CampaignDetails
              campaignData={campaignData}
              onRegister={onRegister}
              onDonate={onDonate}
            />
          </>
        )}

        {activeTab === 1 && (
          <>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                mb: 2,
                textAlign: "center",
              }}
            >
              Campaign Report
            </Typography>
            <CampaignReport campaignData={campaignData} />
          </>
        )}
      </DialogContent>

      <Divider />

      {/* Dialog Actions */}
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Details;
