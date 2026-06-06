import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.customUser.findMany();
  console.log(users);
}

main();