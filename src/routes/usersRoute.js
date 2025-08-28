import { Router } from "express";
import { Users } from "../controllers/usersController.js";
import { validateBody } from "../JoiBodyValidation/JoiBodyValidation.js";
import TokenVerify from "../middlewares/tokenVerify.js";
import { getUserByClientIdReqModel } from "../reqModel/userReqModel.js";

let router = Router();

router.post("/getUserByClientId", validateBody(getUserByClientIdReqModel), TokenVerify.verifyUser, Users.getUserByClientId);

export default router;
