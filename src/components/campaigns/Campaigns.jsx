import React, { useState } from "react";
import { useDispatch } from "react-redux";
import ViewCampaign from "./view/ViewCampaign";
import { Toolbar, Typography, Button } from "@mui/material";
import CreateCampaign from "./create/CreateCampaign";
import { ADDCAMPAIGNSDATA } from "../../actions/campaigns/ActionCreators";

function Campaigns() {
  const [isModalOpen, setModalOpen] = useState(false);
  
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleCreateCampaign = (obj) => {
    console.log("obj", obj);
    // dispatch(ADDCAMPAIGNSDATA(obj, handleCloseModal));
  };

  // Memoizing the ViewCampaign component
  const MemoizedViewCampaign = React.memo(ViewCampaign);

  return (
    <div>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">All Campaigns</Typography>
        <Button variant="contained" color="secondary" onClick={handleOpenModal}>
          Create
        </Button>
      </Toolbar>
      <MemoizedViewCampaign />
      {isModalOpen && (
        <CreateCampaign
          open={isModalOpen}
          onClose={handleCloseModal}
          onCreate={handleCreateCampaign}
        />
      )}
    </div>
  );
}

export default Campaigns;
