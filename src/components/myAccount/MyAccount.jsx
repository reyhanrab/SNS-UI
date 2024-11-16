import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  CircularProgress,
  FormControl,
  FormLabel,
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { CHANGEPASSWORD, EDITUSER } from "../../actions/users/ActionCreators";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MyAccount() {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.UsersReducer.userDataById);

  const [formData, setFormData] = useState(null); // Initial state set to null
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (userData) {
      setFormData(userData); // Only update formData once userData is available
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Determine the changed data
    const updatedData = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== userData[key]) {
        updatedData[key] = formData[key];
      }
    });

    if (Object.keys(updatedData).length === 0) {
      toast.success("No changes made.");
      setLoading(false);
      return;
    } else {
      dispatch(
        EDITUSER(
          localStorage.getItem("userId"),
          updatedData,
          (success) => {
            if (success) toast.success("Profile updated successfully!");
            else toast.error("Profile update failed. Please try again.");
            setLoading(false);
          },
          setError,
          setLoading
        )
      );
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentPassword("");
    setNewPassword("");
  };

  const handlePasswordChange = async () => {
    // Check if both passwords match
    if (currentPassword === newPassword) {
      setError("New password cannot be the same as the current password.");
      return;
    }

    dispatch(
      CHANGEPASSWORD(
        localStorage.getItem("userId"),
        { password: newPassword },
        handleCloseModal,
        (success) => {
          if (success) toast.success("Password changed successfully!");
          else toast.error("Password change failed. Please try again.");
        },
        setError
      )
    );
  };

  if (!formData) {
    // If formData is null (waiting for data), show a loading spinner
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
    >
      <Grid item xs={12} sm={8} md={6}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            My Account
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Non-editable fields */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 1 }}>Username</FormLabel>
                  <TextField
                    value={formData?.username || ""}
                    variant="filled"
                    InputProps={{ readOnly: true }}
                    fullWidth
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 1 }}>Role</FormLabel>
                  <TextField
                    value={formData?.role || ""}
                    variant="filled"
                    InputProps={{ readOnly: true }}
                    fullWidth
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 1 }}>Status</FormLabel>
                  <TextField
                    value={formData?.status || ""}
                    variant="filled"
                    InputProps={{ readOnly: true }}
                    fullWidth
                  />
                </FormControl>
              </Grid>

              {/* Editable fields */}
              {[{ name: "firstname", label: "First Name" }, { name: "lastname", label: "Last Name" }, { name: "email", label: "Email" }, { name: "phone", label: "Phone" }, { name: "address", label: "Address" }].map((field) => (
                <Grid item xs={12} sm={6} key={field.name}>
                  <FormControl fullWidth>
                    <FormLabel sx={{ mb: 1 }}>{field.label}</FormLabel>
                    <TextField
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </FormControl>
                </Grid>
              ))}

              {/* Change Password Button */}
              <Grid item xs={12}>
                <Button variant="outlined" onClick={handleOpenModal} fullWidth>
                  Change Password
                </Button>
              </Grid>
            </Grid>

            {/* Save Button */}
            <Box sx={{ mt: 3, position: "relative" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                disabled={loading}
                fullWidth
              >
                Save Changes
              </Button>
              {loading && (
                <CircularProgress
                  size={24}
                  sx={{
                    color: "primary.main",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: "-12px",
                    marginLeft: "-12px",
                  }}
                />
              )}
            </Box>
          </form>

          {/* Change Password Modal */}
          <Dialog open={openModal} onClose={handleCloseModal}>
            <DialogTitle>Change Password</DialogTitle>
            <DialogContent>
              <TextField
                placeholder="Current Password"
                type="password"
                fullWidth
                variant="outlined"
                margin="normal"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <TextField
                placeholder="New Password"
                type="password"
                fullWidth
                variant="outlined"
                margin="normal"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal} color="primary">
                Cancel
              </Button>
              <Button onClick={handlePasswordChange} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>

          {/* Toast Container */}
          <ToastContainer />
        </Paper>
      </Grid>
    </Grid>
  );
}

export default MyAccount;
