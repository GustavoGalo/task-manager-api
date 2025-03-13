-- AlterTable
ALTER TABLE "User" ADD COLUMN     "confirmationCode" TEXT,
ADD COLUMN     "confirmationCodeExpiresAt" TIMESTAMP(3);
