/*
  Warnings:

  - The values [CANCELLED,SCHEDULED] on the enum `BurnStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [RETRYING] on the enum `ExecutionStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [BURN_STARTED,RETRY_SCHEDULED] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('REGULAR', 'LP');

-- AlterEnum
BEGIN;
CREATE TYPE "BurnStatus_new" AS ENUM ('PENDING', 'PROCESSING', 'CONFIRMED', 'RETRYING', 'FAILED');
ALTER TABLE "ScheduledBurn" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "BurnTransaction" ALTER COLUMN "status" TYPE "BurnStatus_new" USING ("status"::text::"BurnStatus_new");
ALTER TABLE "ScheduledBurn" ALTER COLUMN "status" TYPE "BurnStatus_new" USING ("status"::text::"BurnStatus_new");
ALTER TYPE "BurnStatus" RENAME TO "BurnStatus_old";
ALTER TYPE "BurnStatus_new" RENAME TO "BurnStatus";
DROP TYPE "BurnStatus_old";
ALTER TABLE "ScheduledBurn" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ExecutionStatus_new" AS ENUM ('STARTED', 'COMPLETED', 'FAILED');
ALTER TABLE "BurnExecution" ALTER COLUMN "status" TYPE "ExecutionStatus_new" USING ("status"::text::"ExecutionStatus_new");
ALTER TYPE "ExecutionStatus" RENAME TO "ExecutionStatus_old";
ALTER TYPE "ExecutionStatus_new" RENAME TO "ExecutionStatus";
DROP TYPE "ExecutionStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('BURN_COMPLETED', 'BURN_FAILED', 'BURN_SCHEDULED');
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "NotificationType_old";
COMMIT;

-- AlterTable
ALTER TABLE "BurnStatistic" ADD COLUMN     "lpPoolAddress" TEXT,
ADD COLUMN     "lpToken0Mint" TEXT,
ADD COLUMN     "lpToken0Symbol" TEXT,
ADD COLUMN     "lpToken1Mint" TEXT,
ADD COLUMN     "lpToken1Symbol" TEXT,
ADD COLUMN     "tokenType" "TokenType" NOT NULL DEFAULT 'REGULAR';

-- AlterTable
ALTER TABLE "BurnTransaction" ADD COLUMN     "lpPoolAddress" TEXT,
ADD COLUMN     "lpToken0Mint" TEXT,
ADD COLUMN     "lpToken0Symbol" TEXT,
ADD COLUMN     "lpToken1Mint" TEXT,
ADD COLUMN     "lpToken1Symbol" TEXT,
ADD COLUMN     "tokenType" "TokenType" NOT NULL DEFAULT 'REGULAR';
