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
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon,
  EventAvailable as EventAvailableIcon,
  HowToReg as HowToRegIcon,
  Campaign as CampaignIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { GETREGISTRATIONS } from "../../../actions/registrations/ActionCreators";
import { formatDate } from "../../../common/utils";

const headers = [
  { id: "registrationId", label: "Registration ID", width: "15%" },
  { id: "title", label: "Campaign Title", width: "25%" },
  { id: "startDate", label: "Campaign Start", width: "15%" },
  { id: "registrationDate", label: "Registration Date", width: "15%" },
  { id: "status", label: "Status", width: "15%" },
];

const ViewRegistrations = ({ handleDetailsModal }) => {
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
          isActive: true,
          volunteer: localStorage.getItem("userId"),
        };
        await dispatch(GETREGISTRATIONS(currentPage, limit, filter));
        setLoading(false);
      } catch (err) {
        setError("Failed to load registrations");
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

  const getStatusChip = (status) => {
    const statusConfig = {
      PENDING: {
        label: "Pending",
        color: "warning",
        icon: <HowToRegIcon sx={{ fontSize: 16 }} />,
      },
      APPROVED: {
        label: "Approved",
        color: "success",
        icon: <EventAvailableIcon sx={{ fontSize: 16 }} />,
      },
      REJECTED: {
        label: "Rejected",
        color: "error",
        icon: <CalendarIcon sx={{ fontSize: 16 }} />,
      },
      DEFAULT: {
        label: status || "Unknown",
        color: "default",
        icon: <AssignmentIcon sx={{ fontSize: 16 }} />,
      },
    };

    const config = statusConfig[status] || statusConfig.DEFAULT;

    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        icon={config.icon}
        sx={{ minWidth: 100 }}
      />
    );
  };

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ position: "relative" }}>
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: theme.palette.primary.main,
                        }}
                      >
                        <CampaignIcon sx={{ fontSize: 18 }} />
                      </Avatar>
                      <Tooltip title={row.campaign?.title || "N/A"} arrow>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CalendarIcon
                        sx={{
                          fontSize: 18,
                          color: theme.palette.text.secondary,
                        }}
                      />
                      <Typography variant="body2">
                        {row.campaign?.startDate
                          ? formatDate(row.campaign.startDate)
                          : "N/A"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <EventAvailableIcon
                        sx={{
                          fontSize: 18,
                          color: theme.palette.text.secondary,
                        }}
                      />
                      <Typography variant="body2">
                        {row.registrationDate
                          ? formatDate(row.registrationDate)
                          : "N/A"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{getStatusChip(row.status)}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(event) => handleMenuClick(event, row)}
                      sx={{
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
                    <AssignmentIcon
                      sx={{
                        fontSize: 48,
                        color: theme.palette.text.secondary,
                        mb: 2,
                        opacity: 0.5,
                      }}
                    />
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      No Registrations Found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      You haven't registered for any campaigns yet
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

export default ViewRegistrations;
