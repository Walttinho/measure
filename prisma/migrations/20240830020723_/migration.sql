/*
  Warnings:

  - You are about to drop the column `customer_code` on the `Measure` table. All the data in the column will be lost.
  - Added the required column `customer_id` to the `Measure` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Measure" DROP CONSTRAINT "Measure_customer_code_fkey";

-- AlterTable
ALTER TABLE "Measure" DROP COLUMN "customer_code",
ADD COLUMN     "customer_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Measure" ADD CONSTRAINT "Measure_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
