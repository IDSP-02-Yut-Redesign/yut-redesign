/*
  Warnings:

  - You are about to alter the column `createdAt` on the `Score` table. The data in that column could be lost. The data in that column will be cast from `DateTime` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Score" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" INTEGER NOT NULL
);
INSERT INTO "new_Score" ("createdAt", "id", "score", "username") SELECT "createdAt", "id", "score", "username" FROM "Score";
DROP TABLE "Score";
ALTER TABLE "new_Score" RENAME TO "Score";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
