-- Add Composio-related columns for Gmail integration
ALTER TABLE settings
ADD COLUMN IF NOT EXISTS composio_user_id TEXT,
ADD COLUMN IF NOT EXISTS composio_connected_account_id TEXT;
