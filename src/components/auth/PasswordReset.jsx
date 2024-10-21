// ResetPassword.jsx
import React, { useEffect, useState } from "react";
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

import axios from "axios";

const PasswordReset = ({ open, email, setResetPassOpen }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [timer, setTimer] = useState(60); // 60 seconds countdown
  const [resendMessage, setResendMessage] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    // Start the timer only if resend is disabled
    if (isResendDisabled) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            clearInterval(interval);
            setIsResendDisabled(false); // Enable resend after the timer ends
            return 60; // Reset timer
          }
          return prevTimer - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isResendDisabled]);

  const handleSubmit = async () => {
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/reset-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, code: code }),
      });
      const data = await response.json();

      if (response.ok) {
        setTimeout(() => {
          setMessage("");
          setResetPassOpen(false);
        }, 2000);
        setMessage("Password updated successfully.");
      } else {
        setError(data.message || "Failed to update password.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  const handleResendCode = async () => {
    setResendMessage("");
    setError("");
    try {
      // Call the backend API to resend the code
      const response = await axios.patch("http://localhost:3000/api/v1/auth/resend-code", {
        email: email,
      });
      setResendMessage(response.data.message);
      setIsResendDisabled(true); // Disable resend button again after successful resend
    } catch (err) {
      setError("Error resending verification code. Please try again." + err);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <Dialog open={open} onClose={() => setVerifyOpen(false)}>
      <DialogTitle>Reset Password</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
        <DialogContentText>Reset Password.</DialogContentText>
        <OutlinedInput
          label="Verification Code"
          variant="outlined"
          fullWidth
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          margin="dense"
          id="code"
          name="code"
          placeholder="XXXXXX"
        />
        {isResendDisabled && (
          <Typography variant="body2" color="textSecondary">
            You can resend the code in {timer} seconds.
          </Typography>
        )}
        <OutlinedInput
          margin="dense"
          id="password"
          name="password"
          placeholder="New Password"
          label="New Password"
          variant="outlined"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <OutlinedInput
          label="Confirm New Password"
          variant="outlined"
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          margin="dense"
          id="newPassword"
          name="newPassword"
          placeholder="Confirm New Password"
        />

        {error && <Alert severity="error">{error}</Alert>}
        {message && <Alert severity="success">{message}</Alert>}
        {resendMessage && <Typography color="success">{resendMessage}</Typography>}
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={() => setResetPassOpen(false)}>Cancel</Button>
        <Button variant="contained" type="button" onClick={() => handleSubmit()}>
          Continue
        </Button>
        <Button
          variant="outlined"
          type="button"
          disabled={isResendDisabled}
          onClick={() => handleResendCode()}
        >
          Resend
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PasswordReset;
