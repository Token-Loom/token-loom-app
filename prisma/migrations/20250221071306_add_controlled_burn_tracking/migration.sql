/*
  Warnings:

  - You are about to drop the column `amountPerBurn` on the `BurnTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `burnRate` on the `BurnTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `completedBurns` on the `BurnTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `BurnTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `nextBurnDate` on the `BurnTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `BurnTransaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ExecutionStatus" AS ENUM ('STARTED', 'COMPLETED', 'FAILED', 'RETRYING');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('BURN_SCHEDULED', 'BURN_STARTED', 'BURN_COMPLETED', 'BURN_FAILED', 'RETRY_SCHEDULED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "BurnStatus" ADD VALUE 'PROCESSING';
ALTER TYPE "BurnStatus" ADD VALUE 'CANCELLED';
ALTER TYPE "BurnStatus" ADD VALUE 'SCHEDULED';
ALTER TYPE "BurnStatus" ADD VALUE 'RETRYING';

-- AlterTable
ALTER TABLE "BurnTransaction" DROP COLUMN "amountPerBurn",
DROP COLUMN "burnRate",
DROP COLUMN "completedBurns",
DROP COLUMN "endDate",
DROP COLUMN "nextBurnDate",
DROP COLUMN "startDate";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT,
ADD COLUMN     "notifyOnComplete" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyOnFailure" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyOnStart" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "ScheduledBurn" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "status" "BurnStatus" NOT NULL DEFAULT 'PENDING',
    "executedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "nextRetryAt" TIMESTAMP(3),
    "errorMessage" TEXT,

    CONSTRAINT "ScheduledBurn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BurnExecution" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "scheduledBurnId" TEXT,
    "status" "ExecutionStatus" NOT NULL,
    "txSignature" TEXT,
    "errorMessage" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "gasUsed" DECIMAL(65,30),
    "retryCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "BurnExecution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3),
    "error" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "ScheduledBurn" ADD CONSTRAINT "ScheduledBurn_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "BurnTransaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BurnExecution" ADD CONSTRAINT "BurnExecution_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "BurnTransaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BurnExecution" ADD CONSTRAINT "BurnExecution_scheduledBurnId_fkey" FOREIGN KEY ("scheduledBurnId") REFERENCES "ScheduledBurn"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "BurnTransaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
