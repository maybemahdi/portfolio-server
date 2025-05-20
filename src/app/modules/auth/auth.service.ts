import config from "../../../config";
import AppError from "../../errors/AppError";
import isUserExistsByEmail from "../../utils/isUserExistsByEmail";
import { IRegisterUser } from "./auth.interface";
import httpStatus from "http-status";
import * as bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";

const registerUser = async (payload: IRegisterUser) => {
  const user = await isUserExistsByEmail(payload.email);
  if (user) {
    throw new AppError(httpStatus.CONFLICT, "User Already Exists");
  }
  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds),
  );
  const result = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
  return result;
};

// const loginUser = async (payload) => {};

export const AuthService = {
  registerUser,
  // loginUser,
  // refreshToken,
  // forgetPassword,
  // resetPassword,
  // changePassword,
  // getMe,
};
