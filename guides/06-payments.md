# Payments & Billing

## Payment Processing

### 1. Stripe (Recommended)
- Subscription management
- Global payment methods
- Tax handling
- Webhook integration

### 2. Alternatives
- **LemonSqueezy** - Creator-focused billing
- **Paddle** - Merchant of record

## Implementation
```javascript
// Stripe integration example
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
```

## Billing Features
- Subscription tiers
- Usage-based pricing
- Proration handling
- Invoice generation

## Tools
- **Stripe** - Payment processing
- **LemonSqueezy** - Creator billing
- **Paddle** - Merchant of record
