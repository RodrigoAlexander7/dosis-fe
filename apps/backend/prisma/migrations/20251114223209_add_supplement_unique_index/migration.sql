/*
  Warnings:

  - A unique constraint covering the columns `[id_supplement,from_age_days,to_age_days]` on the table `supplement_doses` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "supplement_doses_id_supplement_from_age_days_to_age_days_key" ON "supplement_doses"("id_supplement", "from_age_days", "to_age_days");
