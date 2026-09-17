import { Router } from "express";
import { checkSchema } from "express-validator";
import { inputValidationMiddleware } from "../middlewares";
import { AuthController } from "../controllers";

export const getAuthRoutes = () => {
  const authRouter = Router();
  const authController = new AuthController();
  authRouter
    .post(
      "/login",
      checkSchema({
        usernameOrEmail: {
          trim: true,
          isString: true,
          notEmpty: true,
          errorMessage: { message: "usernameOrEmail is required" },
        },
        password: {
          notEmpty: true,
          errorMessage: { message: "Password is required" },
        },
      }),
      inputValidationMiddleware,
      authController.login,
    )
    .post(
      "/confirm-email",
      checkSchema({
        code: {
          in: ["query"],
          isString: true,
          notEmpty: true,
          errorMessage: { message: "Confirmation code is required" },
        },
      }),
      inputValidationMiddleware,
      authController.confirmEmail,
    )
    .post(
      "/register",
      checkSchema({
        username: {
          trim: true,
          isString: true,
          isLength: { options: { min: 3, max: 30 } },
          errorMessage: { message: "Username should be from 3 to 30 characters" },
        },
        // email: {
        //     trim: true,
        //     isEmail: true,
        //     errorMessage: {message: 'Email should be correct'},
        // },
        password: {
          isLength: { options: { min: 6, max: 100 } },
          errorMessage: { message: "Password should be from 6 to 100 characters" },
        },
      }),
      inputValidationMiddleware,
      authController.register,
    );
  return authRouter;
};
