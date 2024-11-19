import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Paper, Typography, Box, Skeleton, Card, CardContent, Divider } from "@mui/material";
import {
  GETSUMMARYDATA,
  GETCAMPAIGNSTATUS,
  GETDONATIONTRENDS,
  GETVOLUNTEERTRENDS,
  GETCAMPAIGNDONATIONS,
} from "../actions/dashboard/ActionCreators"; // Adjust the import path to your actions
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const dispatch = useDispatch();
  const [donationChartData, setDonationChartData] = useState([]);
  const [volunteerChartData, setVolunteerChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  // Fetch data from the Redux store with safe defaults
  const summaryData = useSelector((state) => state.DashboardReducer.summaryData || {});
  const campaignStatus = useSelector((state) => state.DashboardReducer.campaignStatus || []);
  const donationTrends = useSelector((state) => state.DashboardReducer.donationTrends || []);
  const volunteerTrends = useSelector((state) => state.DashboardReducer.volunteerTrends || []);
  const campaignDonations = useSelector((state) => state.DashboardReducer.campaignDonations || []);

  // Dispatch actions to fetch data on component mount
  useEffect(() => {
    dispatch(GETSUMMARYDATA());
    dispatch(GETCAMPAIGNSTATUS());
    dispatch(GETDONATIONTRENDS());
    dispatch(GETVOLUNTEERTRENDS());
    dispatch(GETCAMPAIGNDONATIONS());
  }, []);

  useEffect(() => {
    if (summaryData && donationTrends.length && volunteerTrends.length && campaignStatus) {
      // Set loading to false once all data is available
      setIsLoading(false);
    } else {
      // Keep loading true until the required data is fetched
      setIsLoading(true);
    }

    // Donation Trends Chart Data (Bar Chart)
    if (donationTrends.length > 0) {
      setDonationChartData(
        donationTrends?.map((trend) => ({
          month: trend.month,
          amount: trend.donations,
        }))
      );
    }
    if (volunteerTrends.length > 0) {
      // Volunteer Trends Chart Data (Line Chart)
      setVolunteerChartData(
        volunteerTrends?.map((trend) => ({
          month: trend.month,
          count: trend.volunteers,
        }))
      );
    }
  }, [donationTrends, volunteerTrends, summaryData, campaignStatus]);

  console.log("campaignStatus", campaignStatus);

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
                    Total Active Volunteers: {summaryData.totalActiveVolunteers}
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
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={donationChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="amount"
                      fill="#8884d8" // Bar fill color (light blue)
                      stroke="#3e5b96" // Darker blue for the stroke
                      strokeWidth={2} // Optional: make the stroke thicker
                    />
                  </BarChart>
                </ResponsiveContainer>
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
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={volunteerChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      type="monotone"
                      dataKey="count"
                      fill="#82ca9d" // Bar fill color
                      stroke="#4b8c42" // Darker shade of green for the stroke
                      strokeWidth={2} // Optional: make the stroke a bit thicker
                    />
                  </BarChart>
                </ResponsiveContainer>
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
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={campaignStatus}
                      dataKey="count"
                      nameKey="name"
                      outerRadius={150}
                      fill="#8884d8"
                      label
                    >
                      {campaignStatus.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={["#FF6384", "#36A2EB", "#FFCE56"][index]}
                        />
                      ))}
                    </Pie>

                    {/* Tooltip that will show values on hover */}
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Campaign Donations Section */}
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
