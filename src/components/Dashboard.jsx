import React from "react";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";

import { LOGOUT } from "../actions/general/ActionCreators";

function Dashboard() {
    const dispatch = useDispatch();
  return (
    <div>
      <Button type="button" onClick={() => dispatch(LOGOUT())}>
        Logout
      </Button>
    </div>
  );
}

export default Dashboard;
