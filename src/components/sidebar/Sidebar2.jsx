import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LOGOUT } from "../../actions/general/ActionCreators";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Avatar,
  Divider,
  Collapse,
  Menu,
  MenuItem,
  useTheme,
  Paper,
  Button,
} from "@mui/material";
import {
  Home,
  BarChart as Analytics,
  Favorite as Donations,
  Settings,
  Info,
  Message as Feedback,
  ChevronLeft,
  ChevronRight,
  AccountCircle,
  Logout,
} from "@mui/icons-material";

const Sidebar = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(true);
  const [expandSettings, setExpandSettings] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: <Home /> },
    { path: "/dashboard/campaign", label: "Campaigns", icon: <Analytics /> },
    { path: "/dashboard/donation", label: "Donations", icon: <Donations /> },
    { path: "/dashboard/about", label: "About", icon: <Info /> },
  ];

  const handleDrawerToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuClick = (event) => {
    if (!isOpen) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    dispatch(LOGOUT(localStorage.getItem("email"), navigate));
  };

  const drawerWidth = isOpen ? 280 : 73;

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: `1px solid ${theme.palette.divider}`,
            transition: theme.transitions.create(["width"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: "hidden",
            backgroundColor: theme.palette.background.default,
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: theme.spacing(2),
            minHeight: 64,
          }}
        >
          {isOpen && (
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {location.pathname === "/dashboard"
                ? "Dashboard"
                : location.pathname.split("/").pop().charAt(0).toUpperCase() +
                  location.pathname.split("/").pop().slice(1)}
            </Typography>
          )}
          <IconButton
            onClick={handleDrawerToggle}
            sx={{ ml: isOpen ? 0 : "auto" }}
          >
            {isOpen ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </Box>

        <Divider />

        {/* Main Menu Items */}
        <List component="nav" sx={{ px: 1 }}>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.path}
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                minHeight: 48,
                borderRadius: 1,
                mb: 0.5,
                justifyContent: isOpen ? "initial" : "center",
                "&.Mui-selected": {
                  backgroundColor: `${theme.palette.primary.main}15`,
                  "&:hover": {
                    backgroundColor: `${theme.palette.primary.main}25`,
                  },
                  "& .MuiListItemIcon-root": {
                    color: theme.palette.primary.main,
                  },
                  "& .MuiListItemText-primary": {
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isOpen ? 2 : "auto",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {isOpen && <ListItemText primary={item.label} />}
            </ListItemButton>
          ))}

        </List>

        <Box sx={{ flexGrow: 1 }} />

        {/* User Profile Section */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mx: 1,
            mb: 2,
            borderRadius: 2,
            bgcolor: theme.palette.grey[50],
          }}
        >
          <Box
            onClick={handleMenuClick}
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              "&:hover": {
                "& .MuiTypography-root": {
                  color: theme.palette.primary.main,
                },
              },
            }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: theme.palette.primary.main,
              }}
            >
              {localStorage.getItem("name")?.charAt(0)}
            </Avatar>
            {isOpen && (
              <Box sx={{ ml: 2, overflow: "hidden" }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {localStorage.getItem("name")}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "block",
                  }}
                >
                  {localStorage.getItem("email")}
                </Typography>
              </Box>
            )}
          </Box>

          {isOpen && (
            <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
              <Button
                component={Link}
                to="/dashboard/my-account"
                variant="outlined"
                size="small"
                startIcon={<AccountCircle />}
                fullWidth
              >
                Profile
              </Button>
              <Button
                variant="contained"
                size="small"
                startIcon={<Logout />}
                onClick={handleLogout}
                fullWidth
                color="error"
              >
                Logout
              </Button>
            </Box>
          )}
        </Paper>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 3,
            sx: {
              minWidth: 200,
              mt: 1,
            },
          }}
        >
          <MenuItem
            component={Link}
            to="/dashboard/my-account"
            onClick={handleMenuClose}
          >
            <ListItemIcon>
              <AccountCircle fontSize="small" />
            </ListItemIcon>
            My Account
          </MenuItem>
          <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
            <ListItemIcon>
              <Logout fontSize="small" sx={{ color: "error.main" }} />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
