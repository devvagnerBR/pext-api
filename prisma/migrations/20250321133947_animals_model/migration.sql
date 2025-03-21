-- CreateTable
CREATE TABLE "Animal" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "maturidade" TEXT NOT NULL,
    "raca" TEXT NOT NULL,
    "sexo" TEXT NOT NULL,
    "origem" TEXT NOT NULL,
    "porte" TEXT NOT NULL,
    "comportamento" TEXT NOT NULL,
    "especie" TEXT NOT NULL,
    "doencas" TEXT[],
    "status" TEXT NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "Animal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Animal" ADD CONSTRAINT "Animal_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Animal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
