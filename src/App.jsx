import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Campaigns from "./components/Campaigns/Campaigns";
import SignUp from "./components/auth/Signup";
import Login from "./components/auth/Login";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/PasswordReset";
import { Provider } from "react-redux";
import Store from "./store/Store";
import AppTheme from "./components/auth/theme/AppTheme";
import { CssBaseline } from "@mui/material";
import Layout from "./components/sidebar/Layout";
import ProtectedRoutes from "./ProtectedRoutes";
import PageNotFound from "./PageNotFound";
import Donate from "./components/donate/Donate";

function App() {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <AppTheme>
        <CssBaseline enableColorScheme />
        <Provider store={Store}>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Authenticated Routes with Sidebar */}
              <Route path="/dashboard" element={<Layout />}>
                <Route exact index element={<ProtectedRoutes Component={Dashboard} />} />{" "}
                {/* Default Dashboard */}
                <Route exact path="campaigns" element={<ProtectedRoutes Component={Campaigns} />}
                />{" "}
              <Route exact path="donate" element={<ProtectedRoutes Component={Donate} />} />{" "}
                {/* New Campaigns Page */}
                <Route path="*" element={<PageNotFound />} />
              </Route>

              {/* Redirect unknown routes */}
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Router>
        </Provider>
      </AppTheme>
    </AppTheme>
  );
}

export default App;
