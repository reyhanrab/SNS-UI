import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Box,
  Typography,
  Button,
  FormControl,
  FormLabel,
  Checkbox,
  Divider,
} from "@mui/material";
import { useSelector } from "react-redux";

const CampaignDetails = ({ open, onClose, campaignData, onRegister, onDonate }) => {
  const registrationsData = useSelector((state) => state.RegistrationsReducer.registrationsData);

  const getRegisteredCampaignIds = (registrations) => {
    return registrations.map((reg) => reg.campaign._id);
  };
  const registeredCampaignIds = getRegisteredCampaignIds(registrationsData);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center" }}>
          Campaign Details
        </Typography>
      </DialogTitle>

      <Divider sx={{ my: 1 }} />

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel sx={{ mb: 1, fontWeight: "bold" }}>Campaign Title</FormLabel>
                <Typography variant="body1">{campaignData.title}</Typography>
              </FormControl>
            </Grid>

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

            <Grid item xs={6}>
              <FormControl fullWidth>
                <FormLabel sx={{ mb: 1, fontWeight: "bold" }}>Start Date</FormLabel>
                <Typography variant="body1">
                  {new Date(campaignData.startDate).toLocaleDateString()}
                </Typography>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <FormLabel sx={{ mb: 1, fontWeight: "bold" }}>End Date</FormLabel>
                <Typography variant="body1">
                  {new Date(campaignData.endDate).toLocaleDateString()}
                </Typography>
              </FormControl>
            </Grid>

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
        {registeredCampaignIds.includes(campaignData._id) && (
          <Typography variant="body2" color="primary">
            You have already registered for the campaign, We look forward to seeing you
          </Typography>
        )}
      </DialogContent>

      <Divider sx={{ my: 1 }} />

      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Close
        </Button>
        {(localStorage.getItem("role") === "admin" ||
          localStorage.getItem("role") === "volunteer") &&
          !registeredCampaignIds.includes(campaignData._id) && (
            <Button
              onClick={() => onRegister(campaignData._id)}
              variant="contained"
              color="primary"
            >
              Register
            </Button>
          )}
        {(localStorage.getItem("role") === "admin" || localStorage.getItem("role") === "donor") &&
          !registeredCampaignIds.includes(campaignData) && (
            <Button onClick={() => onDonate(campaignData)} variant="contained" color="primary">
              Donate
            </Button>
          )}
      </DialogActions>
    </Dialog>
  );
};

export default CampaignDetails;
