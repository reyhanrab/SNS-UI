import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ViewCampaign from "./view/ViewCampaign";
import { Toolbar, Typography, Button } from "@mui/material";
import CreateCampaign from "./create/CreateCampaign";
import { ADDCAMPAIGNSDATA, EDITCAMPAIGNSDATA } from "../../actions/campaigns/ActionCreators";

function Campaigns() {
  const dispatch = useDispatch();

  const [createModal, setCreateModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);

  const handleCreateModal = () => setCreateModal(!createModal);
  const handleUpdateModal = () => setUpdateModal(!updateModal);

  const handleCreateCampaign = (obj) => {
    dispatch(ADDCAMPAIGNSDATA(obj, handleCloseModal));
  };

  const handleUpdateCampaign = (obj) => {
    dispatch(EDITCAMPAIGNSDATA(obj, handleUpdateModal));
  };

  // Memoizing the ViewCampaign component
  const MemoizedViewCampaign = React.memo(ViewCampaign);

  return (
    <div>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">All Campaigns</Typography>
        <Button variant="contained" color="secondary" onClick={handleCreateModal}>
          Create
        </Button>
      </Toolbar>
      <MemoizedViewCampaign />
      {createModal && (
        <CreateCampaign
          open={createModal}
          onClose={handleCreateModal}
          onCreate={handleCreateCampaign}
        />
      )}
      {updateModal && (
        <CreateCampaign
          open={updateModal}
          onClose={handleUpdateModal}
          onCreate={handleUpdateCampaign}
        />
      )}
    </div>
  );
}

export default Campaigns;
