# Data Backup & Disaster Recovery Strategy

To ensure "Launch Readiness", we have established a multi-tier backup strategy to protect the AI Job Board's data against accidental deletion, system failures, or malicious activity.

## 🟢 1. Platform Backups (Supabase Default)
Supabase handles the heavy lifting for daily operations:
- **Daily Backups**: Supabase automatically performs a full backup of your database every day.
- **Retention**: On the Free plan, backups are available for 1 day. On **Pro**, retention increases to **7 days**.
- **Point-in-Time Recovery (PITR)**: *Highly Recommended for Scaling*. PIPR allows you to restore your database to any specific second within the retention period. This is available on the Supabase Pro plan.

## 🟡 2. Manual Snapshot Strategy (Developer Controlled)
For critical updates or pre-launch milestones, perform a manual dump of the schema and data.

### Database Export:
You can export all your data directly from the Supabase Dashboard:
1.  Go to **Table Editor**.
2.  Click **Export** on each table to get a CSV of your data.
3.  Alternatively, use the **Supabase CLI** locally:
    ```bash
    supabase db dump --project-ref your-project-id > backup.sql
    ```

### Asset Backup (CVs & Videos):
Since storage files are not included in DB dumps:
1.  Periodically sync your Supabase buckets with a local drive or a secondary cloud (S3/GCP) using the Supabase API.

## 🔴 3. Application Code Backup
- **Version Control**: The entire application source code is maintained in **Git**.
- **Continuous Deployment**: Ensure your repository is pushed to a private **GitHub/GitLab** instance. This acts as a backup for the business logic and UI.

## 🛠️ Disaster Recovery Steps
1.  **If the DB is Corrupted**: Use the Supabase Dashboard "Restore" feature (requires Pro for PIPR).
2.  **If a User Deletes their Profile**: We use `ON DELETE CASCADE` on foreign keys. If a profile is deleted, their applications are purged automatically to maintain orphan-free integrity.
3.  **If Media is Lost**: Re-request the candidate to upload their CV via a "Re-Sync" prompt in the profile management section.

---
**Recommendation**: Move to the **Supabase Pro Tier ($25/mo)** before hitting 1,000 active users to enable 7-day PITR and larger storage limits.
