import React, { useState } from "react";
import { Toolbar, Typography, Box, Button } from "@mui/material";

import ViewDonations from "./view/ViewDonations";
import DonationDetails from "./details/DonationDetails";

const MemoizedViewDonations = React.memo(ViewDonations);

function Donations() {
  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(false);

  const handleDetailsModal = (obj = {}) => {
    setSelectedRow(obj);
    setDetailsModal(!detailsModal);
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <Typography variant="h6">My Donations</Typography>
          <Button variant="contained" color="secondary">
            Create
          </Button>
        </Toolbar>
        <MemoizedViewDonations handleDetailsModal={handleDetailsModal} />
      </Box>

      {/* -------------------------------- Donation Details ---------------------------------- */}

      {detailsModal && (
        <DonationDetails
          open={detailsModal}
          onClose={handleDetailsModal}
          paymentData={selectedRow}
        />
      )}
    </>
  );
}

export default Donations;
