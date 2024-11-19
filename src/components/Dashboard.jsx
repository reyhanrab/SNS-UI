import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Paper, Typography, Box, Skeleton, Card, CardContent, Divider } from "@mui/material";
import {
  GETSUMMARYDATA,
  GETCAMPAIGNSTATUS,
  GETDONATIONTRENDS,
  GETVOLUNTEERTRENDS,
  GETCAMPAIGNDONATIONS,
} from "../actions/dashboard/ActionCreators"; // Adjust the import path

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Dashboard() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  // Redux selectors
  const summaryData = useSelector((state) => state.DashboardReducer.summaryData || {});
  const campaignStatus = useSelector((state) => state.DashboardReducer.campaignStatus || []);
  const donationTrends = useSelector((state) => state.DashboardReducer.donationTrends || []);
  const volunteerTrends = useSelector((state) => state.DashboardReducer.volunteerTrends || []);
  const campaignDonations = useSelector((state) => state.DashboardReducer.campaignDonations || []);

  useEffect(() => {
    // Dispatch actions to fetch data
    dispatch(GETSUMMARYDATA());
    dispatch(GETCAMPAIGNSTATUS());
    dispatch(GETDONATIONTRENDS());
    dispatch(GETVOLUNTEERTRENDS());
    dispatch(GETCAMPAIGNDONATIONS());
  }, [dispatch]);

  useEffect(() => {
    // Determine loading state
    if (summaryData && donationTrends.length && volunteerTrends.length && campaignStatus.length) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [summaryData, donationTrends, volunteerTrends, campaignStatus]);

  // Chart.js data for Donation Trends
  const donationTrendsData = {
    labels: donationTrends.map((trend) => trend.month),
    datasets: [
      {
        label: "Donations",
        data: donationTrends.map((trend) => trend.donations),
        backgroundColor: donationTrends.map((_, index) =>
          // Assign a color from the gradient array to each bar
          ["rgba(255, 99, 132, 0.5)", "rgba(54, 162, 235, 0.5)", "rgba(255, 206, 86, 0.5)", "rgba(75, 192, 192, 0.5)"][index % 4]
        ),
        borderColor: donationTrends.map((_, index) =>
          // Assign corresponding darker border color to each bar
          ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)"][index % 4]
        ),
        borderWidth: 1, // Thickness of the border
      },
    ],
  };
  

  // Chart.js data for Volunteer Trends
  const volunteerTrendsData = {
    labels: volunteerTrends.map((trend) => trend.month),
    datasets: [
      {
        label: "Volunteers",
        data: volunteerTrends.map((trend) => trend.volunteers),
        fill: true, // Enable fill below the line
        backgroundColor: "rgba(75, 192, 192, 0.2)", // Light green gradient-like fill
        borderColor: "rgba(75, 192, 192, 1)", // Green for the line
        pointBackgroundColor: volunteerTrends.map((_, index) =>
          ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)"][index % 4]
        ),
        pointBorderColor: "rgba(0, 0, 0, 0.2)", // Dark border for points
        tension: 0.4, // Smooth curve
        borderWidth: 2, // Line thickness
        pointRadius: 5, // Size of the points
      },
    ],
  };
  
  // Chart.js data for Campaign Status
  const campaignStatusData = {
    labels: campaignStatus.map((status) => status.name),
    datasets: [
      {
        data: campaignStatus.map((status) => status.count),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"], // Example colors
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        borderWidth: 1, // Optional: Add a border
      },
    ],
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h3" gutterBottom>
        Scope N' Stack Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Summary Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Summary
              </Typography>
              <Divider sx={{ marginBottom: 2 }} />
              {isLoading ? (
                <>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="40%" />
                </>
              ) : (
                <Box sx={{ marginTop: 2 }}>
                  <Typography variant="subtitle1">
                    Total Campaigns: {summaryData.totalCampaigns}
                  </Typography>
                  <Typography variant="subtitle1">
                    Total Donations: {summaryData.totalDonations}
                  </Typography>
                  <Typography variant="subtitle1">
                    Total Volunteers: {summaryData.totalVolunteers}
                  </Typography>
                  <Typography variant="subtitle1">
                    Active Volunteers: {summaryData.totalActiveVolunteers}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Donation Trends Bar Chart */}
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Donation Trends
              </Typography>
              <Divider sx={{ marginBottom: 2 }} />
              {isLoading ? (
                <Skeleton variant="rectangular" width="100%" height={300} />
              ) : (
                <Bar data={donationTrendsData} options={{ responsive: true }} />
              )}
            </CardContent>
          </Card>
        </Grid>
        {/* Volunteer Trends Line Chart */}
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Volunteer Trends
              </Typography>
              <Divider sx={{ marginBottom: 2 }} />
              {isLoading ? (
                <Skeleton variant="rectangular" width="100%" height={300} />
              ) : (
                <Bar data={volunteerTrendsData} options={{ responsive: true }} />
              )}
            </CardContent>
          </Card>
        </Grid>
        {/* Campaign Status Pie Chart */}
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Campaign Status
              </Typography>
              <Divider sx={{ marginBottom: 2 }} />
              {isLoading ? (
                <Skeleton variant="rectangular" width="100%" height={300} />
              ) : (
                <Doughnut data={campaignStatusData} options={{ responsive: true }} />
              )}
            </CardContent>
          </Card>
        </Grid>
        ;{/* Campaign Donations Section */}
        <Grid item xs={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Campaign Donations
              </Typography>
              <Divider sx={{ marginBottom: 2 }} />
              {isLoading ? (
                <>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="40%" />
                </>
              ) : (
                <Box sx={{ marginTop: 2 }}>
                  {campaignDonations.length > 0 ? (
                    campaignDonations.map((donation, index) => (
                      <Box key={index} sx={{ marginBottom: 2 }}>
                        <Typography variant="subtitle1">
                          Campaign: {donation.campaignTitle}
                        </Typography>
                        <Typography variant="subtitle1">
                          Donations: ${donation.donations}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="subtitle1">No campaign donations available.</Typography>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
