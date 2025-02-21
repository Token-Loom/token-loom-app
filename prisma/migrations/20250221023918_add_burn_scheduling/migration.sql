-- CreateEnum
CREATE TYPE "BurnRate" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');

-- AlterTable
ALTER TABLE "BurnTransaction" ADD COLUMN     "amountPerBurn" DECIMAL(65,30),
ADD COLUMN     "burnRate" "BurnRate",
ADD COLUMN     "completedBurns" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "nextBurnDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3);
