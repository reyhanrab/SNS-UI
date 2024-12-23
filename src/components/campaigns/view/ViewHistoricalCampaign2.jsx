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
  Menu,
  MenuItem,
  Typography,
  Box,
  Chip,
  Avatar,
  LinearProgress,
  Pagination,
  Skeleton,
  Alert,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  History as HistoryIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { GETPAGINATEDCAMPAIGNS } from "../../../actions/campaigns/ActionCreators";
import { formatDate } from "../../../common/utils";

const headers = [
  { id: "title", label: "Campaign Title", width: "20%" },
  { id: "description", label: "Description", width: "25%" },
  { id: "targetAmount", label: "Target Amount", width: "12%" },
  { id: "raisedAmount", label: "Raised Amount", width: "12%" },
  { id: "startDate", label: "Start Date", width: "10%" },
  { id: "endDate", label: "End Date", width: "10%" },
  { id: "status", label: "Status", width: "8%" },
];

const ViewHistoricalCampaign = ({ handleUpdateModal }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const paginatedCampaignData = useSelector(
    (state) => state.CampaignsReducer.paginatedCampaignData
  );
  const metadata = useSelector((state) => state.CampaignsReducer.metadata);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const filter = { isActive: false };
        await dispatch(GETPAGINATEDCAMPAIGNS(currentPage, limit, filter));
      } catch (err) {
        setError("Failed to load historical campaigns");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, dispatch, limit]);

  useEffect(() => {
    setTotalPages(metadata?.totalPages);
  }, [metadata]);

  const handleMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const getCampaignStatus = (row) => {
    const endDate = new Date(row.endDate);
    const targetAmount = row.targetAmount;
    const raisedAmount = row.raisedAmount;

    if (raisedAmount >= targetAmount) {
      return (
        <Chip
          label="Target Achieved"
          color="success"
          size="small"
          icon={<CheckCircleIcon />}
        />
      );
    }
    if (endDate < new Date()) {
      return (
        <Chip
          label="Expired"
          color="error"
          size="small"
          icon={<CancelIcon />}
        />
      );
    }
    return (
      <Chip
        label="Completed"
        color="warning"
        size="small"
        icon={<AccessTimeIcon />}
      />
    );
  };

  const getProgressValue = (raised, target) => {
    return Math.min((raised / target) * 100, 100);
  };

  if (error) {
    return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  }

  return (
    <Box sx={{ position: "relative" }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <TableContainer sx={{ maxHeight: "calc(100vh - 300px)" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableCell
                    key={header.id}
                    sx={{
                      backgroundColor: theme.palette.background.paper,
                      fontWeight: 600,
                      width: header.width,
                    }}
                  >
                    {header.label}
                  </TableCell>
                ))}
                <TableCell
                  align="right"
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    fontWeight: 600,
                    width: "5%",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? Array(5).fill(0).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      {headers.map((header) => (
                        <TableCell key={`${header.id}-${index}`}>
                          <Skeleton animation="wave" />
                        </TableCell>
                      ))}
                      <TableCell>
                        <Skeleton animation="wave" />
                      </TableCell>
                    </TableRow>
                  ))
                : paginatedCampaignData.map((row) => (
                    <TableRow
                      key={row._id}
                      sx={{
                        backgroundColor: theme.palette.grey[50],
                        "&:hover": {
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: theme.palette.grey[500],
                            }}
                          >
                            <HistoryIcon sx={{ fontSize: 18 }} />
                          </Avatar>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {row.title}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={row.description} arrow>
                          <Typography
                            variant="body2"
                            sx={{
                              maxWidth: 200,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              color: theme.palette.text.secondary,
                            }}
                          >
                            {row.description}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          ${row.targetAmount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ width: "100%" }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 0.5,
                            }}
                          >
                            <Typography variant="body2" fontWeight={500}>
                              ${row.raisedAmount.toLocaleString()}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {Math.round(
                                (row.raisedAmount / row.targetAmount) * 100
                              )}
                              %
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={getProgressValue(
                              row.raisedAmount,
                              row.targetAmount
                            )}
                            sx={{
                              height: 6,
                              borderRadius: 1,
                              bgcolor: theme.palette.grey[200],
                              "& .MuiLinearProgress-bar": {
                                borderRadius: 1,
                                bgcolor: theme.palette.grey[500],
                              },
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(row.startDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(row.endDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>{getCampaignStatus(row)}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={(event) => handleMenuClick(event, row)}
                          sx={{
                            color: theme.palette.text.secondary,
                            "&:hover": {
                              backgroundColor: theme.palette.action.hover,
                            },
                          }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>

        {!loading && paginatedCampaignData.length === 0 && (
          <Box
            sx={{
              p: 4,
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            <HistoryIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
            <Typography variant="h6">No Historical Campaigns</Typography>
            <Typography variant="body2">
              There are no inactive campaigns to display
            </Typography>
          </Box>
        )}
      </Paper>

      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
          sx={{
            "& .MuiPaginationItem-root": {
              borderRadius: 1,
            },
          }}
        />
        <Typography variant="body2" color="text.secondary">
          Page {currentPage} of {totalPages}
        </Typography>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 180,
            borderRadius: 2,
            mt: 1,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleUpdateModal(selectedRow, "historical");
            handleMenuClose();
          }}
          sx={{ gap: 1.5 }}
        >
          <ViewIcon fontSize="small" />
          <Typography variant="body2">View Details</Typography>
        </MenuItem>
        {localStorage.getItem("role") === "admin" && (
          <MenuItem
            onClick={handleMenuClose}
            sx={{ color: "error.main", gap: 1.5 }}
          >
            <DeleteIcon fontSize="small" />
            <Typography variant="body2">Delete Campaign</Typography>
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default ViewHistoricalCampaign;