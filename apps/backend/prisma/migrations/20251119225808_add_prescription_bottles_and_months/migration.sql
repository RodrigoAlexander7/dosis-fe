/*
  Warnings:

  - Added the required column `number_of_bottles` to the `prescriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_measure` to the `prescriptions` table without a default value. This is not possible if the table is not empty.

*/

-- Delete existing prescriptions (as confirmed by user, data is fake/test data)
DELETE FROM "prescriptions";

-- AlterTable
ALTER TABLE "prescriptions" ADD COLUMN     "number_of_bottles" INTEGER NOT NULL,
ADD COLUMN     "treatment_months" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "unit_measure" VARCHAR(20) NOT NULL,
ALTER COLUMN "prescription_notes" DROP NOT NULL;
