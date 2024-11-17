import React, { useState } from "react";
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
import { formatDate, formatDateTime } from "../../../../common/utils";

const DonationDetails = ({ open, onClose, paymentData }) => {
  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", textAlign: "center", color: "#3f51b5" }}
          >
            Payment and Campaign Details
          </Typography>
        </DialogTitle>

        <DialogContent>
          {/* Payment Information Section */}
          <Box sx={{ mt: 2, p: 2, bgcolor: "#f9fafc", borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#2e7d32" }}>
              Payment Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 0.5, color: "#6d6d6d" }}>Payment ID</FormLabel>
                  <Typography variant="body1" sx={{ fontWeight: "medium", color: "#333" }}>
                    {paymentData.paymentIntentId}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 0.5, color: "#6d6d6d" }}>Payment Date</FormLabel>
                  <Typography variant="body1" sx={{ fontWeight: "medium", color: "#333" }}>
                    {formatDateTime(paymentData.paymentDate)}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 0.5, color: "#6d6d6d" }}>Amount</FormLabel>
                  <Typography variant="body1" sx={{ fontWeight: "medium", color: "#333" }}>
                    {`${paymentData.amount.toLocaleString()} ${paymentData.currency}`}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 0.5, color: "#6d6d6d" }}>Card Type</FormLabel>
                  <Typography variant="body1" sx={{ fontWeight: "medium", color: "#333" }}>
                    {paymentData.cardType}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 0.5, color: "#6d6d6d" }}>Card Holder</FormLabel>
                  <Typography variant="body1" sx={{ fontWeight: "medium", color: "#333" }}>
                    {paymentData.cardHolderName}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 0.5, color: "#6d6d6d" }}>Billing Country</FormLabel>
                  <Typography variant="body1" sx={{ fontWeight: "medium", color: "#333" }}>
                    {paymentData.country}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 0.5, color: "#6d6d6d" }}>Billing Address</FormLabel>
                  <Typography variant="body1" sx={{ fontWeight: "medium", color: "#333" }}>
                    {paymentData.address}
                  </Typography>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3, bgcolor: "#e0e0e0" }} />

          {/* Campaign Information Section */}
          <Box sx={{ mt: 2, p: 2, bgcolor: "#ffffff", borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#d32f2f" }}>
              Campaign Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 0.5, color: "#6d6d6d" }}>Campaign Title</FormLabel>
                  <Typography variant="body1" sx={{ fontWeight: "medium", color: "#333" }}>
                    {paymentData.campaign?.title}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 0.5, color: "#6d6d6d" }}>Description</FormLabel>
                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: "pre-line",
                      maxHeight: 150,
                      overflow: "auto",
                      color: "#333",
                    }}
                  >
                    {paymentData.campaign?.description}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 0.5, color: "#6d6d6d" }}>Target Amount</FormLabel>
                  <Typography variant="body1" sx={{ fontWeight: "medium", color: "#333" }}>
                    {`$${paymentData.campaign?.targetAmount?.toLocaleString()}`}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 0.5, color: "#6d6d6d" }}>Raised Amount</FormLabel>
                  <Typography variant="body1" sx={{ fontWeight: "medium", color: "#333" }}>
                    {`$${paymentData.campaign?.raisedAmount?.toLocaleString()}`}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 0.5, color: "#6d6d6d" }}>Start Date</FormLabel>
                  <Typography variant="body1" sx={{ fontWeight: "medium", color: "#333" }}>
                    {formatDate(paymentData.campaign?.startDate)}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 0.5, color: "#6d6d6d" }}>End Date</FormLabel>
                  <Typography variant="body1" sx={{ fontWeight: "medium", color: "#333" }}>
                    {formatDate(paymentData.campaign?.endDate)}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 0.5, color: "#6d6d6d" }}>Active Campaign</FormLabel>
                  <Checkbox
                    checked={paymentData.campaign?.isActive}
                    readOnly
                    sx={{ p: 0, ml: 1, color: "#388e3c" }}
                    disableRipple
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button onClick={onClose} variant="outlined" color="secondary" sx={{ mx: 1 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DonationDetails;
