/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Benefit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `City` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CityTranslation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CompanyAdmin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CompanyInstallation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CompanyWorker` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Country` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CountryTranslation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Currency` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Feature` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Itinerary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ItineraryItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Language` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Media` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PackageLanguage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Phone` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PickupDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostalCode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PricingOption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Region` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RegionTranslation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Schedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SystemAdmin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TourismCompany` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TourismCompanyTranslation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tourist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TouristPackage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TouristPackageTranslation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_WorkerPermissions` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "EnumRole" AS ENUM ('ADMIN', 'DOCTOR', 'NURSE');

-- CreateEnum
CREATE TYPE "EnumGender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "EnumAnemiaSeverity" AS ENUM ('NONE', 'MILD', 'MODERATE', 'SEVERE');

-- CreateEnum
CREATE TYPE "EnumFemaleAdditional" AS ENUM ('NONE', 'PREGNANT', 'LACTATING');

-- CreateEnum
CREATE TYPE "EnumGestationTrimester" AS ENUM ('NONE', 'FIRST', 'SECOND', 'THIRD');

-- CreateEnum
CREATE TYPE "EnumPresentation" AS ENUM ('TABLET', 'SYRUP', 'DROPS', 'POWDER');

-- CreateEnum
CREATE TYPE "EnumAuditAction" AS ENUM ('LOGIN', 'LOGOUT', 'CREATE_PATIENT', 'UPDATE_PATIENT', 'VIEW_PATIENT', 'CREATE_VISIT', 'UPDATE_VISIT', 'CREATE_PRESCRIPTION', 'UPDATE_PRESCRIPTION');

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Benefit" DROP CONSTRAINT "Benefit_packageId_fkey";

-- DropForeignKey
ALTER TABLE "City" DROP CONSTRAINT "City_regionId_fkey";

-- DropForeignKey
ALTER TABLE "CityTranslation" DROP CONSTRAINT "CityTranslation_cityId_fkey";

-- DropForeignKey
ALTER TABLE "CityTranslation" DROP CONSTRAINT "CityTranslation_languageId_fkey";

-- DropForeignKey
ALTER TABLE "CompanyAdmin" DROP CONSTRAINT "CompanyAdmin_userId_fkey";

-- DropForeignKey
ALTER TABLE "CompanyInstallation" DROP CONSTRAINT "CompanyInstallation_companyId_fkey";

-- DropForeignKey
ALTER TABLE "CompanyInstallation" DROP CONSTRAINT "CompanyInstallation_postalCodeId_fkey";

-- DropForeignKey
ALTER TABLE "CompanyWorker" DROP CONSTRAINT "CompanyWorker_companyId_fkey";

-- DropForeignKey
ALTER TABLE "CompanyWorker" DROP CONSTRAINT "CompanyWorker_userId_fkey";

-- DropForeignKey
ALTER TABLE "Country" DROP CONSTRAINT "Country_currencyId_fkey";

-- DropForeignKey
ALTER TABLE "CountryTranslation" DROP CONSTRAINT "CountryTranslation_countryId_fkey";

-- DropForeignKey
ALTER TABLE "CountryTranslation" DROP CONSTRAINT "CountryTranslation_languageId_fkey";

-- DropForeignKey
ALTER TABLE "Feature" DROP CONSTRAINT "Feature_packageId_fkey";

-- DropForeignKey
ALTER TABLE "Itinerary" DROP CONSTRAINT "Itinerary_packageId_fkey";

-- DropForeignKey
ALTER TABLE "ItineraryItem" DROP CONSTRAINT "ItineraryItem_itineraryId_fkey";

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_packageId_fkey";

-- DropForeignKey
ALTER TABLE "PackageLanguage" DROP CONSTRAINT "PackageLanguage_languageId_fkey";

-- DropForeignKey
ALTER TABLE "PackageLanguage" DROP CONSTRAINT "PackageLanguage_packageId_fkey";

-- DropForeignKey
ALTER TABLE "Phone" DROP CONSTRAINT "Phone_countryId_fkey";

-- DropForeignKey
ALTER TABLE "PickupDetail" DROP CONSTRAINT "PickupDetail_packageId_fkey";

-- DropForeignKey
ALTER TABLE "PostalCode" DROP CONSTRAINT "PostalCode_cityId_fkey";

-- DropForeignKey
ALTER TABLE "PricingOption" DROP CONSTRAINT "PricingOption_currencyId_fkey";

-- DropForeignKey
ALTER TABLE "PricingOption" DROP CONSTRAINT "PricingOption_packageId_fkey";

-- DropForeignKey
ALTER TABLE "Region" DROP CONSTRAINT "Region_countryId_fkey";

-- DropForeignKey
ALTER TABLE "RegionTranslation" DROP CONSTRAINT "RegionTranslation_languageId_fkey";

-- DropForeignKey
ALTER TABLE "RegionTranslation" DROP CONSTRAINT "RegionTranslation_regionId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_packageId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "SystemAdmin" DROP CONSTRAINT "SystemAdmin_userId_fkey";

-- DropForeignKey
ALTER TABLE "TourismCompany" DROP CONSTRAINT "TourismCompany_adminId_fkey";

-- DropForeignKey
ALTER TABLE "TourismCompany" DROP CONSTRAINT "TourismCompany_languageId_fkey";

-- DropForeignKey
ALTER TABLE "TourismCompanyTranslation" DROP CONSTRAINT "TourismCompanyTranslation_companyId_fkey";

-- DropForeignKey
ALTER TABLE "TourismCompanyTranslation" DROP CONSTRAINT "TourismCompanyTranslation_languageId_fkey";

-- DropForeignKey
ALTER TABLE "Tourist" DROP CONSTRAINT "Tourist_currencyId_fkey";

-- DropForeignKey
ALTER TABLE "Tourist" DROP CONSTRAINT "Tourist_emergencyPhoneId_fkey";

-- DropForeignKey
ALTER TABLE "Tourist" DROP CONSTRAINT "Tourist_languageId_fkey";

-- DropForeignKey
ALTER TABLE "Tourist" DROP CONSTRAINT "Tourist_userId_fkey";

-- DropForeignKey
ALTER TABLE "TouristPackage" DROP CONSTRAINT "TouristPackage_companyId_fkey";

-- DropForeignKey
ALTER TABLE "TouristPackage" DROP CONSTRAINT "TouristPackage_languageId_fkey";

-- DropForeignKey
ALTER TABLE "TouristPackageTranslation" DROP CONSTRAINT "TouristPackageTranslation_languageId_fkey";

-- DropForeignKey
ALTER TABLE "TouristPackageTranslation" DROP CONSTRAINT "TouristPackageTranslation_packageId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_nationalityId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_passportCountryId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_phoneId_fkey";

-- DropForeignKey
ALTER TABLE "_WorkerPermissions" DROP CONSTRAINT "_WorkerPermissions_A_fkey";

-- DropForeignKey
ALTER TABLE "_WorkerPermissions" DROP CONSTRAINT "_WorkerPermissions_B_fkey";

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "Benefit";

-- DropTable
DROP TABLE "City";

-- DropTable
DROP TABLE "CityTranslation";

-- DropTable
DROP TABLE "CompanyAdmin";

-- DropTable
DROP TABLE "CompanyInstallation";

-- DropTable
DROP TABLE "CompanyWorker";

-- DropTable
DROP TABLE "Country";

-- DropTable
DROP TABLE "CountryTranslation";

-- DropTable
DROP TABLE "Currency";

-- DropTable
DROP TABLE "Feature";

-- DropTable
DROP TABLE "Itinerary";

-- DropTable
DROP TABLE "ItineraryItem";

-- DropTable
DROP TABLE "Language";

-- DropTable
DROP TABLE "Media";

-- DropTable
DROP TABLE "PackageLanguage";

-- DropTable
DROP TABLE "Permission";

-- DropTable
DROP TABLE "Phone";

-- DropTable
DROP TABLE "PickupDetail";

-- DropTable
DROP TABLE "PostalCode";

-- DropTable
DROP TABLE "PricingOption";

-- DropTable
DROP TABLE "Region";

-- DropTable
DROP TABLE "RegionTranslation";

-- DropTable
DROP TABLE "Schedule";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "SystemAdmin";

-- DropTable
DROP TABLE "TourismCompany";

-- DropTable
DROP TABLE "TourismCompanyTranslation";

-- DropTable
DROP TABLE "Tourist";

-- DropTable
DROP TABLE "TouristPackage";

-- DropTable
DROP TABLE "TouristPackageTranslation";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "VerificationToken";

-- DropTable
DROP TABLE "_WorkerPermissions";

-- DropEnum
DROP TYPE "AccessibilityFeature";

-- DropEnum
DROP TYPE "CancellationPolicyType";

-- DropEnum
DROP TYPE "DayOfWeek";

-- DropEnum
DROP TYPE "DifficultyLevel";

-- DropEnum
DROP TYPE "Gender";

-- DropEnum
DROP TYPE "MediaType";

-- DropEnum
DROP TYPE "PackageType";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "role" "EnumRole",
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "action" "EnumAuditAction" NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "metadata" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provinces" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "department_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "provinces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "districts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "province_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "towns" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "district_id" INTEGER NOT NULL,
    "altitude_adjustment" DECIMAL(5,2) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "towns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients" (
    "dni" CHAR(8) NOT NULL,
    "birth_date" DATE NOT NULL,
    "gender" "EnumGender" NOT NULL,
    "department_id" INTEGER NOT NULL,
    "province_id" INTEGER NOT NULL,
    "district_id" INTEGER NOT NULL,
    "town_id" INTEGER NOT NULL,
    "created_by_id" TEXT NOT NULL,
    "updated_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("dni")
);

-- CreateTable
CREATE TABLE "patient_visits" (
    "visit_id" SERIAL NOT NULL,
    "patient_dni" CHAR(8) NOT NULL,
    "visit_date" DATE NOT NULL,
    "weight" DECIMAL(5,2) NOT NULL,
    "hb_observed" DECIMAL(4,1) NOT NULL,
    "hb_adjusted" DECIMAL(4,1) NOT NULL,
    "anemia_severity" "EnumAnemiaSeverity" NOT NULL,
    "female_additional" "EnumFemaleAdditional" NOT NULL,
    "gestation_trimester" "EnumGestationTrimester" NOT NULL,
    "created_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patient_visits_pkey" PRIMARY KEY ("visit_id")
);

-- CreateTable
CREATE TABLE "supplements" (
    "id_supplement" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "presentation" "EnumPresentation" NOT NULL,
    "elemental_iron" DECIMAL(65,30) NOT NULL,
    "content" DECIMAL(65,30) NOT NULL,
    "notes" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "supplements_pkey" PRIMARY KEY ("id_supplement")
);

-- CreateTable
CREATE TABLE "prescriptions" (
    "prescription_id" SERIAL NOT NULL,
    "visit_id" INTEGER NOT NULL,
    "id_supplement" TEXT NOT NULL,
    "prescribed_dose" DECIMAL(65,30) NOT NULL,
    "treatment_duration_days" INTEGER NOT NULL,
    "prescription_notes" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prescriptions_pkey" PRIMARY KEY ("prescription_id")
);

-- CreateTable
CREATE TABLE "supplement_doses" (
    "dose_id" SERIAL NOT NULL,
    "id_supplement" TEXT NOT NULL,
    "from_age_days" INTEGER NOT NULL,
    "to_age_days" INTEGER NOT NULL,
    "dose_amount" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "supplement_doses_pkey" PRIMARY KEY ("dose_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "departments_name_key" ON "departments"("name");

-- CreateIndex
CREATE UNIQUE INDEX "provinces_name_department_id_key" ON "provinces"("name", "department_id");

-- CreateIndex
CREATE UNIQUE INDEX "districts_name_province_id_key" ON "districts"("name", "province_id");

-- CreateIndex
CREATE UNIQUE INDEX "towns_name_district_id_key" ON "towns"("name", "district_id");

-- CreateIndex
CREATE INDEX "patients_created_by_id_idx" ON "patients"("created_by_id");

-- CreateIndex
CREATE INDEX "patients_updated_by_id_idx" ON "patients"("updated_by_id");

-- CreateIndex
CREATE INDEX "patient_visits_patient_dni_idx" ON "patient_visits"("patient_dni");

-- CreateIndex
CREATE INDEX "patient_visits_created_by_id_idx" ON "patient_visits"("created_by_id");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provinces" ADD CONSTRAINT "provinces_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "districts" ADD CONSTRAINT "districts_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "provinces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "towns" ADD CONSTRAINT "towns_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "provinces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_town_id_fkey" FOREIGN KEY ("town_id") REFERENCES "towns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_visits" ADD CONSTRAINT "patient_visits_patient_dni_fkey" FOREIGN KEY ("patient_dni") REFERENCES "patients"("dni") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_visits" ADD CONSTRAINT "patient_visits_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "patient_visits"("visit_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_id_supplement_fkey" FOREIGN KEY ("id_supplement") REFERENCES "supplements"("id_supplement") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplement_doses" ADD CONSTRAINT "supplement_doses_id_supplement_fkey" FOREIGN KEY ("id_supplement") REFERENCES "supplements"("id_supplement") ON DELETE RESTRICT ON UPDATE CASCADE;
