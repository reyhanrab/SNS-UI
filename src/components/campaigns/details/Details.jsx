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
} from "@mui/material";
import CampaignDetails from "./CampaignDetails";
import CampaignReport from "./CampaignReport";
import { useDispatch, useSelector } from "react-redux";
import { GETCAMPAIGNBYID } from "../../../actions/campaigns/ActionCreators";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "jspdf-autotable";

const Details = ({ open, onClose, campaignData, onRegister, onDonate }) => {
  const dispatch = useDispatch();

  const campaignById = useSelector((state) => state.CampaignsReducer.campaignById);

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    dispatch(GETCAMPAIGNBYID(campaignData?._id));
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const generateReportPDF = () => {
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

    // Calculate additional metrics
    const totalDonations = donations?.reduce((sum, donation) => sum + donation.amount, 0);
    const startDateFormatted = new Date(startDate).toLocaleDateString();
    const endDateFormatted = new Date(endDate).toLocaleDateString();

    const doc = new jsPDF();

    // 1. Campaign Overview
    doc.setFontSize(16);
    doc.text("Campaign Report", 10, 10);
    doc.setFontSize(12);
    doc.text(`Title: ${title}`, 10, 20);
    doc.text(`Description: ${description}`, 10, 30);
    doc.text(`Target Amount: $${targetAmount}`, 10, 40);
    doc.text(`Raised Amount: $${raisedAmount}`, 10, 50);
    doc.text(`Total Donations: $${totalDonations}`, 10, 60);
    doc.text(`Campaign Duration: ${startDateFormatted} to ${endDateFormatted}`, 10, 70);

    // 2. Volunteer Registrations Table
    const volunteerTableData = registrations.map((reg) => [
      `${reg.volunteer.firstname} ${reg.volunteer.lastname}`,
      reg.status,
    ]);

    doc.autoTable({
      startY: 80,
      head: [["Volunteer Name", "Status"]],
      body: volunteerTableData,
      theme: "grid",
      styles: { fontSize: 10 },
    });

    // 3. Donations Table
    const donationsTableData = donations?.map((donation) => [
      `${donation.userId.firstname} ${donation.userId.lastname}`,
      `$${donation.amount}`,
      new Date(donation.paymentDate).toLocaleDateString(),
    ]);

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Donor Name", "Amount", "Payment Date"]],
      body: donationsTableData,
      theme: "grid",
      styles: { fontSize: 10 },
    });

    // 4. Cumulative Donation Trend Chart
    const chartElement = document.getElementById("report"); // Placeholder
    if (chartElement) {
      html2canvas(chartElement).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        doc.addImage(imgData, "PNG", 10, doc.lastAutoTable.finalY + 20, 190, 90);
        doc.save(`${title}-report.pdf`);
      });
    } else {
      doc.save(`${title}-report.pdf`);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth={"lg"} fullWidth>
      {/* Tabs in Dialog Title */}
      <DialogTitle>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          centered
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Details" />
          <Tab label="Report" />
        </Tabs>
      </DialogTitle>

      <Divider />

      {/* Dialog Content */}
      <DialogContent>
        {activeTab === 0 && (
          <>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                mb: 2,
                textAlign: "center",
              }}
            >
              Campaign Details
            </Typography>
            <CampaignDetails
              campaignData={campaignData}
              onRegister={onRegister}
              onDonate={onDonate}
            />
          </>
        )}

        {activeTab === 1 && (
          <>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                mb: 2,
                textAlign: "center",
              }}
            >
              Campaign Report
            </Typography>
            <CampaignReport />
          </>
        )}
      </DialogContent>

      <Divider />

      {/* Dialog Actions */}
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Close
        </Button>
        {(localStorage.getItem("role") === "admin" ||
          localStorage.getItem("role") === "volunteer") &&
          !registeredCampaignIds.includes(campaignData._id) && (
            <Button
              onClick={() => onRegister(campaignData._id)}
              variant="contained"
              color="primary"
            >
              Register
            </Button>
          )}
        {(localStorage.getItem("role") === "admin" || localStorage.getItem("role") === "donor") &&
          !registeredCampaignIds.includes(campaignData) && (
            <Button onClick={() => onDonate(campaignData)} variant="contained" color="primary">
              Donate
            </Button>
          )}
        {activeTab === 1 && (
          <Button variant="contained" color="primary" onClick={() => generateReportPDF()}>
            Download PDF
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default Details;
