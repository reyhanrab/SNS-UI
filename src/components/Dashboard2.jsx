import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Skeleton,
  Card,
  CardContent,
  useTheme,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  Campaign as CampaignIcon,
  People as PeopleIcon,
  MonetizationOn as DonationIcon,
  Refresh as RefreshIcon,
  VolunteerActivism as VolunteerIcon,
  Assessment as AssessmentIcon,
  DonutLarge as DonutIcon,
  Timeline as TimelineIcon,
  MonetizationOn
} from "@mui/icons-material";
import {
  GETSUMMARYDATA,
  GETCAMPAIGNSTATUS,
  GETDONATIONTRENDS,
  GETVOLUNTEERTRENDS,
  GETCAMPAIGNDONATIONS,
} from "../actions/dashboard/ActionCreators";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement
);

function Dashboard() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const summaryData = useSelector((state) => state.DashboardReducer.summaryData || {});
  const campaignStatus = useSelector((state) => state.DashboardReducer.campaignStatus || []);
  const donationTrends = useSelector((state) => state.DashboardReducer.donationTrends || []);
  const volunteerTrends = useSelector((state) => state.DashboardReducer.volunteerTrends || []);
  const campaignDonations = useSelector((state) => state.DashboardReducer.campaignDonations || []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      dispatch(GETSUMMARYDATA()),
      dispatch(GETCAMPAIGNSTATUS()),
      dispatch(GETDONATIONTRENDS()),
      dispatch(GETVOLUNTEERTRENDS()),
      dispatch(GETCAMPAIGNDONATIONS()),
    ]);
    setIsRefreshing(false);
  };

  useEffect(() => {
    handleRefresh();
  }, [dispatch]);

  useEffect(() => {
    if (
      summaryData &&
      donationTrends.length &&
      volunteerTrends.length &&
      campaignStatus.length
    ) {
      setIsLoading(false);
    }
  }, [summaryData, donationTrends, volunteerTrends, campaignStatus]);

  const StatCard = ({ icon: Icon, label, value, subValue, color = "primary" }) => (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        transition: "all 0.3s ease",
        "&:hover": {
          borderColor: theme.palette[color].main,
          transform: "translateY(-2px)",
          boxShadow: theme.shadows[2],
        },
      }}
    >
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Box
            sx={{
              backgroundColor: `${theme.palette[color].main}15`,
              borderRadius: "12px",
              p: 1,
              display: "flex",
            }}
          >
            <Icon sx={{ color: theme.palette[color].main }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              {label}
            </Typography>
            <Typography variant="h6" fontWeight="600" color={`${color}.main`}>
              {value}
            </Typography>
            {subValue && (
              <Typography variant="caption" color="text.secondary">
                {subValue}
              </Typography>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  const ChartCard = ({ title, icon: Icon, children }) => (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 3 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Icon color="primary" />
            <Typography variant="h6" fontWeight="600">
              {title}
            </Typography>
          </Box>
        </Stack>
        {children}
      </CardContent>
    </Card>
  );

  // Chart configurations and data
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 12,
        boxPadding: 8,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: theme.palette.divider,
        },
      },
    },
  };

  const donationTrendsData = {
    labels: donationTrends.map((trend) => trend.month),
    datasets: [
      {
        label: "Donations",
        data: donationTrends.map((trend) => trend.donations),
        backgroundColor: theme.palette.primary.main + "40",
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  };

  const volunteerTrendsData = {
    labels: volunteerTrends.map((trend) => trend.month),
    datasets: [
      {
        label: "Volunteers",
        data: volunteerTrends.map((trend) => trend.volunteers),
        fill: true,
        backgroundColor: theme.palette.success.main + "20",
        borderColor: theme.palette.success.main,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: theme.palette.success.main,
      },
    ],
  };

  const campaignStatusData = {
    labels: campaignStatus.map((status) => status.name),
    datasets: [
      {
        data: campaignStatus.map((status) => status.count),
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.success.main,
          theme.palette.warning.main,
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <Box sx={{ p: 3 }}>
      {isRefreshing && (
        <LinearProgress
          sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999 }}
        />
      )}

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="700" gutterBottom>
            Dashboard Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor your campaign performance and insights
          </Typography>
        </Box>
        <Tooltip title="Refresh Data">
          <IconButton
            onClick={handleRefresh}
            disabled={isRefreshing}
            sx={{
              bgcolor: "background.paper",
              boxShadow: theme.shadows[1],
              "&:hover": { bgcolor: "background.paper" },
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={3}>
        {/* Summary Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={CampaignIcon}
            label="Total Campaigns"
            value={isLoading ? <Skeleton width={60} /> : summaryData.totalCampaigns}
            subValue="Active campaigns"
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={DonationIcon}
            label="Total Donations"
            value={
              isLoading ? (
                <Skeleton width={60} />
              ) : (
                `$${summaryData.totalDonations?.toLocaleString()}`
              )
            }
            subValue="All time donations"
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={PeopleIcon}
            label="Total Volunteers"
            value={isLoading ? <Skeleton width={60} /> : summaryData.totalVolunteers}
            subValue="Registered volunteers"
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={VolunteerIcon}
            label="Active Volunteers"
            value={
              isLoading ? <Skeleton width={60} /> : summaryData.totalActiveVolunteers
            }
            subValue="Currently active"
            color="warning"
          />
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <ChartCard title="Donation Trends" icon={TimelineIcon}>
            {isLoading ? (
              <Skeleton variant="rectangular" height={300} />
            ) : (
              <Box sx={{ height: 300 }}>
                <Bar data={donationTrendsData} options={chartOptions} />
              </Box>
            )}
          </ChartCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <ChartCard title="Campaign Status" icon={DonutIcon}>
            {isLoading ? (
              <Skeleton variant="circular" height={300} width={300} />
            ) : (
              <Box sx={{ height: 300, display: "flex", justifyContent: "center" }}>
                <Doughnut
                  data={campaignStatusData}
                  options={{
                    ...chartOptions,
                    cutout: "70%",
                    plugins: {
                      legend: {
                        display: true,
                        position: "bottom",
                      },
                    },
                  }}
                />
              </Box>
            )}
          </ChartCard>
        </Grid>

        <Grid item xs={12}>
          <ChartCard title="Volunteer Activity" icon={AssessmentIcon}>
            {isLoading ? (
              <Skeleton variant="rectangular" height={300} />
            ) : (
              <Box sx={{ height: 300 }}>
                <Line
                  data={volunteerTrendsData}
                  options={{
                    ...chartOptions,
                    plugins: {
                      legend: {
                        display: true,
                        position: "top",
                      },
                    },
                  }}
                />
              </Box>
            )}
          </ChartCard>
        </Grid>

        {/* Campaign Donations */}
        <Grid item xs={12}>
          <ChartCard title="Recent Campaign Donations" icon={MonetizationOn}>
            {isLoading ? (
              <Stack spacing={2}>
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} height={60} />
                ))}
              </Stack>
            ) : (
              <Grid container spacing={2}>
                {campaignDonations.map((donation, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card
                      elevation={0}
                      sx={{
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                        p: 2,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {donation.campaignTitle}
                      </Typography>
                      <Typography variant="h6" color="success.main" fontWeight="600">
                        ${donation.donations.toLocaleString()}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </ChartCard>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;