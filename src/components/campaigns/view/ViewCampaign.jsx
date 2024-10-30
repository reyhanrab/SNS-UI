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
import { GETCAMPAIGNSDATA } from "../../../actions/campaigns/ActionCreators";

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

const ViewCampaign = ({ handleUpdateModal }) => {
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

  const campaignsData = useSelector((state) => state.CampaignsReducer.campaignsData);
  const metadata = useSelector((state) => state.CampaignsReducer.metadata);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(2); // Items per page

  const open = Boolean(anchorEl);

  useEffect(() => {
    dispatch(GETCAMPAIGNSDATA(currentPage, limit));
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
              </TableCell>{" "}
            </TableRow>
          </TableHead>
          <TableBody>
            {campaignsData.map((row, index) => (
              <TableRow key={index}>
                {headers.map((header) => (
                  <TableCell
                    key={header.id}
                    sx={{
                      maxWidth: header.id === "description" ? 200 : "auto",
                      overflow: header.id === "description" ? "hidden" : "visible",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {header.id === "description" ? (
                      <Tooltip title={row[header.id]} arrow>
                        <span>{row[header.id]}</span>
                      </Tooltip>
                    ) : header.id === "startDate" || header.id === "endDate" ? (
                      new Date(row[header.id]).toLocaleDateString()
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
      >
        <List>
          <ListItem button onClick={()=>handleUpdateModal(selectedRow)}>
            <ListItemText primary={`Update ${selectedRow ? selectedRow.title : ""}`} />
          </ListItem>
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
