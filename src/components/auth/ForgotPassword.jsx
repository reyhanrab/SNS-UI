import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  OutlinedInput,
  Typography,
  Alert,
} from "@mui/material";
import PasswordReset from "./PasswordReset";

const ForgotPassword = ({ open, handleClose }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resetPassOpen, setResetPassOpen] = useState(false);

  // Email validation regex
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const resetFormState = () => {
    setError("");
    setMessage("");
    setEmailErrorMessage("");
    setEmailError(false);
  };

  const handleSubmit = async () => {
    resetFormState();

    if (!validateEmail(email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/forgot-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage("An email with a verification code has been sent.");
        setTimeout(() => {
          setMessage("");
          handleClose();
          setResetPassOpen(true);
        }, 2000);
      } else {
        setError(data.message || "Failed to send verification code.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  if (resetPassOpen) {
    return <PasswordReset open={resetPassOpen} email={email} setResetPassOpen={setResetPassOpen} />;
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Forgot Password</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
        <DialogContentText>
          Enter your account's email address, and we'll send you a link to reset your password.
        </DialogContentText>
        <OutlinedInput
          error={emailError}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
          required
          margin="dense"
          id="email"
          placeholder="Email address"
          type="email"
          fullWidth
        />
        {emailError && <Typography color="error">{emailErrorMessage}</Typography>}
        {error && <Alert severity="error">{error}</Alert>}
        {message && <Typography color="success">{message}</Typography>}
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" type="button" onClick={handleSubmit}>
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ForgotPassword;
