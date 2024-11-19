import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  Box,
  Stack,
  Chip,
  Avatar,
  Pagination,
  LinearProgress,
} from "@mui/material";
import { useSelector } from "react-redux";
import { formatDate, formatDateTime } from "../../../common/utils";
import {
  Assessment as AssessmentIcon,
  PieChart as ChartIcon,
  People as PeopleIcon,
  MonetizationOn as MoneyIcon,
  CalendarToday as DateIcon,
  Person as PersonIcon,
  Payments as PaymentIcon,
  Timeline as TimelineIcon,
  CheckCircle as CheckIcon,
  HowToReg as RegisteredIcon,
} from "@mui/icons-material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const theme = useTheme();
  const campaignById = useSelector((state) => state.CampaignsReducer.campaignById);

  const {
    title,
    description,
    targetAmount,
    raisedAmount,
    startDate,
    endDate,
    donations,
    registrations,
  } = campaignById;

  const totalDonations = donations.reduce(
    (total, donation) => total + donation.amount,
    0
  );
  const checkedInVolunteers = registrations.filter(
    (reg) => reg.status === "checked-out"
  ).length;
  const registeredVolunteers = registrations.filter(
    (reg) => reg.status === "registered"
  ).length;

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

  // Prepare chart data
  const groupByDate = donations.reduce((acc, donation) => {
    const date = formatDate(donation.paymentDate);
    if (!acc[date]) acc[date] = 0;
    acc[date] += donation.amount;
    return acc;
  }, {});

  const donationChartData = Object.keys(groupByDate).map((date) => ({
    date,
    amount: groupByDate[date],
  }));

  donationChartData.sort((a, b) => new Date(a.date) - new Date(b.date));

  let cumulativeAmount = 0;
  const cumulativeData = donationChartData.map((data) => {
    cumulativeAmount += data.amount;
    return {
      ...data,
      cumulativeAmount,
    };
  });

  const chartData = {
    labels: cumulativeData.map((data) => data.date),
    datasets: [
      {
        label: "Cumulative Donations",
        data: cumulativeData.map((data) => data.cumulativeAmount),
        fill: true,
        backgroundColor: `${theme.palette.primary.main}15`,
        borderColor: theme.palette.primary.main,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: theme.palette.primary.main,
      },
    ],
  };

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

  return (
    <Box>
      {/* Statistics Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={MoneyIcon}
            label="Total Donations"
            value={`$${totalDonations.toLocaleString()}`}
            subValue="Campaign total"
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={PeopleIcon}
            label="Total Volunteers"
            value={registrations.length}
            subValue="Registered volunteers"
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={RegisteredIcon}
            label="Active Volunteers"
            value={registeredVolunteers}
            subValue="Currently registered"
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={CheckIcon}
            label="Completed"
            value={checkedInVolunteers}
            subValue="Checked-out volunteers"
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Donations Chart */}
      <Card
        elevation={0}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          mb: 4,
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
              <TimelineIcon color="primary" />
              <Typography variant="h6" fontWeight="600">
                Donation Trends
              </Typography>
            </Box>
            <Chip
              icon={<DateIcon />}
              label={`${formatDate(startDate)} - ${formatDate(endDate)}`}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Stack>
          <Box sx={{ height: 300, width: "100%" }}>
            <Line data={chartData} options={chartOptions} />
          </Box>
        </CardContent>
      </Card>

      {/* Tables Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 3,
                }}
              >
                <PeopleIcon color="primary" />
                Volunteer Registrations
              </Typography>
              <VolunteerRegistrations
                registrations={registrations}
                theme={theme}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 3,
                }}
              >
                <PaymentIcon color="primary" />
                Recent Donations
              </Typography>
              <Donations donations={donations} theme={theme} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

const VolunteerRegistrations = ({ registrations, theme }) => {
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const startIndex = (page - 1) * rowsPerPage;
  const currentRegistrations = registrations.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const getStatusChip = (status) => {
    const statusConfig = {
      registered: {
        label: "Registered",
        color: "primary",
        icon: <RegisteredIcon sx={{ fontSize: 16 }} />,
      },
      "checked-out": {
        label: "Completed",
        color: "success",
        icon: <CheckIcon sx={{ fontSize: 16 }} />,
      },
      default: {
        label: status,
        color: "default",
        icon: <PersonIcon sx={{ fontSize: 16 }} />,
      },
    };

    const config = statusConfig[status] || statusConfig.default;

    return (
      <Chip
        label={config.label}
        color={config.color}
        icon={config.icon}
        size="small"
        variant="outlined"
      />
    );
  };

  return (
    <>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Volunteer</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRegistrations.map((registration) => (
              <TableRow key={registration._id}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        bgcolor: theme.palette.primary.main,
                        fontSize: "0.875rem",
                      }}
                    >
                      {registration.volunteer.firstname[0]}
                    </Avatar>
                    <Typography variant="body2">
                      {registration.volunteer.firstname}{" "}
                      {registration.volunteer.lastname}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  {getStatusChip(registration.status)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          pt: 2,
        }}
      >
        <Pagination
          count={Math.ceil(registrations.length / rowsPerPage)}
          page={page}
          onChange={(e, p) => setPage(p)}
          size="small"
        />
      </Box>
    </>
  );
};

const Donations = ({ donations, theme }) => {
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const startIndex = (page - 1) * rowsPerPage;
  const currentDonations = donations.slice(startIndex, startIndex + rowsPerPage);

  return (
    <>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Donor</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentDonations.map((donation) => (
              <TableRow key={donation._id}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        bgcolor: theme.palette.success.main,
                        fontSize: "0.875rem",
                      }}
                    >
                      {donation.userId?.firstname[0]}
                    </Avatar>
                    <Typography variant="body2">
                      {donation.userId?.firstname} {donation.userId?.lastname}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="body2"
                    color="success.main"
                    fontWeight="600"
                  >
                    ${donation.amount.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" color="text.secondary">
                    {formatDateTime(donation.paymentDate)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          pt: 2,
        }}
      >
        <Pagination
          count={Math.ceil(donations.length / rowsPerPage)}
          page={page}
          onChange={(e, p) => setPage(p)}
          size="small"
        />
      </Box>
    </>
  );
};

export default Reports;