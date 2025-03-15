-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LLMResponse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
    "userQuery" TEXT,
    "llmAnswer" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LLMResponse_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LLMResponse" ("createdAt", "documentId", "id", "llmAnswer", "userQuery") SELECT "createdAt", "documentId", "id", "llmAnswer", "userQuery" FROM "LLMResponse";
DROP TABLE "LLMResponse";
ALTER TABLE "new_LLMResponse" RENAME TO "LLMResponse";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
