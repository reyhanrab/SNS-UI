import React, { useState } from "react";
import { useDispatch } from "react-redux";
import ViewCampaign from "./view/ViewCampaign";
import { Toolbar, Typography, Button, Tabs, Tab, Box } from "@mui/material";
import CreateCampaign from "./create/CreateCampaign";
import {
  ADDCAMPAIGNSDATA,
  EDITCAMPAIGNSDATA,
  REGISTERFORCAMPAGIN,
} from "../../actions/campaigns/ActionCreators";
import UpdateCampaign from "./update/UpdateCampaign";
import ViewHistoricalCampaign from "./view/ViewHistoricalCampaign";
import Registrations from "../Registrations/Registrations";
import { useNavigate } from "react-router-dom";
import CampaignDetails from "./details/CampaignDetails";

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

const MemoizedRegistrations = React.memo(Registrations);

function Campaigns() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [createModal, setCreateModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

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
    dispatch(REGISTERFORCAMPAGIN(id, localStorage.getItem("userId"), handleDetailsModal));
  };

  const handleDonation = (obj) => {
    navigate(`/dashboard/donate/${obj._id}`);
  };

  // Handling tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Memoizing components
  const MemoizedViewCampaign = React.memo(ViewCampaign);
  const MemoizedViewHistoricalCampaign = React.memo(ViewHistoricalCampaign);

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <Typography variant="h6">All Campaigns</Typography>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            centered
            sx={{
              "& .MuiTabs-flexContainer": { display: "flex", alignItems: "center" },
              "& .MuiTab-root:focus-visible": { outline: "none" },
            }}
          >
            <Tab label="Current" sx={{ "&:focus-visible": { outline: "none" } }} />
            <Tab label="Historical" sx={{ "&:focus-visible": { outline: "none" } }} />
          </Tabs>
          <Button variant="contained" color="secondary" onClick={handleCreateModal}>
            Create
          </Button>
        </Toolbar>

        {/* Tab Panels */}
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
        {/* Registrations Component */}
        {localStorage.getItem("role") === "volunteer" || localStorage.getItem("role") === "admin" && <MemoizedRegistrations />}
      </Box>

      {/* Create Campaign Modal */}
      {createModal && (
        <CreateCampaign
          open={createModal}
          onClose={handleCreateModal}
          onCreate={handleCreateCampaign}
        />
      )}

      {/* Update Campaign Modal */}
      {updateModal && (
        <UpdateCampaign
          campaignData={selectedRow}
          open={updateModal}
          onClose={handleUpdateModal}
          onUpdate={handleUpdateCampaign}
        />
      )}

      {/* Campaign Details Modal */}
      {detailsModal && (
        <CampaignDetails
          campaignData={selectedRow}
          open={detailsModal}
          onClose={handleDetailsModal}
          onRegister={handleCampaignRegistration}
          onDonate={handleDonation}
        />
      )}
    </>
  );
}

export default Campaigns;
