import React from "react";
import {
  Grid,
  Box,
  Typography,
  FormControl,
  FormLabel,
  LinearProgress,
  Checkbox,
} from "@mui/material";
import { formatDate } from "../../../common/utils";

const CampaignDetails = ({ campaignData }) => {
  const calculateProgress = (raised, target) => {
    if (!target || target <= 0) return 0;
    return Math.min((raised / target) * 100, 100);
  };

  const progress = calculateProgress(campaignData.raisedAmount, campaignData.targetAmount);

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        {/* Campaign Title */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1, fontWeight: "bold" }}>Campaign Title</FormLabel>
            <Typography variant="body1">{campaignData.title}</Typography>
          </FormControl>
        </Grid>

        {/* Description */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1, fontWeight: "bold" }}>Description</FormLabel>
            <Typography
              variant="body1"
              sx={{
                whiteSpace: "pre-line",
                maxHeight: 150,
                overflow: "auto",
              }}
            >
              {campaignData.description}
            </Typography>
          </FormControl>
        </Grid>

        {/* Target and Raised Amount */}
        <Grid item xs={6}>
          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1, fontWeight: "bold" }}>Target Amount</FormLabel>
            <Typography variant="body1">{`$${campaignData.targetAmount?.toLocaleString()}`}</Typography>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1, fontWeight: "bold" }}>Raised Amount</FormLabel>
            <Typography variant="body1">{`$${campaignData.raisedAmount?.toLocaleString()}`}</Typography>
          </FormControl>
        </Grid>

        {/* Progress Bar */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1, fontWeight: "bold" }}>Progress</FormLabel>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ flexGrow: 1, height: 10, borderRadius: 5, mr: 2 }}
              />
              <Typography variant="body2" sx={{ minWidth: 50 }}>{`${Math.round(
                progress
              )}%`}</Typography>
            </Box>
          </FormControl>
        </Grid>

        {/* Start and End Dates */}
        <Grid item xs={6}>
          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1, fontWeight: "bold" }}>Start Date</FormLabel>
            <Typography variant="body1">
              {formatDate(campaignData.startDate)}
            </Typography>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1, fontWeight: "bold" }}>End Date</FormLabel>
            <Typography variant="body1">
              {formatDate(campaignData.endDate)}
            </Typography>
          </FormControl>
        </Grid>

        {/* Active Campaign */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1, fontWeight: "bold" }}>Active Campaign</FormLabel>
            <Checkbox
              checked={campaignData.isActive}
              readOnly
              sx={{ p: 0, ml: 1 }}
              disableRipple
            />
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CampaignDetails;
