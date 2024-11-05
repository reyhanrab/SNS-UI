import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Popover,
  List,
  ListItem,
  ListItemText,
  Pagination,
  CircularProgress, // MUI Pagination
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { useDispatch, useSelector } from "react-redux";

import { GETREGISTRATIONS } from "../../../actions/registrations/ActionCreators";
import { formatDate } from "../../../common/utils";

// Define headers for the table
const headers = [
  { id: "registrationId", label: "Registration ID" },
  { id: "title", label: "Campaign Title" },
  { id: "startDate", label: "Campaign Start Date" },
  { id: "registrationDate", label: "Registration Date" },
  { id: "status", label: "Status" },
];

const ViewRegistrations = ({ handleDetailsModal }) => {
  const dispatch = useDispatch();

  const registrationsData = useSelector((state) => state.RegistrationsReducer.registrationsData);
  const metadata = useSelector((state) => state.RegistrationsReducer.metadata);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(2); // Items per page
  const [loading, setLoading] = useState(true);

  const open = Boolean(anchorEl);

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => setLoading(false), 2000); // 2 seconds delay
    return () => clearTimeout(timer); // Cleanup on component unmount
  }, []);

  useEffect(() => {
    const filter = { isActive: true, volunteer: localStorage.getItem("userId") };
    dispatch(GETREGISTRATIONS(currentPage, limit, filter));
  }, [currentPage, dispatch, limit]);

  useEffect(() => {
    setTotalPages(metadata?.totalPages);
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
        <Table aria-label="campaigns table">
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
                key="fixedActions"
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
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={headers.length + 1}
                  sx={{
                    textAlign: "center",
                    height: "300px",
                  }}
                >
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : registrationsData.length > 0 ? (
              registrationsData.map((row, index) => (
                <TableRow key={index}>
                  {headers.map((header) => (
                    <TableCell
                      key={header.id}
                      sx={{
                        maxWidth: header.id === "title" ? 200 : "auto",
                        overflow: header.id === "title" ? "hidden" : "visible",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {header.id === "title" ? (
                        <Tooltip title={row.campaign?.title} arrow>
                          <span>{row.campaign?.title}</span>
                        </Tooltip>
                      ) : header.id === "startDate" ? (
                        row.campaign?.startDate ? (
                          formatDate(row.campaign.startDate)
                        ) : (
                          "N/A"
                        )
                      ) : header.id === "registrationDate" ? (
                        row[header.id] ? (
                          formatDate(row[header.id])
                        ) : (
                          "N/A"
                        )
                      ) : header.id === "isActive" ? (
                        row[header.id] ? (
                          "Yes"
                        ) : (
                          "No"
                        )
                      ) : (
                        row[header.id]
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Tooltip title="More" arrow>
                      <IconButton onClick={(event) => handleClick(event, row)} size="small">
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

      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        sx={{ display: "flex", justifyContent: "center", mt: 2 }}
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ cursor: "pointer" }}
      >
        <List>
          <ListItem button onClick={() => handleDetailsModal(selectedRow)}>
            <ListItemText primary="Details" />
          </ListItem>
          {/* <ListItem button onClick={() => handleUpdateModal(selectedRow)}>
            <ListItemText primary="Update" />
          </ListItem>
          <ListItem button onClick={() => dispatch(DELETECAMPAIGNSDATA(selectedRow._id))}>
            <ListItemText primary="Delete" />
          </ListItem> */}
        </List>
      </Popover>
    </>
  );
};

export default ViewRegistrations;
