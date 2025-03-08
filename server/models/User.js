const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  subscription: {
    type: {
      type: String,
      enum: ['none', 'basic', 'premium'],
      default: 'none'
    },
    startDate: Date,
    endDate: Date,
    credits: {
      type: Number,
      default: 0
    },
    interval: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'monthly'
    }
  },
  stripeCustomerId: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Method to check if user has active subscription
userSchema.methods.hasActiveSubscription = function() {
  if (!this.subscription.endDate) return false;
  return this.subscription.endDate > new Date();
};

// Method to check and update credits
userSchema.methods.hasCredits = function() {
  return this.subscription.credits > 0;
};

userSchema.methods.deductCredit = function() {
  if (this.subscription.credits > 0) {
    this.subscription.credits -= 1;
    return true;
  }
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
