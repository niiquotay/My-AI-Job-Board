# Supabase Social Auth Configuration Guide

To enable Google and LinkedIn authentication, you need to create "Apps" on their respective developer portals and link them to your Supabase project.

---

## 🛠️ Step 1: Pre-requisites
Your Supabase Callback URL is:
`https://xbymzusuayiczfeyktmk.supabase.co/auth/v1/callback`
*(You will need this for both Google and LinkedIn)*

---

## 🔵 1. Configure Google Authentication
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  **Create a Project** (if you don't have one).
3.  Search for **"APIs & Services"** > **"OAuth consent screen"**.
4.  Choose **External** and fill in the required app info (App name, support email).
5.  Go to **"Credentials"** > **"Create Credentials"** > **"OAuth client ID"**.
6.  Select **Web application** as the Application type.
7.  Under **Authorized redirect URIs**, click **ADD URI** and paste:
    `https://xbymzusuayiczfeyktmk.supabase.co/auth/v1/callback`
8.  Click **Create**. Copy your **Client ID** and **Client Secret**.
9.  **In Supabase Dashboard**: Go to **Authentication** > **Providers** > **Google**.
    *   Enable Google Provider.
    *   Paste the Client ID and Client Secret.
    *   Click **Save**.

---

## 🦅 2. Configure LinkedIn Authentication
1.  Go to the [LinkedIn Developer Portal](https://www.linkedin.com/developers/).
2.  Click **Create app**. Fill in the name, your company page (or create a placeholder), and upload a logo.
3.  Go to the **Products** tab and click **Request access** for:
    *   **Sign In with LinkedIn using OpenID Connect** (Mandatory).
4.  Go to the **Auth** tab.
5.  Under **Authorized Redirect URLs**, click the pencil icon and add:
    `https://xbymzusuayiczfeyktmk.supabase.co/auth/v1/callback`
6.  Find your **Client ID** and **Client Secret** on the same **Auth** tab.
7.  **In Supabase Dashboard**: Go to **Authentication** > **Providers** > **LinkedIn**.
    *   Enable LinkedIn Provider.
    *   Paste the Client ID and Client Secret.
    *   **Note**: Ensure you use the Client Secret from the "Auth" tab.
    *   Click **Save**.

---

## 🚀 Step 3: Configure Media Storage
The application now supports cloud-hosted CVs and Video Pitches. You MUST create the following buckets in Supabase:

1.  **In Supabase Dashboard**: Go to **Storage** > **New bucket**.
2.  **Create Bucket 1**:
    *   Name: `cvs`
    *   Public: **Enabled** (or set up specific RLS policies).
3.  **Create Bucket 2**:
    *   Name: `videos`
    *   Public: **Enabled**.
4.  **Important**: If you want restricted access, ensure you add RLS policies to these buckets so only employers can view CVs/Videos related to their jobs.

---

## 🏁 Step 4: Test the flow
Once saved in Supabase, the buttons and uploaders I implemented in your app will automatically start working! 

1.  Open your app: `http://localhost:3001`
2.  Go to **Sign In** or **Sign Up**.
3.  Click the **Google** or **LinkedIn** button.
4.  You should be redirected to the provider's login screen.
