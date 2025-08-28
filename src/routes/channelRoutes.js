import { Router } from "express";
import { Telegram } from "../controllers/telegramController.js";
import { validateBody } from "../JoiBodyValidation/JoiBodyValidation.js";
import TokenVerify from "../middlewares/tokenVerify.js";
import { telgramConnectReqModel, getTelegramConnectionReqlModel, createTelegramBotReqModel, publishTelegramBotReqModel } from "../reqModel/telegramReqModel.js";

let router = Router();

router.post("/connect-telegram", TokenVerify.verifyUser, validateBody(telgramConnectReqModel), Telegram.connectTelegram);

router.post("/get-telegram-connections", TokenVerify.verifyUser, validateBody(getTelegramConnectionReqlModel), Telegram.getTelegramConnections);

router.post("/create-telegram-bot", TokenVerify.verifyUser, validateBody(createTelegramBotReqModel), Telegram.createTelegramBot);

router.post("/publish-telegram-bot", TokenVerify.verifyUser, validateBody(publishTelegramBotReqModel), Telegram.publishTelegramBot);

export default router;
