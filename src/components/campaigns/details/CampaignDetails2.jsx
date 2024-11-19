import React from "react";
import {
  Grid,
  Box,
  Typography,
  LinearProgress,
  Chip,
  Card,
  CardContent,
  useTheme,
  Divider,
  Stack,
} from "@mui/material";
import {
  CalendarToday as CalendarIcon,
  AccountBalance as TargetIcon,
  MonetizationOn as RaisedIcon,
  Description as DescriptionIcon,
  Campaign as CampaignIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Timer as TimeIcon,
} from "@mui/icons-material";
import { formatDate } from "../../../common/utils";

const CampaignDetails = ({ campaignData }) => {
  const theme = useTheme();

  const calculateProgress = (raised, target) => {
    if (!target || target <= 0) return 0;
    return Math.min((raised / target) * 100, 100);
  };

  const progress = calculateProgress(
    campaignData.raisedAmount,
    campaignData.targetAmount
  );

  const InfoCard = ({ icon: Icon, label, value, color = "primary" }) => (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: `1px solid ${theme.palette.divider}`,
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
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon sx={{ color: theme.palette[color].main }} />
          </Box>
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
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
    <Box>
      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: theme.palette.primary.main,
            fontWeight: 600,
          }}
        >
          <CampaignIcon /> {campaignData.title}
        </Typography>
        <Chip
          icon={campaignData.isActive ? <ActiveIcon /> : <InactiveIcon />}
          label={campaignData.isActive ? "Active Campaign" : "Inactive Campaign"}
          color={campaignData.isActive ? "success" : "default"}
          variant="outlined"
          size="small"
        />
      </Box>

      <Grid container spacing={3}>
        {/* Description Section */}
        <Grid item xs={12}>
          <Card
            elevation={0}
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              mb: 3,
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <DescriptionIcon color="primary" />
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Campaign Description
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: "pre-line",
                      maxHeight: 150,
                      overflow: "auto",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {campaignData.description}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Progress Section */}
        <Grid item xs={12}>
          <Card
            elevation={0}
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              mb: 3,
            }}
          >
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Fundraising Progress
                </Typography>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <Typography variant="h6" color="primary" fontWeight="600">
                    ${campaignData.raisedAmount?.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    of ${campaignData.targetAmount?.toLocaleString()}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: theme.palette.grey[200],
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 4,
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 0.5, display: "block", textAlign: "right" }}
                >
                  {Math.round(progress)}% Completed
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Info Cards */}
        <Grid item xs={12} sm={6}>
          <InfoCard
            icon={TargetIcon}
            label="Target Amount"
            value={`$${campaignData.targetAmount?.toLocaleString()}`}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InfoCard
            icon={RaisedIcon}
            label="Raised Amount"
            value={`$${campaignData.raisedAmount?.toLocaleString()}`}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InfoCard
            icon={CalendarIcon}
            label="Start Date"
            value={formatDate(campaignData.startDate)}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InfoCard
            icon={TimeIcon}
            label="End Date"
            value={formatDate(campaignData.endDate)}
            color="warning"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CampaignDetails;