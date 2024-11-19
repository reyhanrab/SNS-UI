import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Grid,
  Box,
  Typography,
  FormControl,
  FormLabel,
  Divider,
  Alert,
  Stack,
  Avatar,
  IconButton,
  Paper,
  InputAdornment,
  useTheme,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import {
  Campaign as CampaignIcon,
  Close as CloseIcon,
  Description as DescriptionIcon,
  MonetizationOn as MoneyIcon,
  DateRange as DateIcon,
  Info as InfoIcon,
  AddCircle as AddIcon,
} from "@mui/icons-material";

const CreateCampaigns = ({ open, onClose, onCreate }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
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
  const today = new Date().toISOString().split("T")[0];

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

  const handleCreate = async () => {
    if (validate()) {
      setLoading(true);
      try {
        await onCreate({
          ...campaign,
          startDate: new Date(campaign.startDate),
          endDate: new Date(campaign.endDate),
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          backgroundImage: "none",
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        {loading && (
          <LinearProgress
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              borderRadius: "8px 8px 0 0",
            }}
          />
        )}

        <DialogTitle sx={{ pb: 0 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.main,
                  width: 40,
                  height: 40,
                }}
              >
                <AddIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  Create New Campaign
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Create a new fundraising campaign
                </Typography>
              </Box>
            </Stack>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <Divider sx={{ my: 2 }} />

        <DialogContent>
          {Object.keys(errors).length > 0 && (
            <Alert
              severity="error"
              sx={{ mb: 3, borderRadius: 1 }}
              action={
                <Button color="error" size="small" onClick={() => setErrors({})}>
                  Clear
                </Button>
              }
            >
              Please correct the highlighted fields.
            </Alert>
          )}

          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 2,
              bgcolor: theme.palette.primary.light + "10",
              border: `1px solid ${theme.palette.primary.light}`,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <InfoIcon color="primary" />
              <Typography variant="body2" color="text.secondary">
                Campaigns can run for up to 30 days. All campaigns start as active and can be
                deactivated later if needed.
              </Typography>
            </Stack>
          </Paper>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <DescriptionIcon color="action" fontSize="small" />
                  <FormLabel sx={{ fontWeight: 500 }}>Campaign Details</FormLabel>
                </Stack>
                <FormLabel htmlFor="title" sx={{ mb: 1, fontWeight: "bold" }}>
                  Title
                </FormLabel>
                <TextField
                  name="title"
                  value={campaign.title}
                  onChange={handleInputChange}
                  placeholder="Enter a compelling campaign title"
                  variant="outlined"
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title}
                  sx={{ mb: 2 }}
                />
                <FormLabel htmlFor="description" sx={{ mb: 1, fontWeight: "bold" }}>
                  Desccription
                </FormLabel>
                <TextField
                  name="description"
                  value={campaign.description}
                  onChange={handleInputChange}
                  placeholder="Describe your campaign and its goals..."
                  multiline
                  rows={4}
                  variant="outlined"
                  error={!!errors.description}
                  helperText={errors.description}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "auto",
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  align="right"
                  color={campaign.description.length > 250 ? "error.main" : "text.secondary"}
                  sx={{ mt: 0.5 }}
                >
                  {campaign.description.length} / 250 characters
                </Typography>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <MoneyIcon color="action" fontSize="small" />
                <FormLabel sx={{ fontWeight: 500 }}>Financial Details</FormLabel>
              </Stack>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Tooltip title="Set your fundraising goal" arrow placement="top">
                    <FormLabel htmlFor="targetAmount" sx={{ mb: 1, fontWeight: "bold" }}>
                      Target Amount
                    </FormLabel>
                    <TextField
                      name="targetAmount"
                      type="number"
                      value={campaign.targetAmount}
                      onChange={handleInputChange}
                      fullWidth
                      placeholder="Enter target amount"
                      error={!!errors.targetAmount}
                      helperText={errors.targetAmount}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  </Tooltip>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormLabel htmlFor="raisedAmount" sx={{ mb: 1, fontWeight: "bold" }}>
                    Rasied Amount
                  </FormLabel>
                  <Tooltip title="Initial raised amount (if any)" arrow placement="top">
                    <TextField
                      name="raisedAmount"
                      type="number"
                      value={campaign.raisedAmount}
                      onChange={(e) => {
                        const { value } = e.target;
                        if (value === "" || Number(value) <= Number(campaign.targetAmount)) {
                          handleInputChange(e);
                        }
                      }}
                      fullWidth
                      placeholder="Enter initial amount raised"
                      disabled={!campaign.targetAmount}
                      error={Number(campaign.raisedAmount) > Number(campaign.targetAmount)}
                      helperText={
                        Number(campaign.raisedAmount) > Number(campaign.targetAmount)
                          ? "Cannot exceed target amount"
                          : ""
                      }
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <DateIcon color="action" fontSize="small" />
                <FormLabel sx={{ fontWeight: 500 }}>Campaign Period</FormLabel>
              </Stack>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormLabel htmlFor="startDate" sx={{ mb: 1, fontWeight: "bold" }}>
                    Start Date
                  </FormLabel>
                  <TextField
                    name="startDate"
                    type="date"
                    value={campaign.startDate}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!errors.startDate}
                    helperText={errors.startDate}
                    inputProps={{ min: today }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormLabel htmlFor="endDate" sx={{ mb: 1, fontWeight: "bold" }}>
                    End Date
                  </FormLabel>
                  <TextField
                    name="endDate"
                    type="date"
                    value={campaign.endDate}
                    onChange={handleInputChange}
                    fullWidth
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
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button onClick={onClose} variant="outlined" color="inherit" sx={{ borderRadius: 1 }}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            disabled={loading}
            sx={{ borderRadius: 1, minWidth: 120 }}
          >
            {loading ? "Creating..." : "Create Campaign"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CreateCampaigns;
