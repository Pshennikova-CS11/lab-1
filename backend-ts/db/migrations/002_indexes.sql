CREATE INDEX IF NOT EXISTS idx_resources_type
    ON Resources(type);

CREATE INDEX IF NOT EXISTS idx_resources_createdAt
    ON Resources(createdAt);