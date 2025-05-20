import prisma from "../../shared/prisma";
import { User as PrismaUser } from "@prisma/client";

const isUserExistsByEmail = async (
  email: string,
): Promise<PrismaUser | null> => {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
};

export default isUserExistsByEmail;
