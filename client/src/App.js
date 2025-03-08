import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, Button, Typography } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Plans from './components/Subscription/Plans';
import CombinedCalculators from './CombinedCalculators';
import AdminPanel from './AdminPanel';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Subscription Required Route Component
const SubscriptionRoute = ({ children }) => {
  const { user, hasActiveSubscription, hasCredits } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (!hasActiveSubscription() || !hasCredits()) {
    return <Navigate to="/subscription/plans" />;
  }
  
  return children;
};

// Navigation Component
const Navigation = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Printing Calculator
        </Typography>
        
        {user ? (
          <Box>
            <Button color="inherit" href="/">
              Calculator
            </Button>
            <Button color="inherit" href="/subscription/plans">
              Subscription
            </Button>
            {user.subscription?.credits && (
              <Button color="inherit" disabled>
                Credits: {user.subscription.credits}
              </Button>
            )}
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Box>
            <Button color="inherit" href="/login">
              Login
            </Button>
            <Button color="inherit" href="/register">
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          <Navigation />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route
              path="/subscription/plans"
              element={
                <ProtectedRoute>
                  <Plans />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            
            {/* Subscription Required Routes */}
            <Route
              path="/"
              element={
                <SubscriptionRoute>
                  <CombinedCalculators />
                </SubscriptionRoute>
              }
            />
          </Routes>
        </Box>
      </Router>
    </AuthProvider>
  );
}

export default App;
