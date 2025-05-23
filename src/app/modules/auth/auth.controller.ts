import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AuthService } from "./auth.service";
import config from "../../../config";
import AppError from "../../errors/AppError";

const registerUser = catchAsync(async (req, res) => {
  const result = await AuthService.registerUser(req?.body);
  sendResponse(res, {
    success: true,
    message: "User registered successfully",
    statusCode: httpStatus.CREATED,
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthService.loginUser(req.body);
  const { refreshToken, accessToken } = result;

  // Expire the previous token if it exists
  if (req.cookies.accessToken) {
    res.clearCookie("accessToken");
  }
  if (req.cookies.refreshToken) {
    res.clearCookie("refreshToken");
  }

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.node_env === "production",
    sameSite: config.node_env === "production" ? "none" : "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    // domain: config.node_env === "production" ? "" : undefined,
  });
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: config.node_env === "production",
    sameSite: config.node_env === "production" ? "none" : "strict",
    // maxAge: 5 * 60 * 1000, // 5 minutes
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    // domain: config.node_env === "production" ? "" : undefined,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged in successfully!",
    data: {
      accessToken,
      refreshToken,
    },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  // Expire the previous token if it exists
  if (req.cookies.accessToken) {
    res.clearCookie("accessToken");
  }

  const result = await AuthService.refreshToken(refreshToken);

  const { accessToken } = result;

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: config.node_env === "production",
    sameSite: config.node_env === "production" ? "none" : "strict",
    // maxAge: 5 * 60 * 1000, // 5 minutes
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    // domain: config.node_env === "production" ? "" : undefined,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Token Refreshed!",
    data: {
      accessToken,
    },
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const email = req?.body?.email;
  const result = await AuthService.forgetPassword(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password Reset link has been sent!",
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    throw new AppError(httpStatus.BAD_REQUEST, "Something went wrong !");
  }

  const result = await AuthService.resetPassword(req.body, token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successfully!",
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const result = await AuthService.changePassword(req.body, req.user);
  sendResponse(res, {
    success: result?.success,
    statusCode: httpStatus.OK,
    message: result?.message,
    data: null,
  });
});

const getMe = catchAsync(async (req, res) => {
  const result = await AuthService.getMe(req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User profile retrieved successfully",
    data: result,
  });
});

export const AuthController = {
  registerUser,
  loginUser,
  refreshToken,
  forgetPassword,
  resetPassword,
  changePassword,
  getMe,
};
