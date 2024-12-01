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
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Chip,
  Avatar,
  LinearProgress,
  Pagination,
  Skeleton,
  Stack,
  useTheme,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Receipt as ReceiptIcon,
  Paid as PaidIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { GETDONATIONSBYID } from "../../../../actions/users/ActionCreators";
import { formatDateTime } from "../../../../common/utils";

const headers = [
  { id: "campaign", label: "Campaign", width: "20%" },
  { id: "amount", label: "Amount", width: "15%" },
  { id: "status", label: "Status", width: "10%" },
  { id: "paymentDate", label: "Payment Date", width: "15%" },
  { id: "cardHolderName", label: "Card Holder", width: "15%" },
  { id: "location", label: "Location", width: "20%" },
];

const ViewDonations = ({ handleDetailsModal }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const donationsData = useSelector(
    (state) => state.UsersReducer.donationsById
  );
  const metadata = useSelector(
    (state) => state.UsersReducer.donationsByIdMetadata
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(
        GETDONATIONSBYID(localStorage.getItem("userId"), currentPage, limit)
      );
      setLoading(false);
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
      completed: { color: "success", label: "Completed" },
      pending: { color: "warning", label: "Pending" },
      failed: { color: "error", label: "Failed" },
    };
    const config = statusConfig[status.toLowerCase()] || {
      color: "default",
      label: status,
    };

    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        sx={{ minWidth: 85 }}
      />
    );
  };

  return (
    <Box>
      <TableContainer sx={{ maxHeight: "calc(100vh - 400px)" }}>
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
              ? Array(5)
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
              : donationsData.map((donation) => (
                  <TableRow
                    key={donation._id}
                    sx={{
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: theme.palette.primary.main,
                          }}
                        >
                          <PaidIcon sx={{ fontSize: 20 }} />
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
                          {donation.campaign?.title || "N/A"}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        ${(donation.amount).toFixed(2)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {donation.currency}
                      </Typography>
                    </TableCell>
                    <TableCell>{getStatusChip(donation.status)}</TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {donation.paymentDate
                          ? formatDateTime(donation.paymentDate)
                          : "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {donation.cardHolderName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography variant="body2">
                          {donation.country}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          •
                        </Typography>
                        <Tooltip title={donation.address} arrow>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              maxWidth: 150,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {donation.address}
                          </Typography>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(event) => handleMenuClick(event, donation)}
                        sx={{
                          "&:hover": { backgroundColor: "action.hover" },
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

      {!loading && donationsData.length === 0 && (
        <Box
          sx={{
            p: 4,
            textAlign: "center",
            color: "text.secondary",
          }}
        >
          <ReceiptIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
          <Typography variant="h6">No donations found</Typography>
          <Typography variant="body2">
            You haven't made any donations yet
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          mt: 2,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Showing {donationsData.length} of {metadata?.totalDocs || 0} donations
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
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
        </Stack>
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

export default ViewDonations;
