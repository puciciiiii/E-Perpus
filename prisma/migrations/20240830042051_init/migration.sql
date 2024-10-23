-- CreateTable
CREATE TABLE "bukuTb" (
    "id" SERIAL NOT NULL,
    "kategoriId" INTEGER NOT NULL,
    "judul" TEXT NOT NULL,
    "sinopsis" TEXT NOT NULL,
    "penulisId" INTEGER NOT NULL,
    "tahunTerbit" TIMESTAMP(3) NOT NULL,
    "rakId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bukuTb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kategoriTb" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kategoriTb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "penulisTb" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "tanggalLahir" INTEGER NOT NULL,
    "negaraAsal" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "penulisTb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lemariTb" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lemariTb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rakTb" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "lemariId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rakTb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anggotaTb" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hp" TEXT NOT NULL,
    "tanggalDaftar" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anggotaTb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pinjamanTb" (
    "id" SERIAL NOT NULL,
    "anggotaId" INTEGER NOT NULL,
    "bukuId" INTEGER NOT NULL,
    "tanggalPinjaman" TIMESTAMP(3) NOT NULL,
    "tanggalPengembalian" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pinjamanTb_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bukuTb" ADD CONSTRAINT "bukuTb_kategoriId_fkey" FOREIGN KEY ("kategoriId") REFERENCES "kategoriTb"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bukuTb" ADD CONSTRAINT "bukuTb_penulisId_fkey" FOREIGN KEY ("penulisId") REFERENCES "penulisTb"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bukuTb" ADD CONSTRAINT "bukuTb_rakId_fkey" FOREIGN KEY ("rakId") REFERENCES "rakTb"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rakTb" ADD CONSTRAINT "rakTb_lemariId_fkey" FOREIGN KEY ("lemariId") REFERENCES "lemariTb"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pinjamanTb" ADD CONSTRAINT "pinjamanTb_anggotaId_fkey" FOREIGN KEY ("anggotaId") REFERENCES "anggotaTb"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pinjamanTb" ADD CONSTRAINT "pinjamanTb_bukuId_fkey" FOREIGN KEY ("bukuId") REFERENCES "bukuTb"("id") ON DELETE CASCADE ON UPDATE CASCADE;
