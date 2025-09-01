import { Router } from "express";
import { Telegram } from "../controllers/telegramController.js";
import { validateBody } from "../JoiBodyValidation/JoiBodyValidation.js";
import TokenVerify from "../middlewares/tokenVerify.js";
import { telgramConnectReqModel, getTelegramConnectionReqlModel, createTelegramBotReqModel, publishTelegramBotReqModel, campaignReqModel } from "../reqModel/telegramReqModel.js";

let router = Router();

router.post("/connect", TokenVerify.verifyUser, validateBody(telgramConnectReqModel), Telegram.connectTelegram);

router.post("/getconnections", TokenVerify.verifyUser, validateBody(getTelegramConnectionReqlModel), Telegram.getTelegramConnections);

router.post("/createBot", TokenVerify.verifyUser, validateBody(createTelegramBotReqModel), Telegram.createTelegramBot);

router.post("/publishBot", TokenVerify.verifyUser, validateBody(publishTelegramBotReqModel), Telegram.publishTelegramBot);

router.post("/campaign", TokenVerify.verifyUser, validateBody(campaignReqModel), Telegram.createTelegramCampaign);

export default router;
