import React, { useState } from "react";
import { Toolbar, Typography, Tabs, Tab, Box } from "@mui/material";

import ViewHistoricalRegistrations from "./view/ViewHistoricalRegistrations";
import RegistrationDetails from "./details/RegistrationDetails";
import ViewRegistrations from "./view/ViewRegistrations";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function Registrations() {
  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleDetailsModal = (obj = {}) => {
    setSelectedRow(obj);
    setDetailsModal(!detailsModal);
  };

  // Handling tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Memoizing the MyCampaign component
  const MemoizedViewRegistrations = React.memo(ViewRegistrations);

  // Memoizing the MyCampaign component
  const MemoizedViewHistoricalRegistrations = React.memo(ViewHistoricalRegistrations);

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <Typography variant="h6">My Registrations</Typography>

          {/* -------------------------------- Tabs --------------------------------- */}

          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            centered
            sx={{
              "& .MuiTabs-flexContainer": { display: "flex", alignItems: "center" },
              "& .MuiTab-root:focus-visible": { outline: "none" }, // Remove focus outline
            }}
          >
            <Tab label="Current" sx={{ "&:focus-visible": { outline: "none" } }} />
            <Tab label="Historical" sx={{ "&:focus-visible": { outline: "none" } }} />
          </Tabs>

          <Box> </Box>
        </Toolbar>

        {/* -------------------------------- Tab Panel ---------------------------------- */}

        <TabPanel value={activeTab} index={0}>
          <MemoizedViewRegistrations handleDetailsModal={handleDetailsModal} />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <MemoizedViewHistoricalRegistrations handleDetailsModal={handleDetailsModal} />
        </TabPanel>
      </Box>

      {/* -------------------------------- Campaign Details ---------------------------------- */}

      {detailsModal && (
        <RegistrationDetails
          open={detailsModal}
          onClose={handleDetailsModal}
          registrationData={selectedRow}
        />
      )}
    </>
  );
}

export default Registrations;
