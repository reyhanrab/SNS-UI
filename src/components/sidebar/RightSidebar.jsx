import React, { useState, useMemo, useCallback } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  IconButton,
  Box,
  Typography,
  Divider,
  Collapse,
  ListItem,
  ListItemText,
} from "@mui/material";
import { ExpandLess, ExpandMore, NotificationImportant, Info, Warning } from "@mui/icons-material";
import { GETNOTIFICATIONS } from "../../actions/notifications/ActionCreators";
import { useDispatch } from "react-redux";

const RightSidebar = () => {
  const [isOpen, setIsOpen] = useState(true); // State to manage open/close
  const [areNotificationsOpen, setAreNotificationsOpen] = useState(true); // State to manage notifications open/close

  const toggleSidebar = useCallback(() => setIsOpen((prev) => !prev), []);
  const toggleNotifications = () => setAreNotificationsOpen((prev) => !prev);

  return (
    <Drawer
      anchor="right"
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
        <IconButton onClick={toggleSidebar}>{isOpen ? <ExpandLess /> : <ExpandMore />}</IconButton>
        {isOpen && (
          <IconButton onClick={toggleNotifications}>
            {areNotificationsOpen ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        )}
      </Box>

      {isOpen && (
        <>
          <Divider sx={{ my: 1 }} />
          <Collapse in={areNotificationsOpen}>
            <Notifications /> {/* Notifications component */}
          </Collapse>
        </>
      )}
    </Drawer>
  );
};

const Notifications = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.NotificationsReducernotifications);
  const loading = useSelector((state) => state.NotificationsReducerloading);
  const hasMore = useSelector((state) => state.NotificationsReducerhasMore);
  const [offset, setOffset] = useState(0);
  const limit = 20; // Number of notifications to load at a time

  // Load notifications when component mounts or when offset changes
  useEffect(() => {
    if (hasMore) {
      dispatch(GETNOTIFICATIONS(offset, limit));
    }
  }, [dispatch, offset, hasMore]);
  const NotificationIcon = ({ type }) => {
    switch (type) {
      case "info":
        return <Info color="primary" />;
      case "warning":
        return <Warning color="warning" />;
      default:
        return <NotificationImportant color="action" />;
    }
  };

  return (
    <Box sx={{ width: 250, padding: 2, maxHeight: 400, overflowY: "auto" }}>
      <Typography variant="h6" gutterBottom>
        Notifications
      </Typography>
      <Divider />
      <List>
        {notifications.map(({ id, type, message, timestamp }) => (
          <ListItem key={id}>
            <ListItemIcon>
              <NotificationIcon type={type} />
            </ListItemIcon>
            <ListItemText primary={message} secondary={timestamp} />
          </ListItem>
        ))}
      </List>
      {hasMore && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <button onClick={() => setOffset((prev) => prev + limit)} disabled={loading}>
            {loading ? "Loading..." : "Load More"}
          </button>
        </Box>
      )}
    </Box>
  );
};

export default RightSidebar;
