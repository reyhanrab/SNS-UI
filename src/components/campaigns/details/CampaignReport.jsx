import React, { forwardRef, useState } from "react";
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
  tableCellClasses,
  styled,
  Pagination,
} from "@mui/material";
import { useSelector } from "react-redux";
import { formatDate, formatDateTime } from "../../../common/utils";
import {
  Info as InfoIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
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


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const Reports = () => {
  const campaignById = useSelector((state) => state.CampaignsReducer.campaignById);

  // Extract campaign data
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

  // Calculate total donations
  const totalDonations = raisedAmount;

  // Volunteer statistics
  const checkedInVolunteers = registrations.filter((reg) => reg.status === "checked-in").length;
  const checkedOutVolunteers = registrations.filter((reg) => reg.status === "checked-out").length;
  const registeredVolunteers = registrations.filter((reg) => reg.status === "registered").length;

  // Group donations by date and calculate the cumulative donation
  const groupByDate = donations.reduce((acc, donation) => {
    const date = formatDate(donation.paymentDate);
    if (!acc[date]) acc[date] = 0;
    acc[date] += donation.amount;
    return acc;
  }, {});

  // Convert the grouped donations into an array for the chart
  const donationChartData = Object.keys(groupByDate).map((date) => ({
    date,
    amount: groupByDate[date],
  }));

  // Sort data by date
  donationChartData.sort((a, b) => formatDate(a.date) - formatDate(b.date));

  // Calculate cumulative donations in correct order
  let cumulativeAmount = 0;
  const cumulativeData = donationChartData.map((data) => {
    cumulativeAmount += data.amount;
    return {
      ...data,
      cumulativeAmount,
    };
  });

  // Format dates
  const startDateFormatted = new Date(startDate).toLocaleDateString();
  const endDateFormatted = new Date(endDate).toLocaleDateString();

    // Chart.js data
    const chartData = {
      labels: cumulativeData.map((data) => data.date),
      datasets: [
        {
          label: "Cumulative Donations",
          data: cumulativeData.map((data) => data.cumulativeAmount),
          fill: false,
          borderColor: "#82ca9d",
          tension: 0.1,
        },
      ],
    };  

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Campaign Report: {title}
      </Typography>

      <Grid container spacing={3}>
        {/* Campaign Overview Card */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2, backgroundColor: "#f4f7fa", padding: 3 }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}
              >
                <InfoIcon sx={{ marginRight: 1, color: "#3f51b5" }} />
                Campaign Overview
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: 1 }}>
                <strong>Description:</strong> {description}
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: 1 }}>
                <strong>Target Amount:</strong> ${targetAmount}
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: 1 }}>
                <strong>Raised Amount:</strong> ${raisedAmount}
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: 1 }}>
                <strong>Total Donations:</strong> ${totalDonations}
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: 2 }}>
                <strong>Campaign Duration:</strong> {startDateFormatted} to {endDateFormatted}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Volunteer Statistics Card */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2, backgroundColor: "#f4f7fa", padding: 3 }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}
              >
                <PeopleIcon sx={{ marginRight: 1, color: "#3f51b5" }} />
                Volunteer Statistics
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: 1 }}>
                <strong>Registered Volunteers:</strong> {registeredVolunteers}
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: 1 }}>
                <strong>Checked-in Volunteers:</strong> {checkedInVolunteers}
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: 1 }}>
                <strong>Checked-out Volunteers:</strong> {checkedOutVolunteers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Donations Cumulative Trend Chart */}
        <Grid item xs={12}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ display: "flex", alignItems: "center", color: "#3f51b5" }}
              >
                <MoneyIcon sx={{ marginRight: 1 }} />
                Cumulative Donation Trend
              </Typography>
              <Line data={chartData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Volunteer Table */}
      <VolunteerRegistrations registrations={registrations} />

      {/* Donations Table */}
      <Donations donations={donations} />
    </div>
  );
};

export default Reports;

const VolunteerRegistrations = ({ registrations }) => {
  const [page, setPage] = useState(1); // current page (1-based index)
  const rowsPerPage = 5; // records per page

  const headers = [
    { id: "firstname", label: "Volunteer Name" },
    { id: "status", label: "Status" },
  ];

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Slice registrations based on the current page and rows per page
  const startIndex = (page - 1) * rowsPerPage;
  const currentRegistrations = registrations.slice(startIndex, startIndex + rowsPerPage);

  return (
    <>
      <Typography variant="h5" gutterBottom style={{ marginTop: "20px" }}>
        Volunteer Registration
      </Typography>
      <TableContainer component={Paper} sx={{ backgroundColor: "white" }}>
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableCell
                  key={header.id}
                  sx={{
                    backgroundColor: "#1976d2",
                    color: "#fff",
                  }}
                >
                  {header.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRegistrations.map((registration) => (
              <StyledTableRow
                key={registration._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <StyledTableCell>
                  {registration.volunteer.firstname} {registration.volunteer.lastname}
                </StyledTableCell>
                <StyledTableCell>{registration.status}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={Math.ceil(registrations.length / rowsPerPage)} // Calculate total pages
        page={page}
        onChange={handleChangePage}
        color="primary"
        sx={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      />
    </>
  );
};

const Donations = ({ donations }) => {
  const [page, setPage] = useState(1); // current page (1-based index)
  const rowsPerPage = 5; // records per page

  const headers = [
    { id: "cardHolderName", label: "Donor Name" },
    { id: "amount", label: "Amount" },
    { id: "paymentDate", label: "Payment Date" },
  ];

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Slice donations based on the current page and rows per page
  const startIndex = (page - 1) * rowsPerPage;
  const currentDonations = donations.slice(startIndex, startIndex + rowsPerPage);
  return (
    <>
      <Typography variant="h5" gutterBottom style={{ marginTop: "20px" }}>
        Donations Details
      </Typography>
      <TableContainer component={Paper} sx={{ backgroundColor: "white" }}>
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableCell
                  key={header.id}
                  sx={{
                    backgroundColor: "#1976d2",
                    color: "#fff",
                  }}
                >
                  {header.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {currentDonations.map((donation) => (
              <StyledTableRow
                key={donation._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <StyledTableCell>{`${donation?.userId?.firstname} ${donation?.userId?.lastname}`}</StyledTableCell>
                <StyledTableCell>${donation.amount}</StyledTableCell>
                <StyledTableCell>{formatDateTime(donation.paymentDate)}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={Math.ceil(donations.length / rowsPerPage)} // Calculate total pages
        page={page}
        onChange={handleChangePage}
        color="primary"
        sx={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      />
    </>
  );
};
