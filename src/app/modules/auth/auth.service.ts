import config from "../../../config";
import AppError from "../../errors/AppError";
import isUserExistsByEmail from "../../utils/isUserExistsByEmail";
import { ILoginUser, IRegisterUser } from "./auth.interface";
import httpStatus from "http-status";
import * as bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { JwtPayload, Secret } from "jsonwebtoken";
import { sendEmail } from "../../utils/sendEmail";
import isPasswordMatched from "../../utils/isPasswordMatched";

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

const loginUser = async (payload: ILoginUser) => {
  const user = await isUserExistsByEmail(payload.email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid email or password");
  }
  const isPasswordValid = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordValid) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid email or password");
  }
  const accessToken = jwtHelpers.generateToken(
    { id: user.id, email: user.email },
    config.jwt.jwt_access_secret as Secret,
    config.jwt.jwt_access_expires_in as string,
  );
  const refreshToken = jwtHelpers.generateToken(
    { id: user.id, email: user.email },
    config.jwt.jwt_refresh_secret as Secret,
    config.jwt.jwt_refresh_expires_in as string,
  );
  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

const refreshToken = async (token: string) => {
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.jwt_refresh_secret as Secret,
    );
  } catch (error) {
    throw new AppError(httpStatus.FORBIDDEN, "Invalid refresh token");
  }
  const { email } = verifiedToken;
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: email,
    },
  });
  const newAccessToken = jwtHelpers.generateToken(
    { id: user?.id, email: user?.email },
    config.jwt.jwt_access_secret as Secret,
    config.jwt.jwt_access_expires_in as string,
  );
  return {
    accessToken: newAccessToken,
  };
};

const forgetPassword = async (email: string) => {
  // checking if the user is exist
  const user = await isUserExistsByEmail(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  const jwtPayload = {
    id: user.id,
    email: user.email,
  };

  const resetToken = jwtHelpers.generateToken(
    jwtPayload,
    config.jwt.reset_pass_secret as Secret,
    config.jwt.reset_pass_token_expires_in as string,
  );

  const resetLink = `${config.reset_pass_ui_link}?token=${resetToken}`;

  // send mail
  const html = `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`;
  await sendEmail("Reset Password", user.email, html);
  return {
    resetToken,
  };
};

const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string,
) => {
  const user = await isUserExistsByEmail(payload?.email);

  if (!user) {
    throw new AppError(httpStatus.FORBIDDEN, "User not found!");
  }

  // checking if the given token is valid
  let decoded: JwtPayload = {} as JwtPayload;
  try {
    decoded = jwtHelpers.verifyToken(
      token,
      config.jwt.reset_pass_secret as Secret,
    );
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new AppError(httpStatus.FORBIDDEN, "Token is expired!");
    }
    throw new AppError(httpStatus.FORBIDDEN, "Try again");
  }

  if (payload?.email !== decoded.email) {
    throw new AppError(httpStatus.FORBIDDEN, "Unauthorized Attempt!");
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await prisma.user.update({
    where: {
      email: decoded.email,
    },
    data: {
      password: newHashedPassword,
    },
  });
};

const changePassword = async (
  payload: {
    currentPassword: string;
    newPassword: string;
  },
  user: any,
) => {
  const { currentPassword, newPassword } = payload;

  const userForCheck = await prisma.user.findUniqueOrThrow({
    where: { id: user?.id },
  });

  // Check if the current password matches
  if (!userForCheck?.password) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Password not found");
  }

  const isPasswordCorrect = await isPasswordMatched(
    currentPassword,
    userForCheck.password,
  );

  if (!isPasswordCorrect) {
    return {
      success: false,
      message: "Current password is incorrect",
    };
  }

  // Update the password
  const hashedNewPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedNewPassword },
  });

  return {
    success: true,
    message: "Password changed successfully",
  };
};

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  return user;
};

export const AuthService = {
  registerUser,
  loginUser,
  refreshToken,
  forgetPassword,
  resetPassword,
  changePassword,
  getMe,
};
