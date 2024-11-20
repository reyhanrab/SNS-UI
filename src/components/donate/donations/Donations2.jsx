import React, { useEffect, useState } from "react";
import {
  Toolbar,
  Typography,
  Box,
  Paper,
  Container,
  Avatar,
  Stack,
  useTheme,
  Grid,
} from "@mui/material";
import {
  Paid as PaidIcon,
  AccountBalanceWallet as WalletIcon,
  VolunteerActivism as VolunteerIcon,
} from "@mui/icons-material";
import ViewDonations from "./view/ViewDonations2";
import DonationDetails from "./details/DonationDetails";
import { useDispatch, useSelector } from "react-redux";

const DonationStats = () => {
  const theme = useTheme();
  const donationSummary = useSelector((state) => state.UsersReducer.donationSummary);

  const stats = [
    {
      icon: <PaidIcon />,
      color: theme.palette.primary.main,
    },
    {
      icon: <WalletIcon />,
      color: theme.palette.success.main,
    },
    {
      icon: <VolunteerIcon />,
      color: theme.palette.info.main,
    },
  ];

  const enhancedDonationSummary = donationSummary.map((item, index) => ({
    ...item, // Spread the original donation summary object
    icon: stats[index]?.icon || null, // Add the corresponding icon from stats
    color: stats[index]?.color || null, // Add the corresponding color from stats
  }));

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={3}>
        {enhancedDonationSummary.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                height: "100%",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{
                    bgcolor: stat.color + "15",
                    color: stat.color,
                    width: 56,
                    height: 56,
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    {stat.title}
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {stat.value}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const MemoizedViewDonations = React.memo(ViewDonations);

function Donations() {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(false);

  const handleDetailsModal = (obj = {}) => {
    setSelectedRow(obj);
    setDetailsModal(!detailsModal);
  };

  useEffect(() => {
    dispatch(GETDONATIONSUMMARYFORUSER(localStorage.getItem("userId")));
  });

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 3 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Toolbar
            sx={{
              px: { xs: 0 },
              mb: 2,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.main,
                  width: 40,
                  height: 40,
                }}
              >
                <PaidIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  My Donations
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Track and manage your contributions
                </Typography>
              </Box>
            </Stack>
          </Toolbar>

          {/* Stats Section */}
          <DonationStats />

          {/* Donations Table */}
          <Box sx={{ position: "relative" }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <MemoizedViewDonations handleDetailsModal={handleDetailsModal} />
            </Paper>
          </Box>
        </Box>

        {/* Donation Details Modal */}
        {detailsModal && (
          <DonationDetails
            open={detailsModal}
            onClose={handleDetailsModal}
            paymentData={selectedRow}
          />
        )}
      </Container>
    </Box>
  );
}

export default Donations;
