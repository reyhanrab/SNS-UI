import React, { useState } from "react";
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
import "./Donate.css";
import { useLocation } from "react-router-dom";
import { Card, CardContent, Typography, Divider } from "@mui/material";

const stripePromise = loadStripe(`${import.meta.env.VITE_STRIPE_PUBLISH_KEY}`);

const PaymentForm = ({ campaign }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [cardType, setCardType] = useState(""); // New state for card type
  const [message, setMessage] = useState("");
  const [currency, setCurrency] = useState(""); // State for currency
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      // Create a payment method using the card details
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardNumberElement),
        billing_details: {
          name: cardHolderName,
          address: {
            line1: address,
            country: country,
          },
        },
      });

      if (error) {
        setMessage(`Payment method creation failed: ${error.message}`);
        setIsProcessing(false);
        return;
      }

      // Send the paymentMethod.id to the backend to complete the payment
      const { data } = await axios.post("http://localhost:3000/api/v1/donation/donate", {
        amount: amount, // Adjust this as necessary
        cardHolderName,
        country,
        address,
        cardType,
        currency,
        paymentMethodId: paymentMethod.id,
        userId: localStorage.getItem("userId"),
        campaignId: campaign._id,
      });

      setMessage(data.message);
    } catch (error) {
      setMessage(`Payment error: ${error.message}`);
    }

    setIsProcessing(false);
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        letterSpacing: "0.025em",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };

  return (
    <Card
      sx={{
        backgroundColor: '#f0f8ff',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        borderRadius: 3,
        padding: 2,
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <CardContent>
        <div className="payment-container">
          <form onSubmit={handleSubmit} className="payment-form">
            <h2>Complete Your Payment</h2>
  
            <div className="form-row">
              <input
                type="text"
                placeholder="Card Holder Name"
                value={cardHolderName}
                onChange={(e) => setCardHolderName(e.target.value)}
                required
                className="input-field"
              />
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="input-field"
              />
            </div>
  
            <div className="form-row">
              <div className="card-input-container">
                <label>Card Number</label>
                <CardNumberElement options={cardElementOptions} className="card-element" />
              </div>
  
              <div className="card-input-container">
                <label>Expiration Date</label>
                <CardExpiryElement options={cardElementOptions} className="card-element" />
              </div>
            </div>
  
            <div className="form-row">
              <div className="card-input-container">
                <label>CVC</label>
                <CardCvcElement options={cardElementOptions} className="card-element" />
              </div>
  
              <div className="card-input-container">
                <label>Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  className="input-field"
                >
                  <option value="" disabled>Select Country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                </select>
              </div>
            </div>
  
            <div className="form-row">
              <div className="card-input-container">
                <label>Card Type</label>
                <select
                  value={cardType}
                  onChange={(e) => setCardType(e.target.value)}
                  required
                  className="input-field"
                >
                  <option value="" disabled>Select Card Type</option>
                  <option value="Visa">Visa</option>
                  <option value="MasterCard">MasterCard</option>
                </select>
              </div>
  
              <div className="card-input-container">
                <label>Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  required
                  className="input-field"
                >
                  <option value="" disabled>Select Currency</option>
                  <option value="USD">USD - United States Dollar</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>
            </div>
  
            {/* New input field for amount */}
            <div className="form-row">
              <div className="card-input-container">
                <label>Amount</label>
                <input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="input-field"
                />
              </div>
            </div>
  
            <button
              type="submit"
              disabled={!stripe || isProcessing}
              className="payment-button"
            >
              {isProcessing ? 'Processing...' : 'Submit'}
            </button>
            {message && <p className="payment-message">{message}</p>}
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

const Donate = () => {
  const location = useLocation();

  return (
    <Elements stripe={stripePromise}>
      {location.state && <CampaignDetails campaign={location.state} />}
      <PaymentForm campaign={location.state} />
    </Elements>
  );
};

const CampaignDetails = ({ campaign }) => {
  return (
    <Card
      sx={{
        backgroundColor: "#f0f8ff",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        borderRadius: 3,
        padding: 2,
        mb: 3,
        maxWidth: "600px",
      }}
    >
      <CardContent>
        <Typography
          variant="h5"
          component="div"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#0077b6" }}
        >
          {campaign.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {campaign.description}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body2" sx={{ fontWeight: 500, color: "#555" }}>
          Target Amount: <strong>${campaign.targetAmount.toLocaleString()}</strong>
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 500, color: "#555" }}>
          Raised Amount: <strong>${campaign.raisedAmount.toLocaleString()}</strong>
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 500, color: "#555" }}>
          Start Date: <strong>{new Date(campaign.startDate).toLocaleDateString()}</strong>
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 500, color: "#555" }}>
          End Date: <strong>{new Date(campaign.endDate).toLocaleDateString()}</strong>
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontWeight: 500, color: campaign.isActive ? "#388e3c" : "#d32f2f" }}
        >
          Status: <strong>{campaign.isActive ? "Active" : "Inactive"}</strong>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Donate;
