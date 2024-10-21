// CreateCampaignDialog.jsx
import React, { useState } from 'react';
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
} from '@mui/material';

const CreateCampaigns = ({ open, onClose, onCreate }) => {
  const [campaign, setCampaign] = useState({
    title: '',
    description: '',
    targetAmount: '',
    raisedAmount: '',
    startDate: '',
    endDate: '',
    isActive: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCampaign((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCreate = () => {
    onCreate({
      ...campaign,
      startDate: new Date(campaign.startDate),
      endDate: new Date(campaign.endDate),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Create New Campaign
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="title" sx={{ mb: 1, fontWeight: 'bold' }}>
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
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="description" sx={{ mb: 1, fontWeight: 'bold' }}>
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
                    '& .MuiOutlinedInput-root': {
                      height: 'auto',
                    },
                    '& .MuiInputBase-input': {
                      overflow: 'auto',
                    },
                  }}                />
                <Typography
                  variant="caption"
                  align="right"
                  sx={{ display: 'block', mt: 0.5, color: 'gray' }}
                >
                  {campaign.description.length} / 500 characters
                </Typography>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <FormLabel htmlFor="targetAmount" sx={{ mb: 1, fontWeight: 'bold' }}>
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
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <FormLabel htmlFor="raisedAmount" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Raised Amount
                </FormLabel>
                <TextField
                  id="raisedAmount"
                  name="raisedAmount"
                  placeholder="Raised Amount"
                  type="number"
                  value={campaign.raisedAmount}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <FormLabel htmlFor="startDate" sx={{ mb: 1, fontWeight: 'bold' }}>
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
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <FormLabel htmlFor="endDate" sx={{ mb: 1, fontWeight: 'bold' }}>
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

      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
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
