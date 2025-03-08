import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  CircularProgress
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const stripePromise = loadStripe('your_publishable_key'); // Replace with your Stripe publishable key

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/subscription/plans');
      setPlans(response.data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
    setLoading(false);
  };

  const handleSubscribe = async (planId) => {
    try {
      setProcessingPayment(true);
      const stripe = await stripePromise;
      
      // Create checkout session
      const response = await axios.post('http://localhost:5001/api/subscription/create-checkout-session', {
        planId
      });

      // Redirect to Stripe checkout
      const result = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Error processing subscription:', error);
      alert('Failed to process subscription. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Choose Your Plan
      </Typography>
      
      <Typography variant="subtitle1" gutterBottom align="center" sx={{ mb: 4 }}>
        Select the plan that best fits your needs
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {plans.map((plan) => (
          <Grid item xs={12} sm={6} md={4} key={plan._id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}
            >
              {plan.name === 'premium' && (
                <Chip
                  label="BEST VALUE"
                  color="primary"
                  sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10
                  }}
                />
              )}
              
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}
                </Typography>
                
                <Typography variant="h4" component="div" gutterBottom>
                  ₹{(plan.price / 100).toFixed(2)}
                  <Typography variant="subtitle1" component="span" color="text.secondary">
                    /{plan.interval}
                  </Typography>
                </Typography>

                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {plan.credits} calculations included
                </Typography>

                <List dense>
                  {plan.features.map((feature, index) => (
                    <ListItem key={index}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color={plan.name === 'premium' ? 'primary' : 'secondary'}
                  onClick={() => handleSubscribe(plan._id)}
                  disabled={processingPayment}
                >
                  {processingPayment ? 'Processing...' : 'Subscribe Now'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {user?.subscription?.type !== 'none' && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Current Plan: {user.subscription.type.charAt(0).toUpperCase() + user.subscription.type.slice(1)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Credits Remaining: {user.subscription.credits}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
