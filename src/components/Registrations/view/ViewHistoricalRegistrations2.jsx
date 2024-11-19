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
  Menu,
  MenuItem,
  Typography,
  Box,
  Chip,
  Avatar,
  Skeleton,
  Alert,
  useTheme,
  Pagination,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  History as HistoryIcon,
  CalendarToday as CalendarIcon,
  EventAvailable as EventAvailableIcon,
  Campaign as CampaignIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Timer as TimerIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { GETREGISTRATIONS } from "../../../actions/registrations/ActionCreators";
import { formatDate } from "../../../common/utils";

const headers = [
  { id: "registrationId", label: "Registration ID", width: "15%" },
  { id: "title", label: "Campaign Title", width: "25%" },
  { id: "startDate", label: "Campaign Start", width: "15%" },
  { id: "registrationDate", label: "Registration Date", width: "15%" },
  { id: "status", label: "Completion Status", width: "15%" },
];

const MyHistoricalCampaign = ({ handleDetailsModal }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const registrationsData = useSelector(
    (state) => state.RegistrationsReducer.registrationsData
  );
  const metadata = useSelector((state) => state.RegistrationsReducer.metadata);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filter = {
          isActive: false,
          volunteer: localStorage.getItem("userId"),
        };
        await dispatch(GETREGISTRATIONS(currentPage, limit, filter));
        setLoading(false);
      } catch (err) {
        setError("Failed to load historical campaigns");
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, dispatch, limit]);

  useEffect(() => {
    setTotalPages(metadata?.totalPages || 1);
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

  const getCompletionStatus = (row) => {
    const completionStatuses = {
      COMPLETED: {
        label: "Completed",
        color: "success",
        icon: <CheckCircleIcon sx={{ fontSize: 16 }} />,
      },
      PARTIAL: {
        label: "Partial",
        color: "warning",
        icon: <TimerIcon sx={{ fontSize: 16 }} />,
      },
      CANCELLED: {
        label: "Cancelled",
        color: "error",
        icon: <CancelIcon sx={{ fontSize: 16 }} />,
      },
      DEFAULT: {
        label: "Unknown",
        color: "default",
        icon: <HistoryIcon sx={{ fontSize: 16 }} />,
      },
    };

    const status = completionStatuses[row.status] || completionStatuses.DEFAULT;

    return (
      <Chip
        label={status.label}
        color={status.color}
        size="small"
        icon={status.icon}
        variant="outlined"
        sx={{
          minWidth: 100,
          borderWidth: 2,
          "& .MuiChip-icon": { mr: 0.5 },
        }}
      />
    );
  };

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ position: "relative" }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,

          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.grey[50],
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
                    width: "10%",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array(5)
                  .fill(0)
                  .map((_, index) => (
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
              ) : registrationsData.length > 0 ? (
                registrationsData.map((row) => (
                  <TableRow
                    key={row.registrationId}
                    sx={{
                      backgroundColor: theme.palette.background.paper,
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: "monospace", fontWeight: 500 }}
                      >
                        {row.registrationId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: theme.palette.grey[500],
                          }}
                        >
                          <HistoryIcon sx={{ fontSize: 18 }} />
                        </Avatar>
                        <Tooltip title={row.campaign?.title || "N/A"} arrow>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              color: theme.palette.text.secondary,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {row.campaign?.title || "N/A"}
                          </Typography>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CalendarIcon
                          sx={{ fontSize: 18, color: theme.palette.grey[500] }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {row.campaign?.startDate
                            ? formatDate(row.campaign.startDate)
                            : "N/A"}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <EventAvailableIcon
                          sx={{ fontSize: 18, color: theme.palette.grey[500] }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {row.registrationDate
                            ? formatDate(row.registrationDate)
                            : "N/A"}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{getCompletionStatus(row)}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(event) => handleMenuClick(event, row)}
                        sx={{
                          color: theme.palette.grey[600],
                          "&:hover": {
                            backgroundColor: theme.palette.action.hover,
                          },
                        }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={headers.length + 1}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        py: 8,
                      }}
                    >
                      <HistoryIcon
                        sx={{
                          fontSize: 48,
                          color: theme.palette.grey[400],
                          mb: 2,
                        }}
                      />
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        gutterBottom
                      >
                        No Historical Campaigns
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        You don't have any completed campaign registrations yet
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {registrationsData.length > 0 && (
          <Box
            sx={{
              mt: 2,
              mb: 1,
              px: 2,
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
        )}
      </Paper>

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
            handleDetailsModal(selectedRow);
            handleMenuClose();
          }}
          sx={{ gap: 1.5 }}
        >
          <ViewIcon fontSize="small" />
          <Typography variant="body2">View Details</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default MyHistoricalCampaign;
