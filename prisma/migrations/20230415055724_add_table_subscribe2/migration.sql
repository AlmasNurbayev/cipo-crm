-- AlterTable
ALTER TABLE "subscribe" ALTER COLUMN "sms_send" DROP NOT NULL,
ALTER COLUMN "email_send" DROP NOT NULL;
