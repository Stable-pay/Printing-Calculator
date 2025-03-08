const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid authentication token' });
  }
};

// Middleware to check if user has active subscription or credits
const checkSubscription = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if user has active subscription
    if (!user.hasActiveSubscription()) {
      return res.status(403).json({ 
        message: 'Active subscription required',
        subscriptionRequired: true
      });
    }

    // Check if user has available credits
    if (!user.hasCredits()) {
      return res.status(403).json({ 
        message: 'No credits available',
        creditsRequired: true
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking subscription status' });
  }
};

module.exports = {
  auth,
  checkSubscription
};
