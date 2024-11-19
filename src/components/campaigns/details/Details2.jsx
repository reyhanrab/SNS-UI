import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tabs,
  Tab,
  Typography,
  Divider,
  Button,
  Box,
  useTheme,
  IconButton,
  Tooltip,
  Chip,
  Alert,
  Fade,
  LinearProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  Campaign as CampaignIcon,
  Assessment as AssessmentIcon,
  Download as DownloadIcon,
  HowToReg as HowToRegIcon,
  VolunteerActivism as VolunteerIcon,
  MonetizationOn as DonateIcon,
} from "@mui/icons-material";
// import CampaignDetails from "./CampaignDetails";
import CampaignDetails from "./CampaignDetails2";

import CampaignReport from "./CampaignReport";
import { useDispatch, useSelector } from "react-redux";
import { GETCAMPAIGNBYID } from "../../../actions/campaigns/ActionCreators";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "jspdf-autotable";

const TabPanel = ({ children, value, index, ...other }) => (
  <Fade in={value === index}>
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`campaign-details-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  </Fade>
);

const Details = ({ open, onClose, campaignData, onRegister, onDonate }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const registrationsData = useSelector((state) => state.RegistrationsReducer.registrationsData);
  const campaignById = useSelector((state) => state.CampaignsReducer.campaignById);

  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(false);

  const registeredCampaignIds = registrationsData.map((reg) => reg.campaign._id);
  const isRegistered = registeredCampaignIds.includes(campaignData._id);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await dispatch(GETCAMPAIGNBYID(campaignData?._id));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [campaignData?._id, dispatch]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const generateReportPDF = async () => {
    setDownloadProgress(true);
    try {
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

      const doc = new jsPDF();

      // Header
      doc.setFillColor(theme.palette.primary.main);
      doc.rect(0, 0, doc.internal.pageSize.getWidth(), 20, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text("Campaign Report", 10, 13);
      doc.setTextColor(0, 0, 0);

      // Campaign Overview
      doc.setFontSize(14);
      doc.text("Campaign Overview", 10, 30);
      doc.setFontSize(10);
      doc.text(`Title: ${title}`, 10, 40);
      doc.text(`Description: ${description}`, 10, 45);
      doc.text(`Target Amount: $${targetAmount.toLocaleString()}`, 10, 50);
      doc.text(
        `Raised Amount: $${raisedAmount.toLocaleString()} (${Math.round(
          (raisedAmount / targetAmount) * 100
        )}%)`,
        10,
        55
      );
      doc.text(
        `Campaign Duration: ${new Date(startDate).toLocaleDateString()} to ${new Date(
          endDate
        ).toLocaleDateString()}`,
        10,
        60
      );

      // Registration Table
      doc.setFontSize(14);
      doc.text("Volunteer Registrations", 10, 75);

      const volunteerTableData = registrations.map((reg) => [
        `${reg.volunteer.firstname} ${reg.volunteer.lastname}`,
        reg.status,
        new Date(reg.registrationDate).toLocaleDateString(),
      ]);

      doc.autoTable({
        startY: 80,
        head: [["Volunteer Name", "Status", "Registration Date"]],
        body: volunteerTableData,
        theme: "grid",
        styles: { fontSize: 9 },
        headStyles: { fillColor: theme.palette.primary.main },
      });

      // Donations Table
      doc.setFontSize(14);
      doc.text("Donations", 10, doc.lastAutoTable.finalY + 15);

      const donationsTableData = donations?.map((donation) => [
        `${donation.userId.firstname} ${donation.userId.lastname}`,
        `$${donation.amount.toLocaleString()}`,
        new Date(donation.paymentDate).toLocaleDateString(),
      ]);

      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 20,
        head: [["Donor Name", "Amount", "Payment Date"]],
        body: donationsTableData,
        theme: "grid",
        styles: { fontSize: 9 },
        headStyles: { fillColor: theme.palette.primary.main },
      });

      // Chart
      const chartElement = document.getElementById("report");
      if (chartElement) {
        const canvas = await html2canvas(chartElement);
        const imgData = canvas.toDataURL("image/png");
        doc.addPage();
        doc.text("Donation Trends", 10, 20);
        doc.addImage(imgData, "PNG", 10, 30, 190, 100);
      }

      doc.save(`${title}-report.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setDownloadProgress(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        elevation: 0,
        sx: {
          borderRadius: 2,
          minHeight: "80vh",
        },
      }}
    >
      {loading && <LinearProgress sx={{ position: "absolute", top: 0, left: 0, right: 0 }} />}

      {/* Custom Header */}
      <DialogTitle
        sx={{
          p: 0,
          background: `linear-gradient(45deg, ${theme.palette.primary.main}15, ${theme.palette.primary.light}15)`,
        }}
      >
        <Box sx={{ px: 3, pt: 2, pb: 0 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CampaignIcon sx={{ fontSize: 28, color: theme.palette.primary.main }} />
              <Typography variant="h6" fontWeight="600">
                Campaign Information
              </Typography>
            </Box>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              "& .MuiTab-root": {
                minHeight: 48,
                textTransform: "none",
                fontSize: "0.95rem",
                fontWeight: 500,
              },
            }}
          >
            <Tab
              icon={<CampaignIcon sx={{ mr: 1 }} />}
              label="Campaign Details"
              iconPosition="start"
            />
            <Tab
              icon={<AssessmentIcon sx={{ mr: 1 }} />}
              label="Campaign Report"
              iconPosition="start"
            />
          </Tabs>
        </Box>
        <Divider sx={{ mt: 1 }} />
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ px: 3, py: 0 }}>
        <TabPanel value={activeTab} index={0}>
          <CampaignDetails
            campaignData={campaignData}
            onRegister={onRegister}
            onDonate={onDonate}
          />
          {isRegistered && (
            <Alert icon={<HowToRegIcon />} severity="info" sx={{ mt: 2, borderRadius: 2 }}>
              You are already registered for this campaign. We look forward to your participation!
            </Alert>
          )}
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <CampaignReport />
        </TabPanel>
      </DialogContent>

      <Divider />

      {/* Actions */}

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          gap: 1,
        }}
      >
        {/* <Box sx={{ flex: 1 }}>
          <Chip
            icon={<CampaignIcon />}
            label={`Campaign ID: ${campaignData._id}`}
            variant="outlined"
            size="small"
          />
        </Box> */}

        <Button onClick={onClose} variant="outlined" color="inherit" startIcon={<CloseIcon />}>
          Close
        </Button>

        {activeTab === 1 && (
          <Tooltip title="Download Campaign Report">
            <Button
              variant="outlined"
              color="primary"
              onClick={generateReportPDF}
              disabled={downloadProgress}
              startIcon={<DownloadIcon />}
            >
              {downloadProgress ? "Generating..." : "Download Report"}
            </Button>
          </Tooltip>
        )}

        {(localStorage.getItem("role") === "admin" ||
          localStorage.getItem("role") === "volunteer") &&
          activeTab === 0 &&
          !registeredCampaignIds.includes(campaignData._id) && (
            <Tooltip title="Register for this campaign">
              <Button
                onClick={() => onRegister(campaignData._id)}
                variant="contained"
                color="primary"
                startIcon={<VolunteerIcon />}
              >
                Register
              </Button>
            </Tooltip>
          )}

        {(localStorage.getItem("role") === "admin" || localStorage.getItem("role") === "donor") &&
          !registeredCampaignIds.includes(campaignData) &&
          activeTab === 0 && (
            <Tooltip title="Make a donation">
              <Button
                onClick={() => onDonate(campaignData)}
                variant="contained"
                color="success"
                startIcon={<DonateIcon />}
              >
                Donate
              </Button>
            </Tooltip>
          )}
      </DialogActions>

      {downloadProgress && (
        <LinearProgress sx={{ position: "absolute", bottom: 0, left: 0, right: 0 }} />
      )}
    </Dialog>
  );
};

export default Details;
