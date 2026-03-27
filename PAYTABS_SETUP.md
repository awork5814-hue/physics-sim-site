# PayTabs Integration Setup Guide (USD)

## Overview

This project uses PayTabs Hosted Payment Page for USD payments. Customers are redirected to PayTabs to complete card payments, then returned to the pricing page.

## Required Environment Variables

```bash
PAYTABS_PROFILE_ID="your_profile_id"
PAYTABS_SERVER_KEY="your_server_key"
PAYTABS_BASE_URL="https://secure-egypt.paytabs.com"  # Change to your PayTabs region domain
BASE_URL="https://your-domain.com"

# Optional overrides (defaults to BASE_URL + /api/paytabs/return|callback)
PAYTABS_RETURN_URL="https://your-domain.com/api/paytabs/return"
PAYTABS_CALLBACK_URL="https://your-domain.com/api/paytabs/callback"
```

## Flow Summary

1. User clicks a USD plan → PayTabs modal collects name/email/phone.
2. Backend calls PayTabs `/payment/request` and returns `redirect_url`.
3. Browser redirects to PayTabs hosted checkout page.
4. PayTabs posts back to:
   - `PAYTABS_CALLBACK_URL` (server-to-server)
   - `PAYTABS_RETURN_URL` (user browser return)
5. The server updates the subscription for logged-in users and redirects the user to `pricing.html` with a status message.

## Notes

- Use HTTPS for return/callback URLs in production.
- Ensure the PayTabs domain matches your merchant region.
