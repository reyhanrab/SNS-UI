import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Grid,
  Box,
  Typography,
  FormControl,
  FormLabel,
  Divider,
} from "@mui/material";

const UpdateCampaign = ({ open, onClose, onUpdate, campaignData, flag }) => {
  const [campaign, setCampaign] = useState({
    title: "",
    description: "",
    targetAmount: "",
    raisedAmount: "",
    startDate: "",
    endDate: "",
    isActive: false,
  });

  // Load the existing campaign data into the state when the component opens
  useEffect(() => {
    if (campaignData) {
      setCampaign({
        ...campaignData,
        startDate: campaignData.startDate?.split("T")[0] || "",
        endDate: campaignData.endDate?.split("T")[0] || "",
      });
    }
  }, [campaignData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCampaign((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdate = () => {
    onUpdate({
      ...campaign,
      startDate: new Date(campaign.startDate),
      endDate: new Date(campaign.endDate),
    });
  };

  const isDisabled = !campaignData.isActive || new Date(campaignData.endDate) < new Date();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center" }}>
          Update Campaign
        </Typography>
      </DialogTitle>
      <Divider sx={{ my: 1 }} />
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="title" sx={{ mb: 1, fontWeight: "bold" }}>
                  Campaign Title
                </FormLabel>
                <TextField
                  id="title"
                  name="title"
                  value={campaign.title}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  disabled={isDisabled}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="description" sx={{ mb: 1, fontWeight: "bold" }}>
                  Description
                </FormLabel>
                <TextField
                  id="description"
                  name="description"
                  value={campaign.description}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "auto",
                    },
                    "& .MuiInputBase-input": {
                      overflow: "auto",
                    },
                  }}
                  disabled={isDisabled}
                />
                <Typography
                  variant="caption"
                  align="right"
                  sx={{ display: "block", mt: 0.5, color: "gray" }}
                >
                  {campaign.description.length} / 500 characters
                </Typography>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <FormLabel htmlFor="targetAmount" sx={{ mb: 1, fontWeight: "bold" }}>
                  Target Amount
                </FormLabel>
                <TextField
                  id="targetAmount"
                  name="targetAmount"
                  type="number"
                  value={campaign.targetAmount}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  disabled={isDisabled}
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <FormLabel htmlFor="raisedAmount" sx={{ mb: 1, fontWeight: "bold" }}>
                  Raised Amount
                </FormLabel>
                <TextField
                  id="raisedAmount"
                  name="raisedAmount"
                  type="number"
                  value={campaign.raisedAmount}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  disabled={isDisabled}
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <FormLabel htmlFor="startDate" sx={{ mb: 1, fontWeight: "bold" }}>
                  Start Date
                </FormLabel>
                <TextField
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={campaign.startDate}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  disabled={isDisabled}
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <FormLabel htmlFor="endDate" sx={{ mb: 1, fontWeight: "bold" }}>
                  End Date
                </FormLabel>
                <TextField
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={campaign.endDate}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  disabled={isDisabled}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="isActive"
                    checked={campaign.isActive}
                    onChange={handleInputChange}
                  />
                }
                label="Active Campaign"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <Divider sx={{ my: 1 }} />
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button
          onClick={() => handleUpdate()}
          variant="contained"
          color="primary"
          disabled={
            (new Date() >= new Date(campaign.startDate) &&
              new Date() <= new Date(campaign.endDate)) ||
            (!campaign.isActive && flag === "historical")
          }
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateCampaign;
