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
  useTheme,
  useMediaQuery,
  styled,
  Popover,
  List,
  ListItem,
  ListItemText,
  Pagination, // MUI Pagination
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDispatch, useSelector } from "react-redux";
import { DELETECAMPAIGNSDATA, GETPAGINATEDCAMPAIGNS } from "../../../actions/campaigns/ActionCreators";
import { formatDate } from "../../../common/utils";

// Define headers for the table
const headers = [
  { id: "title", label: "Title" },
  { id: "description", label: "Description" },
  { id: "targetAmount", label: "Target Amount" },
  { id: "raisedAmount", label: "Raised Amount" },
  { id: "startDate", label: "Start Date" },
  { id: "endDate", label: "End Date" },
  { id: "isActive", label: "Active" },
];

const ViewCampaign = ({ handleUpdateModal, handleDetailsModal }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Styled component for sticky table cell
  const FixedTableCell = styled(TableCell)(({ theme }) => ({
    position: "sticky",
    right: 0,
    background: theme.palette.background.paper,
    zIndex: 1,
  }));

  const paginatedCampaignData = useSelector((state) => state.CampaignsReducer.paginatedCampaignData);
  const metadata = useSelector((state) => state.CampaignsReducer.metadata);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(2); // Items per page

  const open = Boolean(anchorEl);

  useEffect(() => {
    const filter = { isActive: true };
    dispatch(GETPAGINATEDCAMPAIGNS(currentPage, limit, filter));
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

  // Helper function to determine if a campaign is ongoing
  const isOngoingCampaign = (startDate, endDate) => {
    const today = new Date();
    return new Date(startDate) <= today && today <= new Date(endDate);
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
            {paginatedCampaignData.map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  backgroundColor: isOngoingCampaign(row.startDate, row.endDate)
                    ? "#e0f7fa" // Light teal color for ongoing campaigns
                    : "inherit",
                }}
              >
                {headers.map((header) => (
                  <TableCell
                    key={header.id}
                    sx={{
                      maxWidth: header.id === "description" || header.id === "title" ? 200 : "auto",
                      overflow:
                        header.id === "description" || header.id === "title" ? "hidden" : "visible",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {header.id === "description" || header.id === "title" ? (
                      <Tooltip title={row[header.id]} arrow>
                        <span>{row[header.id]}</span>
                      </Tooltip>
                    ) : header.id === "startDate" || header.id === "endDate" ? (
                      formatDate(row[header.id])
                    ) : header.id === "targetAmount" || header.id === "raisedAmount" ? (
                      `$${row[header.id].toLocaleString()}`
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
          {localStorage.getItem("role") === "admin" && (
            <>
              <ListItem button onClick={() => handleUpdateModal(selectedRow)}>
                <ListItemText primary="Update" />
              </ListItem>
              <ListItem button onClick={() => dispatch(DELETECAMPAIGNSDATA(selectedRow._id))}>
                <ListItemText primary="Delete" />
              </ListItem>
            </>
          )}
        </List>
      </Popover>

      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        sx={{ display: "flex", justifyContent: "center", mt: 2 }}
      />
    </>
  );
};

export default ViewCampaign;
