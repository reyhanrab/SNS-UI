/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Container,
  Paper,
  Fade,
  Zoom,
  IconButton,
  Tooltip,
  Divider,
  useTheme,
} from "@mui/material";
import {
  Add as AddIcon,
  Campaign as CampaignIcon,
  History as HistoryIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import {
  ADDCAMPAIGNSDATA,
  EDITCAMPAIGNSDATA,
  REGISTERFORCAMPAGIN,
} from "../../actions/campaigns/ActionCreators";
// import ViewCampaign from "./view/ViewCampaign";
import ViewCampaign from "./view/ViewCampaign2";

// import CreateCampaign from "./create/CreateCampaign";
import CreateCampaign from "./create/CreateCampaign2";

// import UpdateCampaign from "./update/UpdateCampaign";
import UpdateCampaign from "./update/UpdateCampaign2";

// import ViewHistoricalCampaign from "./view/ViewHistoricalCampaign";
import ViewHistoricalCampaign from "./view/ViewHistoricalCampaign2";

// import Registrations from "../Registrations/Registrations";
import Registrations from "../Registrations/Registrations2";

// import Details from "./details/Details";
import Details from "./details/Details2";


function TabPanel({ children, value, index, ...other }) {
  return (
    <Fade in={value === index}>
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`campaign-tabpanel-${index}`}
        aria-labelledby={`campaign-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    </Fade>
  );
}

const MemoizedRegistrations = React.memo(Registrations);

function Campaigns() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [createModal, setCreateModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle various modals
  const handleCreateModal = () => setCreateModal(!createModal);
  const handleUpdateModal = (obj = {}) => {
    setSelectedRow(obj);
    setUpdateModal(!updateModal);
  };
  const handleDetailsModal = (obj = {}) => {
    setSelectedRow(obj);
    setDetailsModal(!detailsModal);
  };

  // Handle API calls
  const handleCreateCampaign = (obj) => {
    dispatch(ADDCAMPAIGNSDATA(obj, handleCreateModal));
  };

  const handleUpdateCampaign = (obj) => {
    dispatch(EDITCAMPAIGNSDATA(obj?._id, obj, handleUpdateModal));
  };

  const handleCampaignRegistration = (id) => {
    dispatch(
      REGISTERFORCAMPAGIN(
        id,
        localStorage.getItem("userId"),
        handleDetailsModal
      )
    );
  };

  const handleDonation = (obj) => {
    navigate(`/dashboard/donate/${obj._id}`);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Add your refresh logic here
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Handling tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const MemoizedViewCampaign = React.memo(ViewCampaign);
  const MemoizedViewHistoricalCampaign = React.memo(ViewHistoricalCampaign);

  return (
    <Container maxWidth="xl">
      <Paper
        elevation={2}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          minHeight: "calc(100vh - 100px)",
          mt: 3,
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            backgroundColor: theme.palette.background.default,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 3,
              py: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <CampaignIcon
                sx={{ fontSize: 32, color: theme.palette.primary.main }}
              />
              <Typography variant="h5" fontWeight="600">
                Campaigns
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Tooltip title="Refresh">
                <IconButton
                  onClick={handleRefresh}
                  sx={{
                    animation: isRefreshing ? "spin 1s linear infinite" : "",
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Zoom in={true}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateModal}
                  sx={{
                    borderRadius: "8px",
                    textTransform: "none",
                    px: 3,
                  }}
                >
                  Create Campaign
                </Button>
              </Zoom>
            </Box>
          </Box>

          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              px: 3,
              "& .MuiTab-root": {
                minHeight: 48,
                textTransform: "none",
                fontSize: "1rem",
              },
            }}
          >
            <Tab
              icon={<CampaignIcon sx={{ mr: 1 }} />}
              label="Current Campaigns"
              iconPosition="start"
            />
            <Tab
              icon={<HistoryIcon sx={{ mr: 1 }} />}
              label="Historical Campaigns"
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Content Section */}
        <Box sx={{ bgcolor: "background.default" }}>
          <TabPanel value={activeTab} index={0}>
            <MemoizedViewCampaign
              handleUpdateModal={handleUpdateModal}
              handleDetailsModal={handleDetailsModal}
            />
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            <MemoizedViewHistoricalCampaign
              handleUpdateModal={handleUpdateModal}
              handleDetailsModal={handleDetailsModal}
            />
          </TabPanel>
        </Box>

        {/* Registrations Section */}
        {(localStorage.getItem("role") === "volunteer" ||
          localStorage.getItem("role") === "admin") && (
          <Box sx={{ mt: 4, px: 3, pb: 3 }}>
            <Divider sx={{ mb: 3 }} />
            <Typography
              variant="h6"
              sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
            >
              <CampaignIcon />
              Campaign Registrations
            </Typography>
            <MemoizedRegistrations />
          </Box>
        )}
      </Paper>

      {/* Modals */}
      {createModal && (
        <CreateCampaign
          open={createModal}
          onClose={handleCreateModal}
          onCreate={handleCreateCampaign}
        />
      )}

      {updateModal && (
        <UpdateCampaign
          campaignData={selectedRow}
          open={updateModal}
          onClose={handleUpdateModal}
          onUpdate={handleUpdateCampaign}
        />
      )}

      {detailsModal && (
        <Details
          campaignData={selectedRow}
          open={detailsModal}
          onClose={handleDetailsModal}
          onRegister={handleCampaignRegistration}
          onDonate={handleDonation}
        />
      )}

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </Container>
  );
}

export default Campaigns;
