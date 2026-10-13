-- AlterTable
ALTER TABLE "Url" ADD COLUMN     "guestId" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Guest" (
    "id" TEXT NOT NULL,
    "guestToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guest_guestToken_key" ON "Guest"("guestToken");

-- CreateIndex
CREATE INDEX "Guest_guestToken_idx" ON "Guest"("guestToken");

-- CreateIndex
CREATE INDEX "Url_guestId_idx" ON "Url"("guestId");

-- AddForeignKey
ALTER TABLE "Url" ADD CONSTRAINT "Url_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Added check 
ALTER TABLE "Url"
ADD CONSTRAINT "Url_exactly_one_owner_check"
CHECK (
  ("userId" IS NOT NULL) <> ("guestId" IS NOT NULL)
);