import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import {
  FormLabel,
  FormControl,
  Stack,
  Box,
  Typography,
  TextField,
  Link as MuiLink,
  Button,
  Card as MuiCard,
  CircularProgress,
  Alert,
} from "@mui/material";

import { styled } from "@mui/material/styles";
import ColorModeSelect from "./theme/ColorModeSelect";

import ForgotPassword from "./ForgotPassword";
import { LOGIN } from "../../actions/general/ActionCreators";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  padding: 20,
  marginTop: "10vh",
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage: "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage: "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

const Login = () => {
  const dispatch = useDispatch();
  const formRef = React.useRef();
  const navigate = useNavigate();

  const errorMsg = useSelector((state) => state.GeneralReducer.errorMsg);

  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const obj = Object.fromEntries(data);

    // Trim values and validate inputs
    for (const key in obj) {
      let trimmedValue = obj[key].trim();
      if (trimmedValue.length === 0) {
        delete obj[key];
      }
    }
    // Set loading to true while awaiting the response
    setLoading(true);
    dispatch(LOGIN(obj, formRef, navigate, setLoading));
  };

  const validateInputs = () => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  return (
    <SignInContainer
      direction="column"
      justifyContent="space-between"
      minWidth={"100vw"}
      minHeight={"100vh"}
    >
      <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
      <Card variant="outlined">
        <Typography
          component="h1"
          variant="h4"
          sx={{
            width: "100%",
            fontSize: "clamp(2rem, 10vw, 2.15rem)",
            textAlign: "center",
            color: "primary.main",
          }}
        >
          Scope N' Stack
        </Typography>
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "90%", fontSize: "clamp(2rem, 10vw, 2.15rem)", textAlign: "center" }}
        >
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={(e) => handleSubmit(e)}
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
          ref={formRef}
        >
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              error={emailError}
              helpertext={emailErrorMessage}
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={emailError ? "error" : "primary"}
              sx={{ ariaLabel: "email" }}
            />
          </FormControl>
          <FormControl>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <MuiLink
                component="button"
                onClick={handleClickOpen}
                variant="body2"
                sx={{ alignSelf: "baseline" }}
                type="button" // Prevent form submission
              >
                Forgot your password?
              </MuiLink>
            </Box>
            <TextField
              error={passwordError}
              helperText={passwordErrorMessage}
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="current-password"
              required
              fullWidth
              variant="outlined"
              color={passwordError ? "error" : "primary"}
            />
          </FormControl>
          {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
          <ForgotPassword open={open} handleClose={handleClose} />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={validateInputs}
            disabled={loading} // Disable the button when loading
          >
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Sign in"}
          </Button>
          <Typography sx={{ textAlign: "center" }}>
            Don&apos;t have an account?{" "}
            <span>
              <Link to="/signup">
                <MuiLink variant="body2" sx={{ alignSelf: "center" }}>
                  Sign up
                </MuiLink>
              </Link>
            </span>
          </Typography>
          {errorMsg.length > 0 ? <Alert severity="error">{errorMsg}</Alert> : ""}{" "}
        </Box>
      </Card>
    </SignInContainer>
  );
};

export default Login;
