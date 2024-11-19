import React, { useState, useEffect } from 'react';
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
  IconButton,
  Avatar,
  Stack,
  Paper,
  InputAdornment,
  Alert,
  LinearProgress,
  useTheme,
  Switch,
  Tooltip,
} from '@mui/material';
import {
  Campaign as CampaignIcon,
  Close as CloseIcon,
  Description as DescriptionIcon,
  MonetizationOn as MoneyIcon,
  DateRange as DateIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

const UpdateCampaign = ({ open, onClose, onUpdate, campaignData }) => {
  const theme = useTheme();
  const [campaign, setCampaign] = useState({
    title: '',
    description: '',
    targetAmount: '',
    raisedAmount: '',
    startDate: '',
    endDate: '',
    isActive: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (campaignData) {
      setCampaign({
        ...campaignData,
        startDate: campaignData.startDate?.split('T')[0] || '',
        endDate: campaignData.endDate?.split('T')[0] || '',
      });
    }
  }, [campaignData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCampaign((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError('');
    try {
      await onUpdate({
        ...campaign,
        startDate: new Date(campaign.startDate),
        endDate: new Date(campaign.endDate),
      });
    } catch (err) {
      setError('Failed to update campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getProgress = () => {
    return Math.min((campaign.raisedAmount / campaign.targetAmount) * 100, 100);
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
          backgroundImage: 'none',
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        {loading && (
          <LinearProgress 
            sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0,
              borderRadius: '8px 8px 0 0'
            }} 
          />
        )}

        <DialogTitle sx={{ pb: 0 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.main,
                  width: 40,
                  height: 40,
                }}
              >
                <CampaignIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  Update Campaign
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ID: {campaign._id}
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
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 2,
              bgcolor: theme.palette.primary.light + '10',
              border: `1px solid ${theme.palette.primary.light}`,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box flex={1}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Campaign Progress
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" fontWeight="medium">
                      ${campaign.raisedAmount?.toLocaleString()} raised
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getProgress().toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={getProgress()}
                    sx={{
                      height: 6,
                      borderRadius: 1,
                      bgcolor: theme.palette.grey[200],
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 1,
                      },
                    }}
                  />
                </Box>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={campaign.isActive}
                    onChange={handleInputChange}
                    name="isActive"
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    {campaign.isActive ? 'Active' : 'Inactive'}
                  </Typography>
                }
              />
            </Stack>
          </Paper>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <DescriptionIcon color="action" fontSize="small" />
                  <FormLabel sx={{ fontWeight: 500 }}>Campaign Details</FormLabel>
                </Stack>
                <TextField
                  name="title"
                  value={campaign.title}
                  onChange={handleInputChange}
                  placeholder="Enter campaign title"
                  variant="outlined"
                  fullWidth
                  disabled={!campaign.isActive}
                  sx={{ mb: 2 }}
                />
                <TextField
                  name="description"
                  value={campaign.description}
                  onChange={handleInputChange}
                  placeholder="Enter campaign description"
                  multiline
                  rows={4}
                  variant="outlined"
                  disabled={!campaign.isActive}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: 'auto',
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  align="right"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {campaign.description.length} / 500 characters
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
                  <TextField
                    name="targetAmount"
                    type="number"
                    value={campaign.targetAmount}
                    onChange={handleInputChange}
                    disabled={!campaign.isActive}
                    fullWidth
                    placeholder="Enter target amount"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="raisedAmount"
                    type="number"
                    value={campaign.raisedAmount}
                    onChange={handleInputChange}
                    disabled={!campaign.isActive}
                    fullWidth
                    placeholder="Enter raised amount"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                  />
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
                  <TextField
                    name="startDate"
                    type="date"
                    value={campaign.startDate}
                    onChange={handleInputChange}
                    disabled={!campaign.isActive}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="endDate"
                    type="date"
                    value={campaign.endDate}
                    onChange={handleInputChange}
                    disabled={!campaign.isActive}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            color="inherit"
            sx={{ borderRadius: 1 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            variant="contained"
            disabled={!campaign.isActive || loading}
            sx={{ borderRadius: 1, minWidth: 120 }}
          >
            {loading ? 'Updating...' : 'Update Campaign'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default UpdateCampaign;