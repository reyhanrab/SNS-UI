import React, { useState } from "react";
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
  Alert,
} from "@mui/material";

const CreateCampaigns = ({ open, onClose, onCreate }) => {
  const [campaign, setCampaign] = useState({
    title: "",
    description: "",
    targetAmount: "",
    raisedAmount: 0,
    startDate: "",
    endDate: "",
    isActive: true,
  });

  const [errors, setErrors] = useState({});

  const today = new Date().toISOString().split("T")[0]; // Get today's date in 'YYYY-MM-DD' format

  const validate = () => {
    const newErrors = {};
    if (!campaign.title.trim()) newErrors.title = "Title is required.";
    if (!campaign.description.trim()) newErrors.description = "Description is required.";
    else if (campaign.description.length > 250)
      newErrors.description = "Description cannot exceed 250 characters.";
    if (!campaign.targetAmount || campaign.targetAmount <= 0)
      newErrors.targetAmount = "Target amount must be greater than 0.";
    if (!campaign.startDate) newErrors.startDate = "Start date is required.";
    if (campaign.startDate && new Date(campaign.startDate) < new Date(today))
      newErrors.startDate = "Start date cannot be in the past.";
    if (!campaign.endDate) newErrors.endDate = "End date is required.";
    if (
      campaign.startDate &&
      campaign.endDate &&
      new Date(campaign.endDate) >
        new Date(new Date(campaign.startDate).setDate(new Date(campaign.startDate).getDate() + 30))
    ) {
      newErrors.endDate = "End date cannot exceed 30 days from the start date.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCampaign((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreate = () => {
    if (validate()) {
      onCreate({
        ...campaign,
        startDate: new Date(campaign.startDate),
        endDate: new Date(campaign.endDate),
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center" }}>
          Create New Campaign
        </Typography>
      </DialogTitle>

      <Divider sx={{ my: 1 }} />

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {Object.keys(errors).length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Please correct the highlighted fields.
            </Alert>
          )}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="title" sx={{ mb: 1, fontWeight: "bold" }}>
                  Campaign Title
                </FormLabel>
                <TextField
                  id="title"
                  name="title"
                  placeholder="Enter title"
                  value={campaign.title}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title}
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
                  placeholder="Enter a brief description of the campaign"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "auto",
                    },
                    "& .MuiInputBase-input": {
                      overflow: "auto",
                    },
                  }}
                  error={!!errors.description}
                  helperText={errors.description}
                />
                <Typography
                  variant="caption"
                  align="right"
                  sx={{ display: "block", mt: 0.5, color: "gray" }}
                >
                  {campaign.description.length} / 250 characters
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
                  placeholder="Target Amount"
                  type="number"
                  value={campaign.targetAmount}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={!!errors.targetAmount}
                  helperText={errors.targetAmount}
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
                  placeholder="Raised Amount"
                  type="number"
                  value={campaign.raisedAmount}
                  onChange={(e) => {
                    const { value } = e.target;
                    if (value === "" || Number(value) <= Number(campaign.targetAmount)) {
                      handleInputChange(e);
                    }
                  }}
                  variant="outlined"
                  fullWidth
                  disabled={!campaign.targetAmount}
                  error={Number(campaign.raisedAmount) > Number(campaign.targetAmount)}
                  helperText={
                    Number(campaign.raisedAmount) > Number(campaign.targetAmount)
                      ? "Raised amount cannot exceed the target amount"
                      : ""
                  }
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
                  error={!!errors.startDate}
                  helperText={errors.startDate}
                  inputProps={{ min: today }}
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
                  error={!!errors.endDate}
                  helperText={errors.endDate}
                  inputProps={{
                    min: campaign.startDate || today,
                    max:
                      campaign.startDate &&
                      new Date(
                        new Date(campaign.startDate).setDate(
                          new Date(campaign.startDate).getDate() + 30
                        )
                      )
                        .toISOString()
                        .split("T")[0],
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    disabled={true}
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
        <Button onClick={handleCreate} variant="contained" color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCampaigns;
