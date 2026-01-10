# Supabase Security Configuration Guide

Since I do not have administrative access to your Supabase Dashboard account, you must perform these configuration steps manually.

## 1. Enable Email Verification & Spam Protection
1.  Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Select your project: **`xbymzusuayiczfeyktmk`**.
3.  In the left sidebar, click on the **Authentication** icon (looks like a group of people).
4.  In the inner menu, click on **Providers**.
5.  Click on **Email** to expand the settings.
    *   **Confirm Email:** Ensure this is toggled **ON**. This forces users to verify their email before signing in.
    *   **Secure Password Policy:** It is recommended to enable this to require strong passwords.
6.  Click **Save**.

## 2. Configure CORS (Allowed Origins)
*This restricts which websites are allowed to talk to your database. It prevents malicious sites from hijacking your user's sessions.*

1.  In the left sidebar, click on the **Settings** icon (cogwheel) at the bottom.
2.  Click on **API**.
3.  Scroll down to the **API Settings** / **Privacy** section.
4.  Find the field **Allowed Origins**.
5.  Enter the URLs that should be allowed. Separate multiple URLs with commas.
    *   **Development:** `http://localhost:3000`
    *   **Production:** `https://your-production-domain.com` (Add this once you deploy)
6.  Click **Save**.

## 3. Rate Limiting (Bonus Security)
1.  Go to **Authentication** > **Rate Limits**.
2.  You can adjust how many emails/sign-ins can be attempted per hour to prevent brute-force attacks.
