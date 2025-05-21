import { Router } from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { changePasswordValidationSchema, forgetPasswordValidationSchema, loginUserValidation, registerUserValidation, resetPasswordValidationSchema } from "./auth.validation";
import auth from "../../middlewares/auth";

const AuthRoutes = Router();

AuthRoutes.post(
  "/register",
  validateRequest(registerUserValidation),
  AuthController.registerUser,
);
AuthRoutes.post(
  "/login",
  validateRequest(loginUserValidation),
  AuthController.loginUser,
);
AuthRoutes.post("/refresh-token", AuthController.refreshToken);
AuthRoutes.post(
  "/forget-password",
  validateRequest(forgetPasswordValidationSchema),
  AuthController.forgetPassword,
);
AuthRoutes.post(
  "/reset-password",
  validateRequest(resetPasswordValidationSchema),
  AuthController.resetPassword,
);
AuthRoutes.put(
  "/change-password",
  auth(),
  validateRequest(changePasswordValidationSchema),
  AuthController.changePassword,
);
AuthRoutes.get("/get-me", auth(), AuthController.getMe);

export default AuthRoutes;
