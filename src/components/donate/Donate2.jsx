import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
  Stack,
  useTheme,
  LinearProgress,
  Alert,
  Chip,
  InputAdornment,
  Paper,
  Container,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Tooltip,
  FormLabel,
} from "@mui/material";
import {
  CreditCard as CreditCardIcon,
  Campaign as CampaignIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  MonetizationOn as MoneyIcon,
  Flag as FlagIcon,
  ArrowBack as ArrowBackIcon,
  Info as InfoIcon,
  AccessTime as TimeIcon,
  Groups as GroupsIcon,
  Share as ShareIcon,
} from "@mui/icons-material";
import { GETCAMPAIGNBYID } from "../../actions/campaigns/ActionCreators";
import { useDispatch, useSelector } from "react-redux";

const stripePromise = loadStripe(`${import.meta.env.VITE_STRIPE_PUBLISH_KEY}`);

const CampaignDetails = ({ campaign }) => {
  const theme = useTheme();

  if (!campaign || Object.keys(campaign).length === 0) return null;

  const progress = Math.min((campaign.raisedAmount / campaign.targetAmount) * 100, 100);
  const daysLeft = Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        maxWidth: 900,
        mx: "auto",
        mb: 4,
      }}
    >
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          p: 3,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "primary.dark",
            opacity: 0.1,
            zIndex: 0,
          }}
        />
        <Stack direction="row" spacing={3} alignItems="center" position="relative">
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: "primary.light",
            }}
          >
            <CampaignIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Box flex={1}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {campaign.title}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                icon={campaign.isActive ? <CheckIcon /> : <CancelIcon />}
                label={campaign.isActive ? "Active Campaign" : "Inactive"}
                color={campaign.isActive ? "success" : "default"}
                sx={{ bgcolor: "white" }}
              />
              <Chip icon={<TimeIcon />} label={`${daysLeft} days left`} sx={{ bgcolor: "white" }} />
              <IconButton color="inherit" size="small">
                <ShareIcon />
              </IconButton>
            </Stack>
          </Box>
        </Stack>
      </Box>

      <CardContent sx={{ p: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="body1" paragraph>
              {campaign.description}
            </Typography>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Fundraising Progress
              </Typography>
              <Paper elevation={0} sx={{ p: 3, bgcolor: "grey.50", borderRadius: 2 }}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="h4" color="primary.main" fontWeight="bold">
                      ${campaign.raisedAmount.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      raised of ${campaign.targetAmount.toLocaleString()} goal
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: "grey.200",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 5,
                      },
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" align="right">
                    {progress.toFixed(1)}% Complete
                  </Typography>
                </Stack>
              </Paper>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, bgcolor: "grey.50", borderRadius: 2 }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Campaign Period
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Start Date
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {new Date(campaign.startDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        End Date
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {new Date(campaign.endDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Campaign Stats
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Box flex={1}>
                      <Typography variant="h6" color="primary.main" fontWeight="bold">
                        {Math.ceil((campaign.raisedAmount / campaign.targetAmount) * 100)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Funded
                      </Typography>
                    </Box>
                    <Box flex={1}>
                      <Typography variant="h6" color="primary.main" fontWeight="bold">
                        {daysLeft}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Days Left
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const PaymentForm = ({ campaign, handleGetCampaginById }) => {
  const theme = useTheme();
  const stripe = useStripe();
  const elements = useElements();
  const [activeStep, setActiveStep] = useState(0);

  const [formData, setFormData] = useState({
    amount: "",
    cardHolderName: "",
    country: "",
    address: "",
    cardType: "",
    currency: "",
  });
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [messageType, setMessageType] = useState("info");

  const steps = ["Donation Amount", "Personal Information", "Payment Details"];

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setMessage("");

    try {
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardNumberElement),
        billing_details: {
          name: formData.cardHolderName,
          address: {
            line1: formData.address,
            country: formData.country,
          },
        },
      });

      if (error) {
        setMessage(error.message);
        setMessageType("error");
        return;
      }

      const { data } = await axios.post("http://localhost:3000/api/v1/donation/donate", {
        ...formData,
        amount: amount, // Use the formatted amount
        paymentMethodId: paymentMethod.id,
        userId: localStorage.getItem("userId"),
        campaignId: campaign._id,
      });

      setMessage(data.message);
      setMessageType("success");
      setFormData({
        amount: "",
        cardHolderName: "",
        country: "",
        address: "",
        cardType: "",
        currency: "USD",
      });
      handleGetCampaginById();
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setIsProcessing(false);
    }
  };

  const currencies = [
    { value: "USD", label: "USD - United States Dollar" },
    { value: "CAD", label: "CAD - Canadian Dollar" },
    { value: "GBP", label: "GBP - British Pound" },
  ];

  const countries = [
    { value: "US", label: "United States" },
    { value: "CA", label: "Canada" },
    { value: "GB", label: "United Kingdom" },
    { value: "FR", label: "France" },
    { value: "DE", label: "Germany" },
  ];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" color="primary">
              Choose Your Donation Amount
            </Typography>
            <Grid container spacing={2}>
              {[10, 25, 50, 100, 250, 500].map((amount) => (
                <Grid item xs={6} sm={4} key={amount}>
                  <Button
                    fullWidth
                    variant={formData.amount === amount.toString() ? "contained" : "outlined"}
                    onClick={() => setFormData({ ...formData, amount: amount.toString() })}
                    sx={{ py: 2, borderRadius: 2 }}
                  >
                    ${amount}
                  </Button>
                </Grid>
              ))}
              <Grid item xs={12}>
                <FormLabel htmlFor="amount" sx={{ mb: 1, fontWeight: "bold" }}>
                  Amount{" "}
                </FormLabel>
                <TextField
                  fullWidth
                  type="number"
                  value={formData.amount}
                  onChange={handleChange("amount")}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  sx={{ mt: 2 }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormLabel htmlFor="currency" sx={{ mb: 1, fontWeight: "bold" }}>
                  Currency
                </FormLabel>
                <TextField
                  select
                  fullWidth
                  value={formData.currency}
                  onChange={handleChange("currency")}
                  required
                >
                  {currencies.map((currency) => (
                    <MenuItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" color="primary">
              Personal Information
            </Typography>
            <FormLabel htmlFor="cardHolderName" sx={{ mb: 1, fontWeight: "bold" }}>
              Full Name
            </FormLabel>
            <TextField
              fullWidth
              placeholder="Full Name"
              value={formData.cardHolderName}
              onChange={handleChange("cardHolderName")}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <FormLabel htmlFor="address" sx={{ mb: 1, fontWeight: "bold" }}>
              Address{" "}
            </FormLabel>
            <TextField
              fullWidth
              placeholder="Address"
              value={formData.address}
              onChange={handleChange("address")}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <FormLabel htmlFor="country" sx={{ mb: 1, fontWeight: "bold" }}>
              Country{" "}
            </FormLabel>
            <TextField
              select
              fullWidth
              placeholder="Country"
              value={formData.country}
              onChange={handleChange("country")}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FlagIcon color="action" />
                  </InputAdornment>
                ),
              }}
            >
              {countries.map((country) => (
                <MenuItem key={country.value} value={country.value}>
                  {country.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" color="primary">
              Payment Details
            </Typography>

            <FormLabel htmlFor="cardType" sx={{ mb: 1, fontWeight: "bold" }}>
              Card Type
            </FormLabel>
            <TextField
              select
              fullWidth
              value={formData.cardType}
              onChange={handleChange("cardType")}
              required
            >
              <MenuItem value="Visa">Visa</MenuItem>
              <MenuItem value="MasterCard">MasterCard</MenuItem>
              <MenuItem value="AmericanExpress">American Express</MenuItem>
              <MenuItem value="Discover">Discover</MenuItem>
            </TextField>

            <Box>
              <Typography variant="caption" color="text.secondary" mb={1} fontWeight={"bold"}>
                Card Number
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  bgcolor: "grey.50",
                  "& .StripeElement": {
                    width: "100%",
                  },
                }}
              >
                <CardNumberElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": {
                          color: "#aab7c4",
                        },
                      },
                      invalid: {
                        color: "#9e2146",
                      },
                    },
                  }}
                />
              </Paper>
            </Box>

            <Grid container sx={{ justifyContent: "space-between" }}>
              <Grid item xs={12} sm={5}>
                <Typography variant="caption" color="text.secondary" mb={1} fontWeight={"bold"}>
                  Expiration Date
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: "grey.50",
                    "& .StripeElement": {
                      width: "100%",
                    },
                  }}
                >
                  <CardExpiryElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#424770",
                          "::placeholder": {
                            color: "#aab7c4",
                          },
                        },
                        invalid: {
                          color: "#9e2146",
                        },
                      },
                    }}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12} sm={5}>
                <Typography variant="caption" color="text.secondary" mb={1} fontWeight={"bold"}>
                  CVC
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: "grey.50",
                    "& .StripeElement": {
                      width: "100%",
                    },
                  }}
                >
                  <CardCvcElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#424770",
                          "::placeholder": {
                            color: "#aab7c4",
                          },
                        },
                        invalid: {
                          color: "#9e2146",
                        },
                      },
                    }}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Stack>
        );
      default:
        return null;
    }
  };

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 4,
        maxWidth: 900,
        mx: "auto",
        mb: 4,
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box>
          <Stack spacing={4}>
            {message && (
              <Alert severity={messageType} sx={{ borderRadius: 2 }}>
                {message}
              </Alert>
            )}

            <Box>
              <Typography variant="h5" gutterBottom fontWeight="600">
                Make a Donation
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your support makes a difference. Complete the form below to process your donation.
              </Typography>
            </Box>

            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box component="form" onSubmit={(e) => handleSubmit(e)}>
              {getStepContent(activeStep)}

              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                >
                  Back
                </Button>
                {activeStep === steps.length - 1 ? (
                  <Button
                    type={isProcessing ? "button" : "submit"}
                    variant="contained"
                    disabled={!stripe || isProcessing}
                    sx={{
                      borderRadius: 2,
                      position: "relative",
                      minWidth: 200,
                    }}
                  >
                    {isProcessing ? "Processing..." : "Complete Donation"}
                    {isProcessing && (
                      <LinearProgress
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: 4,
                          borderRadius: "0 0 8px 8px",
                        }}
                      />
                    )}
                  </Button>
                ) : (
                  <Button
                    type="buttond"
                    variant="contained"
                    onClick={() => handleNext()}
                    sx={{ borderRadius: 2 }}
                    disabled={!formData.amount && !formData.cardHolderName && activeStep === 0}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

const Donate = () => {
  const theme = useTheme();
  const { id } = useParams();
  const dispatch = useDispatch();
  const campaign = useSelector((state) => state.CampaignsReducer.campaignById);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(GETCAMPAIGNBYID(id));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, dispatch]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <LinearProgress sx={{ width: "50%" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "grey.100",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 4 }}
          onClick={() => window.history.back()}
        >
          Back to Campaigns
        </Button>

        <Elements stripe={stripePromise}>
          {campaign && <CampaignDetails campaign={campaign} />}
          {campaign && (
            <PaymentForm
              campaign={campaign}
              handleGetCampaginById={() => dispatch(GETCAMPAIGNBYID(id))}
            />
          )}
        </Elements>
      </Container>
    </Box>
  );
};

export default Donate;
