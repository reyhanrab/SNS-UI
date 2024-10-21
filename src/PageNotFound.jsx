// NotFound.jsx
import React from 'react';
import { Typography, Box } from '@mui/material';

const PageNotFound = () => (
  <Box 
    display="flex" 
    flexDirection="column" 
    alignItems="center" 
    justifyContent="center" 
    height="100vh"
  >
    <Typography variant="h2" gutterBottom>
      404 - Page Not Found
    </Typography>
    <Typography variant="body1" gutterBottom>
      The page you're looking for doesn't exist.
    </Typography>
  </Box>
);

export default PageNotFound;
