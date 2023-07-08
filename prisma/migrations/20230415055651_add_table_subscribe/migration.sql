-- CreateTable
CREATE TABLE "client" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "city" TEXT,
    "district" TEXT,
    "create_date" TIMESTAMPTZ,
    "changed_date" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscribe" (
    "id" SERIAL NOT NULL,
    "sms_send" BOOLEAN NOT NULL,
    "sms_date_end" TIMESTAMPTZ,
    "email_send" BOOLEAN NOT NULL,
    "email_date_end" TIMESTAMPTZ,
    "create_date" TIMESTAMPTZ,
    "changed_date" TIMESTAMPTZ NOT NULL,
    "client_id" INTEGER NOT NULL,

    CONSTRAINT "subscribe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "client_email_key" ON "client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "client_phone_key" ON "client"("phone");

-- AddForeignKey
ALTER TABLE "subscribe" ADD CONSTRAINT "subscribe_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
