import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  CircularProgress,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  Pagination,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDispatch, useSelector } from "react-redux";
import { GETDONATIONSBYID } from "../../../../actions/users/ActionCreators";
import { formatDateTime } from "../../../../common/utils";

const headers = [
  { id: "campaign", label: "Campaign" },
  { id: "amount", label: "Amount" },
  { id: "currency", label: "Currency" },
  { id: "status", label: "Status" },
  { id: "paymentDate", label: "Payment Date" },
  { id: "cardHolderName", label: "Card Holder Name" },
  { id: "country", label: "Country" },
  { id: "address", label: "Address" },
];

const ViewDonations = ({handleDetailsModal}) => {
  const dispatch = useDispatch();

  const donationsData = useSelector((state) => state.UsersReducer.donationsById);
  const metadata = useSelector((state) => state.UsersReducer.donationsByIdMetadata);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5); // Items per page
  const open = Boolean(anchorEl);

  useEffect(() => {
    dispatch(GETDONATIONSBYID(localStorage.getItem("userId"), currentPage, limit));
  }, [currentPage, dispatch, limit]);

  useEffect(() => {
    setTotalPages(metadata?.totalPages || 1);
  }, [metadata]);

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ maxHeight: "600px", overflow: "auto" }}>
        <Table aria-label="donations table">
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableCell
                  key={header.id}
                  sx={{
                    backgroundColor: "#1976d2",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  {header.label}
                </TableCell>
              ))}
              <TableCell
                sx={{
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  fontWeight: "bold",
                  position: "sticky",
                  right: 0,
                  zIndex: 1,
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {donationsData.length > 0 ? (
              donationsData.map((donation) => (
                <TableRow key={donation._id}>
                  <TableCell>
                    <Tooltip title={donation.campaign?.title || "N/A"} arrow>
                      <span>{donation.campaign?.title || "N/A"}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">${(donation.amount / 100).toFixed(2)}</TableCell>
                  <TableCell>{donation.currency}</TableCell>
                  <TableCell>{donation.status}</TableCell>
                  <TableCell>
                    {donation.paymentDate ? formatDateTime(donation.paymentDate) : "N/A"}
                  </TableCell>
                  <TableCell>{donation.cardHolderName}</TableCell>
                  <TableCell>{donation.country}</TableCell>
                  <TableCell>{donation.address}</TableCell>
                  <TableCell>
                    <Tooltip title="More" arrow>
                      <IconButton onClick={(event) => handleClick(event, donation)} size="small">
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={headers.length + 1}
                  sx={{
                    textAlign: "center",
                    height: "300px",
                    color: "gray",
                    fontStyle: "italic",
                  }}
                >
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Popover for actions */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ cursor: "pointer" }}
      >
        <List >
          <ListItem button onClick={() => handleDetailsModal(selectedRow)}>
            <ListItemText primary="Details" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              dispatch(DELETEDONATION(selectedRow._id));
              handleClose();
            }}
          >
            <ListItemText primary="Delete" />
          </ListItem>
        </List>
      </Popover>

      {/* Pagination */}
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        sx={{ display: "flex", justifyContent: "center", mt: 2 }}
      />
    </>
  );
};

export default ViewDonations;
