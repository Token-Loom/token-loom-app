-- CreateTable
CREATE TABLE "SystemConfig" (
    "id" TEXT NOT NULL,
    "maxRetries" INTEGER NOT NULL DEFAULT 3,
    "retryDelay" INTEGER NOT NULL DEFAULT 300,
    "maxWorkers" INTEGER NOT NULL DEFAULT 10,
    "isRunning" BOOLEAN NOT NULL DEFAULT true,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("id")
); 