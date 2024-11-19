import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  CircularProgress,
  FormControl,
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  useTheme,
  Avatar,
  Divider,
  IconButton,
  Alert,
  Fade,
  Card,
  CardContent,
  Stack,
  Container,
} from "@mui/material";
import {
  Save as SaveIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Key as KeyIcon,
  Badge as BadgeIcon,
  AccountCircle as AccountIcon,
  VpnKey as RoleIcon,
  CheckCircle as StatusIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { CHANGEPASSWORD, EDITUSER } from "../../actions/users/ActionCreators";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function MyAccount() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.UsersReducer.userDataById);

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData(userData);
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

    const updatedData = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== userData[key]) {
        updatedData[key] = formData[key];
      }
    });

    if (Object.keys(updatedData).length === 0) {
      toast.info("No changes detected");
      setLoading(false);
      setEditMode(false);
      return;
    }

    dispatch(
      EDITUSER(
        localStorage.getItem("userId"),
        updatedData,
        (success) => {
          if (success) {
            toast.success("Profile updated successfully!");
            setEditMode(false);
          } else {
            toast.error("Failed to update profile");
          }
          setLoading(false);
        },
        setError,
        setLoading
      )
    );
  };

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword) {
      setError("Please fill in both password fields");
      return;
    }
    if (currentPassword === newPassword) {
      setError("New password must be different from current password");
      return;
    }

    dispatch(
      CHANGEPASSWORD(
        localStorage.getItem("userId"),
        { password: newPassword, currentPassword },
        () => {
          handleCloseModal();
          toast.success("Password changed successfully!");
        },
        (success) => {
          if (!success) {
            toast.error("Failed to change password");
          }
        },
        setError
      )
    );
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setError(null);
  };

  if (!formData) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const ReadOnlyField = ({ icon, label, value }) => (
    <Card
      variant="outlined"
      sx={{
        mb: 2,
        backgroundColor: theme.palette.grey[50],
        borderRadius: 2,
        transition: "all 0.3s ease",
        "&:hover": {
          backgroundColor: theme.palette.grey[100],
          transform: "translateY(-2px)",
          boxShadow: theme.shadows[2],
        },
      }}
    >
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              color: theme.palette.primary.main,
              display: "flex",
              alignItems: "center",
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ fontWeight: 500 }}
            >
              {label}
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {value}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            width: "100%",
            maxWidth: 800,
            position: "relative",
          }}
        >
          {/* Back Button */}
          <IconButton
            sx={{
              position: "absolute",
              top: 16,
              left: 16,
            }}
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon />
          </IconButton>

          {/* Header Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 6,
              mt: 2,
            }}
          >
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: theme.palette.primary.main,
                fontSize: "2.5rem",
                mb: 2,
                boxShadow: theme.shadows[3],
              }}
            >
              {formData.firstname?.[0]?.toUpperCase() || "U"}
            </Avatar>
            <Typography variant="h4" gutterBottom align="center">
              My Account
            </Typography>
            <Typography
              variant="subtitle1"
              color="textSecondary"
              align="center"
              sx={{ mb: 2 }}
            >
              Manage your personal information and account settings
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3, width: "100%", borderRadius: 2 }}
            >
              {error}
            </Alert>
          )}

          {/* Account Information Section */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              gutterBottom
              color="textSecondary"
              align="center"
              sx={{ mb: 3 }}
            >
              Account Information
            </Typography>
            <ReadOnlyField
              icon={<AccountIcon />}
              label="Username"
              value={formData.username}
            />
            <ReadOnlyField
              icon={<RoleIcon />}
              label="Role"
              value={formData.role}
            />
            <ReadOnlyField
              icon={<StatusIcon />}
              label="Status"
              value={formData.status}
            />
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Personal Information Form */}
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 6,
                mt: 2,
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                color="textSecondary"
                align="center"
                sx={{ mb: 3 }}
              >
                Personal Information
              </Typography>
              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                }}
              >
                <Button
                  variant={editMode ? "contained" : "outlined"}
                  startIcon={<EditIcon />}
                  onClick={() => setEditMode(!editMode)}
                  size="small"
                >
                  {editMode ? "Editing Mode" : "Edit Profile"}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<KeyIcon />}
                  onClick={() => setOpenModal(true)}
                  sx={{ minWidth: 200 }}
                >
                  Change Password
                </Button>
              </Box>
            </Box>
            <Grid container spacing={3}>
              {[
                {
                  name: "firstname",
                  label: "First Name",
                  icon: <PersonIcon />,
                },
                {
                  name: "lastname",
                  label: "Last Name",
                  icon: <PersonIcon />,
                },
                {
                  name: "email",
                  label: "Email",
                  icon: <EmailIcon />,
                },
                {
                  name: "phone",
                  label: "Phone",
                  icon: <PhoneIcon />,
                },
                {
                  name: "address",
                  label: "Address",
                  icon: <HomeIcon />,
                },
              ].map((field) => (
                <Grid item xs={12} sm={6} key={field.name}>
                  <FormControl fullWidth>
                    <TextField
                      name={field.name}
                      label={field.label}
                      value={formData[field.name] || ""}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      InputProps={{
                        startAdornment: (
                          <Box
                            sx={{
                              color: editMode
                                ? "primary.main"
                                : "action.active",
                              mr: 1,
                            }}
                          >
                            {field.icon}
                          </Box>
                        ),
                      }}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          transition: "all 0.3s ease",
                          "&:hover": {
                            backgroundColor: editMode
                              ? "action.hover"
                              : "transparent",
                          },
                        },
                      }}
                    />
                  </FormControl>
                </Grid>
              ))}
            </Grid>

            <Box
              sx={{
                mt: 4,
                display: "flex",
                gap: 2,
                justifyContent: "center",
              }}
            >
              <Fade in={editMode}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={loading}
                  sx={{ minWidth: 200 }}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </Fade>
            </Box>
          </form>

          {/* Password Change Dialog */}
          <Dialog
            open={openModal}
            onClose={handleCloseModal}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 2,
              },
            }}
          >
            <DialogTitle>
              <Stack direction="row" spacing={2} alignItems="center">
                <KeyIcon color="primary" />
                <Typography variant="h6">Change Password</Typography>
              </Stack>
            </DialogTitle>
            <DialogContent>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <TextField
                label="Current Password"
                type="password"
                fullWidth
                variant="outlined"
                margin="normal"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <TextField
                label="New Password"
                type="password"
                fullWidth
                variant="outlined"
                margin="normal"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button
                onClick={handleCloseModal}
                variant="outlined"
                color="inherit"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePasswordChange}
                variant="outlined"
                color="primary"
                startIcon={<SaveIcon />}
                disabled={!currentPassword || !newPassword}
              >
                Update Password
              </Button>
            </DialogActions>
          </Dialog>

          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </Paper>
      </Box>
    </Container>
  );
}

export default MyAccount;
