import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
// import Sidebar from "./Sidebar";
import Sidebar from "./Sidebar2";
import RightSidebar from "./RightSidebar";
import { useDispatch } from "react-redux";
import { GETDONATIONSUMMARYFORUSER, GETUSERDATABYID } from "../../actions/users/ActionCreators";

const Layout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GETUSERDATABYID(localStorage.getItem("userId")));
    dispatch(GETDONATIONSUMMARYFORUSER(localStorage.getItem("userId")));
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
      {/* <RightSidebar /> */}
    </Box>
  );
};

export default Layout;
