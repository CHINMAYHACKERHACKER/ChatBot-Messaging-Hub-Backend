import { Router } from "express";
import { signUp } from "../auth/signUp.js";
import { login } from "../auth/login.js";
import { forgotPassword } from "../auth/forgotPassword.js";
import { signUpReqModel, loginReqModel, forgotPasswordReqModel } from "../reqModel/authReqModel.js";
import { validateBody } from "../JoiBodyValidation/JoiBodyValidation.js";

let router = Router();

router.post("/sign-up", validateBody(signUpReqModel), signUp.userSignUp);
router.post("/login", validateBody(loginReqModel), login.userLogin);
router.post("/forgot-password", validateBody(forgotPasswordReqModel), forgotPassword.userForgotPassword);

export default router;
