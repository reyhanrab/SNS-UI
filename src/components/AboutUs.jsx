import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent } from '@mui/material';

const AboutUs = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
      {/* Header Section */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" component="h1" fontWeight="bold" color="primary" gutterBottom>
          About Us
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Empowering campaigns through meaningful contributions. Learn more about our mission, vision, and values.
        </Typography>
      </Box>

      {/* Mission, Vision, Values Section */}
      <Grid container spacing={4}>
        {/* Mission */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" component="h2" color="primary" gutterBottom>
                Our Mission
              </Typography>
              <Typography variant="body2" color="textSecondary">
                To connect donors with impactful campaigns and make giving easier, secure, and transparent.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Vision */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" component="h2" color="primary" gutterBottom>
                Our Vision
              </Typography>
              <Typography variant="body2" color="textSecondary">
                A world where generosity thrives, and every campaign has the resources to make a difference.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Values */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" component="h2" color="primary" gutterBottom>
                Our Values
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Transparency, trust, and innovation drive everything we do to empower change and build lasting impact.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Why Choose Us Section */}
      <Box mt={6} mb={4}>
        <Typography variant="h4" component="h2" textAlign="center" color="primary" gutterBottom>
          Why Choose Us?
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" color="primary" gutterBottom>
              Seamless Donation Process
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Our platform offers an easy-to-use interface, making it simple for donors to contribute to the causes they care about.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" color="primary" gutterBottom>
              Secure Payments
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Integrated with Stripe, we ensure all donations are processed securely and transparently.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" color="primary" gutterBottom>
              Transparent Campaigns
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Every campaign on our platform is vetted to ensure authenticity and impact.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" color="primary" gutterBottom>
              Real Impact
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Your contributions make a real difference in empowering communities and campaigns around the globe.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AboutUs;
