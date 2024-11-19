/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  useTheme,
  Container,
  Fade,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  History as HistoryIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import ViewHistoricalRegistrations from "./view/ViewHistoricalRegistrations2";
import ViewRegistrations from "./view/ViewRegistrations2";
import RegistrationDetails from "./details/RegistrationDetails";

function TabPanel({ children, value, index, ...other }) {
  return (
    <Fade in={value === index}>
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`registration-tabpanel-${index}`}
        aria-labelledby={`registration-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    </Fade>
  );
}

function Registrations() {
  const theme = useTheme();
  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleDetailsModal = (obj = {}) => {
    setSelectedRow(obj);
    setDetailsModal(!detailsModal);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const MemoizedViewRegistrations = React.memo(ViewRegistrations);
  const MemoizedViewHistoricalRegistrations = React.memo(
    ViewHistoricalRegistrations
  );

  return (
    <div>
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
            <AssignmentIcon
              sx={{ fontSize: 32, color: theme.palette.primary.main }}
            />
            <Typography variant="h5" fontWeight="600">
              My Registrations
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
            icon={<AssignmentIcon sx={{ mr: 1 }} />}
            label="Current Registrations"
            iconPosition="start"
          />
          <Tab
            icon={<HistoryIcon sx={{ mr: 1 }} />}
            label="Historical Registrations"
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Content Section */}
      <Box sx={{ bgcolor: "background.default" }}>
        <TabPanel value={activeTab} index={0}>
          <MemoizedViewRegistrations handleDetailsModal={handleDetailsModal} />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <MemoizedViewHistoricalRegistrations
            handleDetailsModal={handleDetailsModal}
          />
        </TabPanel>
      </Box>

      {/* Registration Details Modal */}
      {detailsModal && (
        <RegistrationDetails
          open={detailsModal}
          onClose={handleDetailsModal}
          registrationData={selectedRow}
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
    </div>
  );
}

export default Registrations;
