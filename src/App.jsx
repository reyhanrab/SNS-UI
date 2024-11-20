import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
// import Dashboard from "./components/Dashboard";
import Dashboard from "./components/Dashboard2";

// import Campaigns from "./components/Campaigns/Campaigns";
import Campaigns from "./components/Campaigns/Campaigns2";

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
// import Donate from "./components/donate/Denate2";

// import MyAccount from "./components/myAccount/myAccount";
import MyAccount from "./components/myAccount/MyAccount2";

// import Donations from "./components/donate/donations/Donations";
import Donations from "./components/donate/donations/Donations2";

import AboutUs from "./components/AboutUs";

function App() {
  return (
    <Provider store={Store}>
      <AppTheme>
        <CssBaseline enableColorScheme />

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
              <Route exact index element={<ProtectedRoutes Component={Dashboard} />} />
              <Route exact path="campaign" element={<ProtectedRoutes Component={Campaigns} />} />
              <Route exact path="donation" element={<ProtectedRoutes Component={Donations} />} />
              <Route path="donate/:id" element={<ProtectedRoutes Component={Donate} />} />
              <Route path="my-account" element={<ProtectedRoutes Component={MyAccount} />} />
              <Route path="about" element={<ProtectedRoutes Component={AboutUs} />} />
              {/* New Campaigns Page */}
              <Route path="*" element={<PageNotFound />} />
            </Route>

            {/* Redirect unknown routes */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </AppTheme>
    </Provider>
  );
}

export default App;
