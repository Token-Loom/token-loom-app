-- Add token price fields to BurnTransaction
ALTER TABLE "BurnTransaction" ADD COLUMN "tokenPriceUSD" DECIMAL(65,30) NOT NULL DEFAULT 0;
ALTER TABLE "BurnTransaction" ADD COLUMN "tokenDecimals" INTEGER NOT NULL DEFAULT 6; 