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
import { useDispatch } from "react-redux";
import { CAMPAIGNCHECKIN, CAMPAIGNCHECKOUT } from "../../../actions/registrations/ActionCreators";
import { formatDate } from "../../../common/utils";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';  // Make sure the CSS is included

const RegistrationDetails = ({ open, onClose, registrationData }) => {
  const dispatch = useDispatch();

  const [message, setMessage] = useState(""); // State to hold the message
  const [messageVisible, setMessageVisible] = useState(false); // State to control visibility

  const handleCheckIn = async (id) => {
    const responseMessage = await dispatch(CAMPAIGNCHECKIN(id), onClose);
    // Show success with Toastify
    toast.success(responseMessage);
  };

  const handleCheckOut = async (id) => {
    const responseMessage = await dispatch(CAMPAIGNCHECKOUT(id), onClose);
    // Show success with Toastify
    toast.success(responseMessage);
  };


  // const handleCheckIn = (id) => {
  //   const responseMessage = dispatch(CAMPAIGNCHECKIN(id));
  //   // setMessage(responseMessage); // Update the message
  //   // setMessageVisible(true); // Show the message
  //   toast.success(responseMessage); // Show success with Toastify
  //   // setTimeout(() => {
  //   //   onClose();
  //   // }, 3000);
  // };

  // const handleCheckOut = (id) => {
  //   const responseMessage = dispatch(CAMPAIGNCHECKOUT(id));
  //   // setMessage(responseMessage); // Update the message
  //   // setMessageVisible(true); // Show the message
  //   toast.success(responseMessage); // Show success with Toastify
  //   // setTimeout(() => {
  //   //   onClose();
  //   // }, 3000);
  // };

  const today = new Date();
  const startDate = new Date(registrationData.campaign?.startDate);
  const endDate = new Date(registrationData.campaign?.endDate);

  // Set both dates to UTC for comparison
  const isCheckInEnabled =
    today >= startDate && today <= endDate && !Boolean(registrationData?.checkInDate);

  const isCheckOutEnabled =
    Boolean(registrationData?.checkInDate) && !Boolean(registrationData?.checkOutDate);

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", textAlign: "center", color: "#3f51b5" }}
          >
            Registration Details
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ mt: 2, p: 2, bgcolor: "#f9fafc", borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#2e7d32" }}>
              Registration Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 0.5, color: "#6d6d6d" }}>Registration ID</FormLabel>
                  <Typography variant="body1" sx={{ fontWeight: "medium", color: "#333" }}>
                    {registrationData.registrationId}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 0.5, color: "#6d6d6d" }}>Registration Date</FormLabel>
                  <Typography variant="body1" sx={{ fontWeight: "medium", color: "#333" }}>
                    {formatDate(registrationData.registrationDate)}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 0.5, color: "#6d6d6d" }}>Status</FormLabel>
                  <Typography variant="body1" sx={{ fontWeight: "medium", color: "#333" }}>
                    {registrationData.status}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 0.5, color: "#6d6d6d" }}>Check-In Date</FormLabel>
                  <Typography variant="body1" sx={{ fontWeight: "medium", color: "#333" }}>
                    {registrationData.checkInDate
                      ? formatDate(registrationData.checkInDate)
                      : "N/A"}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 0.5, color: "#6d6d6d" }}>Check-Out Date</FormLabel>
                  <Typography variant="body1" sx={{ fontWeight: "medium", color: "#333" }}>
                    {registrationData.checkOutDate
                      ? formatDate(registrationData.checkOutDate)
                      : "N/A"}
                  </Typography>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3, bgcolor: "#e0e0e0" }} />

          <Box sx={{ mt: 2, p: 2, bgcolor: "#ffffff", borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#d32f2f" }}>
              Campaign Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 0.5, color: "#6d6d6d" }}>Campaign Title</FormLabel>
                  <Typography variant="body1" sx={{ fontWeight: "medium", color: "#333" }}>
                    {registrationData.campaign?.title}
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
                    {registrationData.campaign?.description}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 0.5, color: "#6d6d6d" }}>Target Amount</FormLabel>
                  <Typography variant="body1" sx={{ fontWeight: "medium", color: "#333" }}>
                    {`$${registrationData.campaign?.targetAmount?.toLocaleString()}`}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 0.5, color: "#6d6d6d" }}>Raised Amount</FormLabel>
                  <Typography variant="body1" sx={{ fontWeight: "medium", color: "#333" }}>
                    {`$${registrationData.campaign?.raisedAmount?.toLocaleString()}`}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 0.5, color: "#6d6d6d" }}>Start Date</FormLabel>
                  <Typography variant="body1" sx={{ fontWeight: "medium", color: "#333" }}>
                    {formatDate(registrationData.campaign?.startDate)}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 0.5, color: "#6d6d6d" }}>End Date</FormLabel>
                  <Typography variant="body1" sx={{ fontWeight: "medium", color: "#333" }}>
                    {formatDate(registrationData.campaign?.endDate)}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 0.5, color: "#6d6d6d" }}>Active Campaign</FormLabel>
                  <Checkbox
                    checked={registrationData.campaign?.isActive}
                    readOnly
                    sx={{ p: 0, ml: 1, color: "#388e3c" }}
                    disableRipple
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          {/* Check-in eligibility message */}
          <Box sx={{ mt: 2 }}>
            {!isCheckInEnabled && !registrationData.checkInDate && (
              <Typography variant="body2" sx={{ color: "red", textAlign: "center", mb: 2 }}>
                You can only check in on the campaign's start date: {startDate.toLocaleDateString()}
                .
              </Typography>
            )}
            {registrationData.checkInDate && !registrationData.checkOutDate && (
              <Typography variant="body2" sx={{ color: "orange", textAlign: "center", mb: 2 }}>
                You are already checked in.
              </Typography>
            )}
            {registrationData.checkOutDate && (
              <Typography variant="body2" sx={{ color: "blue", textAlign: "center", mb: 2 }}>
                You have already checked out.
              </Typography>
            )}
            {messageVisible && (
              <Typography variant="body1" sx={{ color: "green", textAlign: "center", mt: 2 }}>
                {message}
              </Typography>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button onClick={onClose} variant="outlined" color="secondary" sx={{ mx: 1 }}>
            Close
          </Button>
          <Button
            onClick={() => handleCheckIn(registrationData._id)}
            variant="contained"
            color="primary"
            sx={{
              mx: 1,
              "&:disabled": {
                backgroundColor: "#e0e0e0", // Light gray for disabled
                color: "#bdbdbd", // Darker gray for disabled text
              },
            }}
            disabled={!isCheckInEnabled}
          >
            Check-In
          </Button>
          <Button
            onClick={() => handleCheckOut(registrationData._id)}
            variant="contained"
            color="primary"
            sx={{
              mx: 1,
              "&:disabled": {
                backgroundColor: "#e0e0e0", // Light gray for disabled
                color: "#bdbdbd", // Darker gray for disabled text
              },
            }}
            disabled={!isCheckOutEnabled}
          >
            Check-Out
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </>
  );
};

export default RegistrationDetails;
