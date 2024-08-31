/*
  Warnings:

  - You are about to drop the column `customerId` on the `Measure` table. All the data in the column will be lost.
  - Added the required column `customer_code` to the `Measure` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Measure" DROP CONSTRAINT "Measure_customerId_fkey";

-- AlterTable
ALTER TABLE "Measure" DROP COLUMN "customerId",
ADD COLUMN     "customer_code" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Measure" ADD CONSTRAINT "Measure_customer_code_fkey" FOREIGN KEY ("customer_code") REFERENCES "Customer"("customer_code") ON DELETE RESTRICT ON UPDATE CASCADE;
