ALTER TABLE Comments ADD COLUMN updatedAt TEXT;
ALTER TABLE Comments ADD COLUMN deletedAt TEXT;

UPDATE Comments
SET updatedAt = createdAt
WHERE updatedAt IS NULL;

ALTER TABLE Ratings ADD COLUMN updatedAt TEXT;
ALTER TABLE Ratings ADD COLUMN deletedAt TEXT;

UPDATE Ratings
SET updatedAt = createdAt
WHERE updatedAt IS NULL;