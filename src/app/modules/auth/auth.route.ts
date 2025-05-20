import { Router } from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { registerUserValidation } from "./auth.validation";

const AuthRoutes = Router();

AuthRoutes.post(
  "/register",
  validateRequest(registerUserValidation),
  AuthController.registerUser,
);
// AuthRoutes.post(
//   "/login",
//   validateRequest(loginUserValidation),
//   AuthController.loginUser,
// );
// AuthRoutes.post("/refresh-token", AuthController.refreshToken);
// AuthRoutes.post(
//   "/forget-password",
//   validateRequest(forgetPasswordValidationSchema),
//   AuthController.forgetPassword,
// );
// AuthRoutes.post(
//   "/reset-password",
//   validateRequest(resetPasswordValidationSchema),
//   AuthController.resetPassword,
// );

export default AuthRoutes;
