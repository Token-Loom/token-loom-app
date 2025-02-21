-- CreateEnum
CREATE TYPE "BurnStatus" AS ENUM ('PENDING', 'CONFIRMED', 'FAILED');

-- CreateEnum
CREATE TYPE "BurnType" AS ENUM ('INSTANT', 'CONTROLLED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActive" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BurnWallet" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "BurnWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BurnTransaction" (
    "id" TEXT NOT NULL,
    "userWallet" TEXT,
    "tokenMint" TEXT NOT NULL,
    "tokenName" TEXT NOT NULL,
    "tokenSymbol" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "burnWalletId" TEXT NOT NULL,
    "txSignature" TEXT NOT NULL,
    "status" "BurnStatus" NOT NULL,
    "burnType" "BurnType" NOT NULL,
    "feeAmount" DECIMAL(65,30) NOT NULL,
    "burnMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmedAt" TIMESTAMP(3),

    CONSTRAINT "BurnTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BurnStatistic" (
    "id" TEXT NOT NULL,
    "tokenMint" TEXT NOT NULL,
    "tokenSymbol" TEXT NOT NULL,
    "totalBurned" DECIMAL(65,30) NOT NULL,
    "totalTransactions" INTEGER NOT NULL DEFAULT 0,
    "instantBurns" INTEGER NOT NULL DEFAULT 0,
    "controlledBurns" INTEGER NOT NULL DEFAULT 0,
    "totalFeesCollected" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BurnStatistic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalStatistic" (
    "id" TEXT NOT NULL,
    "totalTokensBurned" INTEGER NOT NULL DEFAULT 0,
    "totalTransactions" INTEGER NOT NULL DEFAULT 0,
    "uniqueTokensBurned" INTEGER NOT NULL DEFAULT 0,
    "totalFeesCollected" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "instantBurnsCount" INTEGER NOT NULL DEFAULT 0,
    "controlledBurnsCount" INTEGER NOT NULL DEFAULT 0,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlobalStatistic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenMetric" (
    "id" TEXT NOT NULL,
    "tokenMint" TEXT NOT NULL,
    "tokenSymbol" TEXT NOT NULL,
    "tokenName" TEXT NOT NULL,
    "dailyBurnAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "weeklyBurnAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "monthlyBurnAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TokenMetric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "BurnWallet_walletAddress_key" ON "BurnWallet"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "BurnTransaction_txSignature_key" ON "BurnTransaction"("txSignature");

-- CreateIndex
CREATE UNIQUE INDEX "BurnStatistic_tokenMint_key" ON "BurnStatistic"("tokenMint");

-- CreateIndex
CREATE UNIQUE INDEX "TokenMetric_tokenMint_key" ON "TokenMetric"("tokenMint");

-- AddForeignKey
ALTER TABLE "BurnTransaction" ADD CONSTRAINT "BurnTransaction_userWallet_fkey" FOREIGN KEY ("userWallet") REFERENCES "User"("walletAddress") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BurnTransaction" ADD CONSTRAINT "BurnTransaction_burnWalletId_fkey" FOREIGN KEY ("burnWalletId") REFERENCES "BurnWallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
