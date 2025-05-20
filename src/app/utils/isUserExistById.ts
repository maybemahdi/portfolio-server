import prisma from "../../shared/prisma";
import { User as PrismaUser } from "@prisma/client";

const isUserExistsById = async (id: string): Promise<PrismaUser | null> => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
};

export default isUserExistsById;
