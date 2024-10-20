import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Provider } from "react-redux";

import Store from "./store/Store";
import SignUp from "./components/auth/Signup";
import ProtectedRoutes from "./ProtectedRoutes";
import Login from "./components/auth/Login";
import Dashboard from "./components/Dashboard";
import AppTheme from "./components/auth/theme/AppTheme";
import { CssBaseline } from "@mui/material";

function App() {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
    <Provider store={Store}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<ProtectedRoutes Component={Dashboard} />} />
        </Routes>
      </Router>
    </Provider>
    </AppTheme>
  );
}

export default App;
