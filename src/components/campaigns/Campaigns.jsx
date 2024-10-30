import React, { useState } from "react";
import { useDispatch } from "react-redux";
import ViewCampaign from "./view/ViewCampaign";
import { Toolbar, Typography, Button } from "@mui/material";
import CreateCampaign from "./create/CreateCampaign";
import { ADDCAMPAIGNSDATA } from "../../actions/campaigns/ActionCreators";

function Campaigns() {
  const dispatch = useDispatch();

  const [createModal, setCreateModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(false);

  const handleCreateModal = () => setCreateModal(!createModal);

  const handleUpdateModal = (obj={}) => {
    setSelectedRow(obj);
    setUpdateModal(!updateModal);
  };

  const handleCreateCampaign = (obj) => {
    dispatch(ADDCAMPAIGNSDATA(obj, handleCreateModal));
  };

  const handleUpdateCampaign = (obj) => {
    dispatch(EDITCAMPAIGNSDATA(obj?._id, obj, handleUpdateModal));
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
      {updateModal && (
        <UpdateCampaign
        campaignData={selectedRow}
          open={updateModal}
          onClose={handleUpdateModal}
          onUpdate={handleUpdateCampaign}
        />
      )}
    </div>
  );
}

export default Campaigns;
