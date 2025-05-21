import bcrypt from "bcrypt";
import prisma from "../../shared/prisma";
import config from "../../config";

const payload = {
  name: "Mahdi Hasan Mahi",
  email: "mh7266391@gmail.com",
  password: "123456",
};
export const seedSuperAdmin = async () => {
  const existingSuperAdmin = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingSuperAdmin) {
    return;
  }

  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds),
  );

  await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
    },
  });
};
