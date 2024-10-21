import React, { useState } from "react";
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
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert"; // Import ellipsis icon

const ViewCampaign = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Create a styled component for fixed last column
  const FixedTableCell = styled(TableCell)(({ theme }) => ({
    position: "sticky",
    right: 0,
    background: theme.palette.background.paper, // Ensures the background matches
    zIndex: 1,
  }));

  // Updated dataset based on your JSON input
  const data = [
    {
      title: "Feed the Hungry",
      description: "A campaign to distribute food to the homeless.",
      targetAmount: 150000,
      raisedAmount: 75000,
      startDate: new Date("2024-03-01T00:00:00.000Z"),
      endDate: new Date("2024-08-01T00:00:00.000Z"),
      isActive: true,
    },
    {
      title: "Clothes for All",
      description: "Collecting clothes for the needy.",
      targetAmount: 50000,
      raisedAmount: 30000,
      startDate: new Date("2024-06-01T00:00:00.000Z"),
      endDate: new Date("2024-11-01T00:00:00.000Z"),
      isActive: true,
    },
    {
      title: "School Supplies Drive",
      description: "Providing school supplies to underprivileged children.",
      targetAmount: 20000,
      raisedAmount: 15000,
      startDate: new Date("2024-04-01T00:00:00.000Z"),
      endDate: new Date("2024-09-01T00:00:00.000Z"),
      isActive: false,
    },
  ];

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

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ maxHeight: "400px", overflow: "auto" }}>
        <Table aria-label="responsive table">
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableCell
                  key={header.id}
                  sx={{
                    backgroundColor: "#1976d2", // Change this color as needed
                    color: "#fff", // Text color for the header
                    fontWeight: "bold", // Make header text bold
                  }}
                >
                  {header.label}
                </TableCell>
              ))}
              {/* Fixed column header */}
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
            {data.map((row, index) => {
              return (
                <TableRow key={index}>
                  {headers.map((header) => (
                    <TableCell
                      key={header.id}
                      sx={{
                        maxWidth: header.id === "description" ? 200 : "none", // Fixed width for description
                        overflow: header.id === "description" ? "hidden" : "visible",
                        textOverflow: header.id === "description" ? "ellipsis" : "initial",
                        whiteSpace: header.id === "description" ? "nowrap" : "normal",
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
              );
            })}
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom", // Position the Popover below the icon
                horizontal: "right", // Align it to the right of the icon
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <List>
                <ListItem button onClick={handleClose}>
                  <ListItemText primary={`Update ${selectedRow ? selectedRow.title : ""}`} />
                </ListItem>
              </List>
            </Popover>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ViewCampaign;
