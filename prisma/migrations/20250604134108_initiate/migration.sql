-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" INTEGER NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
