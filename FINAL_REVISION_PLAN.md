# Final Plan: Mixed Audio Revision System

This system allows clients to request a maximum of **two reviews** for their mixed audio tapes. We are using a dedicated table to track these requests to keep your existing data clean.

## 1. Database Schema (Run in Supabase SQL Editor)

We will create a single table to store the revision requests and client feedback.

```sql
-- Table to track revision requests
CREATE TABLE IF NOT EXISTS mixed_track_revisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES profiles(id),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    revision_number INTEGER, -- 1 or 2
    notes TEXT,               -- Client feedback notes
    status TEXT DEFAULT 'pending', -- 'pending' or 'resolved'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Security
ALTER TABLE mixed_track_revisions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage their own revisions" ON mixed_track_revisions
    FOR ALL USING (auth.uid() = client_id);

CREATE POLICY "Admins can view all revisions" ON mixed_track_revisions
    FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
```

## 2. Client Portal Logic (`app/portal/page.tsx`)

### Tracking the Limit
We will fetch the count of records in `mixed_track_revisions` for the current project.
- If `count < 2`: Show **"Request Review"** button.
- If `count >= 2`: Show **"Maximum Reviews Reached"** message.

### Requesting a Review
When the client clicks "Request Review":
1. Open a modal to collect their `notes`.
2. Insert a new row into `mixed_track_revisions` with `revision_number = count + 1`.

## 3. Admin Dashboard Logic (`app/admin/page.tsx`)

### Viewing Requests
The admin dashboard will display a badge if a client has a `pending` revision request.
- Clicking the client will show their feedback notes from the `mixed_track_revisions` table.

### Resolving Requests
When the admin uploads a new mixed track for that client:
1. They can mark the latest revision as `resolved`.
2. This signals to the client that their feedback has been addressed.

## 4. Why this works
- **No data mess**: We aren't adding columns to your track tables.
- **Limit Enforcement**: The 2-review limit is strictly enforced by counting rows in the new table.
- **Flexible**: Even if the admin uploads 5 tracks, the client still only gets 2 formal "Review Requests".
