-- CreateEnum
CREATE TYPE "OnboardingStatus" AS ENUM ('PENDING', 'ACTIVATED', 'EXPIRED', 'CONVERTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "OnboardingType" AS ENUM ('TRIAL', 'BOOK');

-- CreateTable
CREATE TABLE "onboarding_requests" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "companyName" TEXT NOT NULL,
    "industry" TEXT,
    "message" TEXT,
    "serviceType" "ServiceType" NOT NULL,
    "serviceName" TEXT NOT NULL,
    "requestType" "OnboardingType" NOT NULL DEFAULT 'TRIAL',
    "requirements" JSONB,
    "status" "OnboardingStatus" NOT NULL DEFAULT 'PENDING',
    "activatedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "clientId" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "onboarding_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "onboarding_requests_email_idx" ON "onboarding_requests"("email");

-- CreateIndex
CREATE INDEX "onboarding_requests_status_idx" ON "onboarding_requests"("status");

-- CreateIndex
CREATE INDEX "onboarding_requests_serviceType_idx" ON "onboarding_requests"("serviceType");

-- CreateIndex
CREATE INDEX "onboarding_requests_requestType_idx" ON "onboarding_requests"("requestType");

-- CreateIndex
CREATE INDEX "onboarding_requests_createdAt_idx" ON "onboarding_requests"("createdAt");

-- AddForeignKey
ALTER TABLE "onboarding_requests" ADD CONSTRAINT "onboarding_requests_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
