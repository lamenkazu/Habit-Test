-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_habit_week_days" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "habit_id" TEXT NOT NULL,
    "week_day" INTEGER NOT NULL,
    CONSTRAINT "habit_week_days_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "habitos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_habit_week_days" ("habit_id", "id", "week_day") SELECT "habit_id", "id", "week_day" FROM "habit_week_days";
DROP TABLE "habit_week_days";
ALTER TABLE "new_habit_week_days" RENAME TO "habit_week_days";
CREATE UNIQUE INDEX "habit_week_days_habit_id_week_day_key" ON "habit_week_days"("habit_id", "week_day");
CREATE TABLE "new_habitosDiarios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "day_id" TEXT NOT NULL,
    "habit_id" TEXT NOT NULL,
    CONSTRAINT "habitosDiarios_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "dias" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "habitosDiarios_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "habitos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_habitosDiarios" ("day_id", "habit_id", "id") SELECT "day_id", "habit_id", "id" FROM "habitosDiarios";
DROP TABLE "habitosDiarios";
ALTER TABLE "new_habitosDiarios" RENAME TO "habitosDiarios";
CREATE UNIQUE INDEX "habitosDiarios_day_id_habit_id_key" ON "habitosDiarios"("day_id", "habit_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
