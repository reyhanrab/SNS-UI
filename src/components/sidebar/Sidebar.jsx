import React, { useState, useMemo, useCallback } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  IconButton,
  Box,
  Typography,
  Avatar,
  Divider,
  Collapse,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Home,
  Analytics,
  Settings,
  Info,
  Feedback,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LOGOUT } from "../../actions/general/ActionCreators";
import { useDispatch } from "react-redux";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(true);
  const [expandSettings, setExpandSettings] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // State for menu anchor
  const [selectedMenuItem, setSelectedMenuItem] = useState("Dashboard");

  const toggleSidebar = useCallback(() => setIsOpen((prev) => !prev), []);
  const handleExpandSettings = useCallback(() => setExpandSettings((prev) => !prev), []);

  const menuItems = useMemo(
    () => [
      { path: "/dashboard", label: "Dashboard", icon: <Home /> },
      { path: "/dashboard/campaigns", label: "Campaigns", icon: <Analytics /> },
      { path: "/dashboard/donations", label: "Donations", icon: <Settings /> },
    ],
    []
  );

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget); // Set the anchor element for the menu
  };

  const handleCloseMenu = () => {
    setAnchorEl(null); // Close the menu
  };

  return (
    <Drawer
      variant="permanent"
      open={isOpen}
      sx={{
        width: isOpen ? 240 : 60,
        transition: "width 0.3s",
        "& .MuiDrawer-paper": {
          width: isOpen ? 240 : 60,
          transition: "width 0.3s",
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: isOpen ? "space-between" : "center",
          alignItems: "center",
          padding: "16px 8px",
        }}
      >
        {isOpen && (
          <Typography variant="h6" sx={{ fontFamily: "Inter" }}>
            {selectedMenuItem}
          </Typography>
        )}
        <IconButton onClick={toggleSidebar}>{isOpen ? <ExpandLess /> : <ExpandMore />}</IconButton>
      </Box>

      <List sx={{ paddingTop: 0 }}>
        {menuItems.map(({ path, label, icon }) => (
          <ListItemButton
            key={path}
            component={Link}
            to={path}
            selected={location.pathname === path}
            onClick={() => setSelectedMenuItem(label)} 
            sx={{
              padding: "12px 16px",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.08)",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: "40px" }}>{icon}</ListItemIcon>
            {isOpen && (
              <Typography variant="body1" sx={{ fontFamily: "Inter", fontWeight: 500, ml: 2 }}>
                {label}
              </Typography>
            )}
          </ListItemButton>
        ))}
        <Divider sx={{ my: 2 }} />
        <ListItemButton
          onClick={handleExpandSettings}
          sx={{
            padding: "12px 16px",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.08)",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: "40px" }}>
            <Settings />
          </ListItemIcon>
          {isOpen && (
            <Typography variant="body1" sx={{ fontFamily: "Inter", fontWeight: 500, ml: 2 }}>
              Settings
            </Typography>
          )}
          {isOpen && (expandSettings ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
        <Collapse in={expandSettings} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              component={Link}
              to="/about"
              sx={{
                pl: 4,
                padding: "12px 16px",
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.08)" },
              }}
            >
              <ListItemIcon sx={{ minWidth: "40px" }}>
                <Info />
              </ListItemIcon>
              <Typography variant="body1" sx={{ fontFamily: "Inter", fontWeight: 500, ml: 2 }}>
                About
              </Typography>
            </ListItemButton>
            <ListItemButton
              component={Link}
              to="/feedback"
              sx={{
                pl: 4,
                padding: "12px 16px",
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.08)" },
              }}
            >
              <ListItemIcon sx={{ minWidth: "40px" }}>
                <Feedback />
              </ListItemIcon>
              <Typography variant="body1" sx={{ fontFamily: "Inter", fontWeight: 500, ml: 2 }}>
                Feedback
              </Typography>
            </ListItemButton>
          </List>
        </Collapse>
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ my: 2 }} />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "16px 8px",
          transition: "padding 0.3s",
          cursor: "pointer", // Change cursor to pointer
          "&:hover": {
            // Add hover effect
            backgroundColor: "rgba(0, 0, 0, 0.08)", // Light background on hover
            borderRadius: "4px", // Optional: round corners
          },
        }}
        onClick={handleMenuClick} // Open menu on avatar click
      >
        <Avatar src="/path/to/avatar.jpg" />
        {isOpen && (
          <Box
            sx={{
              marginLeft: "8px",
              display: "flex",
              flexDirection: "column",
              maxWidth: "240px", // Adjust width as needed
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontFamily: "Inter",
                fontWeight: 600,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {localStorage.getItem("name")}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontFamily: "Inter",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {localStorage.getItem("email")}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Dropdown menu for account actions */}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            maxHeight: "200px", // Set a max height if needed
          },
        }}
      >
        <MenuItem onClick={handleCloseMenu} sx={{ "&:focus": { outline: "none" } }}>
          <Link to="/my-account" style={{ textDecoration: "none", color: "inherit" }}>
            My Account
          </Link>
        </MenuItem>
        <MenuItem
          sx={{ "&:focus": { outline: "none" } }}
          onClick={() => dispatch(LOGOUT(localStorage.getItem("email"), navigate))}
        >
          Logout
        </MenuItem>
      </Menu>
    </Drawer>
  );
};

export default Sidebar;
