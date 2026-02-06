# Security Architecture Review: AI Job Board

This document provides an overview of the security measures implemented in the AI Job Board application and details the defensive architecture used to protect user data and ensure system integrity.

## 🛡️ 1. Identity & Access Management (IAM)
- **Authentication Engine**: Powered by **Supabase Auth (GoTrue)** using JWT (JSON Web Tokens).
- **Social Integration**: Secure OAuth2 flows for **Google** and **LinkedIn** ensure users don't need to manage separate passwords for our platform.
- **Role-Based Access Control (RBAC)**: 
  - User roles (`seeker`, `employer`, `admin`) are stored in the `auth.users` metadata and mirrored in the `public.profiles` table.
  - Access to specific UI modules (e.g., Admin Dashboard, Employer Tools) is protected by synchronous checks against the authenticated user's role.

## 🔒 2. Data Layer Security (RLS)
The application implements **Row Level Security (RLS)** at the database level. This means even if the frontend or API is bypassed, the database itself rejects unauthorized queries.

### Key Policies:
- **Profiles**: Restricted so users can only modify their own data. Select access is public for talent discovery but can be toggled via "Stealth Mode".
- **Jobs**: Only the verified employer who created a job manifest can edit or delete it.
- **Applications**: 
  - **Candidates**: Can only see their own applications.
  - **Employers**: Can only see applications submitted to their specific job listings via a secure `EXISTS` check across related tables.

## 📂 3. Media & Storage Security
- **Isolated Buckets**: CVs and Videos are stored in separate Supabase Storage buckets.
- **Path-Based Ownership**: Upload policies enforce that users can only upload files into folders named after their unique `auth.uid`.
- **Conditional Access**: Employers are granted temporary read access to candidate CVs only if a valid application link exists in the database.

## 🌐 4. Network & Frontend Security
- **Vite Environment Encapsulation**: API keys and Supabase URLs are managed via `.env` files and never hardcoded in the source.
- **CORS Protection**: Recommended configuration prevents cross-site request forgery by restricting API access to authorized domains (e.g., localhost during dev, production URL later).
- **HTTPS Enforcement**: Production traffic is expected to be served over SSL/TLS, ensuring data in transit is encrypted.

## 🤖 5. AI Security (Gemini Pro)
- **Stateless Analysis**: The Gemini Pro API integration is stateless. User profile data is sent for matching purposes but not used for training the global model (based on standard Google Cloud AI terms).
- **Serverless Interaction**: Gemini interactions are handled via secure client-side calls using the `VITE_GEMINI_API_KEY`, which should be restricted in the Google Cloud Console to only allow your domain.

---
*Review Date: February 2026*
