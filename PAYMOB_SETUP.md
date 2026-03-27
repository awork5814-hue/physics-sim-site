# Paymob Integration Setup Guide

## Overview

This project includes Paymob integration for Egyptian payment processing. Currently runs in **demo/mock mode** - configure your Paymob credentials for live payments.

## Pricing

| Plan | USD | EGP |
|------|-----|-----|
| Yearly | $10 | 300 EGP |
| Monthly | $1 | 50 EGP |

## Setup Instructions

### 1. Get Paymob Credentials

1. Sign up at [Paymob Dashboard](https://accept.paymob.com/)
2. Go to Settings > Developers
3. Copy your API Key

### 2. Get Integration ID

1. In Paymob dashboard, go to Acceptance > Payment Methods
2. Select your merchant account
3. Copy the Integration ID for your iframe

### 3. Configure Environment Variables

```bash
# Linux/Mac
export PAYMOB_API_KEY="your_api_key_here"
export PAYMOB_INTEGRATION_ID="your_integration_id"
export PAYMOB_IFRAME_ID="your_iframe_id"

# Or create .env file (install dotenv first: npm i dotenv)
```

### 4. Run the Server

```bash
node server.js
```

## How It Works

### Payment Flow

1. **User selects plan** → Opens payment modal
2. **User enters details** → Name, email, phone
3. **User selects payment method** → Card, Fawry, wallet, installments
4. **Backend creates Paymob order** → Returns payment token
5. **Frontend renders Paymob iframe** → User enters card details
6. **Paymob processes payment** → Webhook notifies backend
7. **Subscription activated** → User can access premium features

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/paymob/create-order` | POST | Create payment order |
| `/api/paymob/webhook` | POST | Receive Paymob webhooks |
| `/api/subscription/status` | GET | Check subscription status |

## Production Checklist

- [ ] Replace mock mode with real Paymob API calls
- [ ] Set up webhook URL in Paymob dashboard
- [ ] Enable 3DSecure for cards
- [ ] Add HMAC verification for webhooks
- [ ] Use database instead of in-memory storage
- [ ] Add email notifications
- [ ] Implement subscription renewal reminders

## Testing

Use Paymob test cards:
- Success: `4111111111111111` / any future date / any CVV
- Decline: `4000000000000002`

## Support

- Paymob Docs: https://accept.paymob.com/sdk/index
- Dashboard: https://accept.paymob.com/
