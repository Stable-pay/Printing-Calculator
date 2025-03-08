const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['basic', 'premium']
  },
  interval: {
    type: String,
    required: true,
    enum: ['monthly', 'yearly']
  },
  price: {
    type: Number,
    required: true
  },
  credits: {
    type: Number,
    required: true
  },
  features: [{
    type: String
  }],
  stripePriceId: {
    type: String,
    required: true
  }
});

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubscriptionPlan',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'canceled', 'expired'],
    default: 'active'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  stripeSubscriptionId: String,
  cancelAtPeriodEnd: {
    type: Boolean,
    default: false
  }
});

const SubscriptionPlan = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
const Subscription = mongoose.model('Subscription', subscriptionSchema);

// Default subscription plans
const defaultPlans = [
  {
    name: 'basic',
    interval: 'monthly',
    price: 999, // $9.99
    credits: 100,
    features: [
      'Up to 100 calculations per month',
      'Basic support',
      'Standard response time'
    ],
    stripePriceId: 'price_basic_monthly'
  },
  {
    name: 'basic',
    interval: 'yearly',
    price: 9990, // $99.90
    credits: 1200,
    features: [
      'Up to 1200 calculations per year',
      'Basic support',
      'Standard response time',
      '17% discount'
    ],
    stripePriceId: 'price_basic_yearly'
  },
  {
    name: 'premium',
    interval: 'monthly',
    price: 1999, // $19.99
    credits: 300,
    features: [
      'Up to 300 calculations per month',
      'Priority support',
      'Fast response time',
      'Advanced features'
    ],
    stripePriceId: 'price_premium_monthly'
  },
  {
    name: 'premium',
    interval: 'yearly',
    price: 19990, // $199.90
    credits: 3600,
    features: [
      'Up to 3600 calculations per year',
      'Priority support',
      'Fast response time',
      'Advanced features',
      '17% discount'
    ],
    stripePriceId: 'price_premium_yearly'
  }
];

// Function to initialize default plans
async function initializeDefaultPlans() {
  try {
    for (const plan of defaultPlans) {
      await SubscriptionPlan.findOneAndUpdate(
        { name: plan.name, interval: plan.interval },
        plan,
        { upsert: true, new: true }
      );
    }
    console.log('Default subscription plans initialized');
  } catch (error) {
    console.error('Error initializing subscription plans:', error);
  }
}

module.exports = {
  SubscriptionPlan,
  Subscription,
  initializeDefaultPlans
};
