const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { auth } = require('../middleware/auth');
const { SubscriptionPlan, Subscription } = require('../models/Subscription');
const User = require('../models/User');
const router = express.Router();

// Get all subscription plans
router.get('/plans', async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscription plans', error: error.message });
  }
});

// Get user's current subscription
router.get('/my-subscription', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      userId: req.user._id,
      status: 'active'
    }).populate('planId');
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscription', error: error.message });
  }
});

// Create checkout session for subscription
router.post('/create-checkout-session', auth, async (req, res) => {
  try {
    const { planId } = req.body;
    const plan = await SubscriptionPlan.findById(planId);
    
    if (!plan) {
      return res.status(404).json({ message: 'Subscription plan not found' });
    }

    // Create or get Stripe customer
    let customer;
    if (req.user.stripeCustomerId) {
      customer = await stripe.customers.retrieve(req.user.stripeCustomerId);
    } else {
      customer = await stripe.customers.create({
        email: req.user.email,
        metadata: {
          userId: req.user._id.toString()
        }
      });
      
      // Save Stripe customer ID to user
      req.user.stripeCustomerId = customer.id;
      await req.user.save();
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [{
        price: plan.stripePriceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${req.protocol}://${req.get('host')}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.protocol}://${req.get('host')}/subscription/cancel`,
      metadata: {
        userId: req.user._id.toString(),
        planId: plan._id.toString()
      }
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ message: 'Error creating checkout session', error: error.message });
  }
});

// Handle successful subscription
router.get('/success', auth, async (req, res) => {
  try {
    const { session_id } = req.query;
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    const plan = await SubscriptionPlan.findById(session.metadata.planId);

    // Update user's subscription
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + (plan.interval === 'yearly' ? 12 : 1));

    const newSubscription = new Subscription({
      userId: req.user._id,
      planId: plan._id,
      status: 'active',
      startDate: new Date(),
      endDate: endDate,
      stripeSubscriptionId: subscription.id
    });

    await newSubscription.save();

    // Update user's subscription status and credits
    req.user.subscription = {
      type: plan.name,
      startDate: new Date(),
      endDate: endDate,
      credits: plan.credits,
      interval: plan.interval
    };

    await req.user.save();

    res.json({ message: 'Subscription activated successfully', subscription: newSubscription });
  } catch (error) {
    res.status(500).json({ message: 'Error activating subscription', error: error.message });
  }
});

// Cancel subscription
router.post('/cancel', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      userId: req.user._id,
      status: 'active'
    });

    if (!subscription) {
      return res.status(404).json({ message: 'No active subscription found' });
    }

    // Cancel subscription in Stripe
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true
    });

    // Update subscription status
    subscription.cancelAtPeriodEnd = true;
    await subscription.save();

    res.json({ message: 'Subscription will be canceled at the end of the billing period' });
  } catch (error) {
    res.status(500).json({ message: 'Error canceling subscription', error: error.message });
  }
});

// Webhook handler for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
    }

    res.json({ received: true });
  } catch (error) {
    res.status(400).json({ message: 'Webhook error', error: error.message });
  }
});

async function handleSubscriptionCanceled(stripeSubscription) {
  const subscription = await Subscription.findOne({
    stripeSubscriptionId: stripeSubscription.id
  });

  if (subscription) {
    subscription.status = 'canceled';
    await subscription.save();

    const user = await User.findById(subscription.userId);
    if (user) {
      user.subscription.type = 'none';
      user.subscription.credits = 0;
      await user.save();
    }
  }
}

async function handleSubscriptionUpdated(stripeSubscription) {
  const subscription = await Subscription.findOne({
    stripeSubscriptionId: stripeSubscription.id
  });

  if (subscription) {
    subscription.status = stripeSubscription.status;
    await subscription.save();
  }
}

module.exports = router;
