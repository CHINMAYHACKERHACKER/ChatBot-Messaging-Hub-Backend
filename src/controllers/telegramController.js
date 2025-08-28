import { telegramModel } from "../models/telegramModel.js";
import { AITelegramBot } from "../AI/telegramBot.js";
import TelegramBot from "node-telegram-bot-api";
import { publishTelegram } from "../AI/publishTelegramBot.js";

class Telegram {
    static async connectTelegram(req, res) {
        let bot = null;
        const { refreshToken, body: { botToken, clientId, webhookUrl, createdBy } } = req;
        try {
            // Create bot
            bot = new TelegramBot(botToken, { polling: true });

            // Await getMe to verify connection
            const botInfo = await bot.getMe();
            await bot.stopPolling();
            telegramModel.insertTelegramBotConfig({
                client_id: clientId,
                bot_id: botInfo && botInfo.id ? botInfo.id : null,
                bot_username: botInfo && botInfo.username ? botInfo.username : null,
                bot_name: botInfo && botInfo.first_name ? botInfo.first_name : null,
                bot_token: botToken,
                webhook_url: webhookUrl ? webhookUrl : null,
                is_connected: botInfo && botInfo.id && botInfo.is_bot ? true : false,
                created_by: createdBy,
                res_json: botInfo
            })
            return res.send({ status: true, code: 200, message: "Telegram bot connected successfully", refreshToken: refreshToken });
        } catch (err) {
            if (bot) {
                await bot.stopPolling().catch((err) => {
                    console.error("❌ Polling Error:", err);
                });
            }
            // console.error("❌ Telegram connection failed:", err);
            telegramModel.insertTelegramBotConfig({
                client_id: clientId,
                bot_id: null,
                bot_username: null,
                bot_name: null,
                bot_token: botToken,
                webhook_url: webhookUrl ? webhookUrl : null,
                is_connected: false,
                created_by: createdBy,
                err_json: err
            })
            return res.send({ status: false, code: 500, message: "Telegram bot connection failed", refreshToken: refreshToken });
        }
    }

    static async getTelegramConnections(req, res) {
        try {
            const { refreshToken, body: { clientId } } = req;
            const getTelegramConnectionByClientIdRes = await telegramModel.getTelegramConnectionByClientId(clientId);
            if (getTelegramConnectionByClientIdRes && getTelegramConnectionByClientIdRes.length) {
                return res.send({ status: true, code: 200, data: getTelegramConnectionByClientIdRes, refreshToken: refreshToken });
            } else {
                return res.send({ status: false, code: 204, data: null, refreshToken: refreshToken });
            }
        } catch (err) {
            return res.send({ status: false, code: 500, message: "Server Internal Error" });
        }
    }

    static async createTelegramBot(req, res) {
        try {
            const { refreshToken, body: { prompt, createdBy, clientId } } = req;
            const getConnectedBotConfigRes = await telegramModel.getConnectedBotConfig(createdBy, clientId);
            if (getConnectedBotConfigRes && getConnectedBotConfigRes.is_connected && getConnectedBotConfigRes.bot_token) {
                const AITelegramBotRes = await AITelegramBot.AITelegram(prompt);
                return res.send({ status: true, code: 200, data: AITelegramBotRes, refreshToken: refreshToken });
            } else {
                return res.send({ status: false, code: 204, data: null, message: !getConnectedBotConfigRes.is_connected ? "The bot is currently not connected. Please connect your bot to continue." : "Bot token is missing or invalid. Please configure a valid token to proceed.", refreshToken: refreshToken });
            }
        } catch (err) {
            return res.send({ status: false, code: 500, message: "Server Internal Error" });
        }
    }

    static async publishTelegramBot(req, res) {
        try {
            const { refreshToken, body: { clientId, botId, customBotName, botDescription, isPublished, telegramBotFlowJson, botCreatedBy, botUserName } } = req;
            let reqObj = {
                client_id: clientId,
                bot_id: botId,
                bot_username: botUserName,
                custom_bot_name: customBotName,
                bot_description: botDescription,
                bot_created_by: botCreatedBy,
                is_published: isPublished,
                telegram_bot_flow_json: telegramBotFlowJson
            };
            const insertBotRes = await telegramModel.insertTelegramBot(reqObj);
            if (insertBotRes && isPublished) {
                const getConnectedBotConfigRes = await telegramModel.getConnectedBotConfig(botCreatedBy, clientId);
                const publishTelegramBotRes = await publishTelegram.publishTelegramBot(telegramBotFlowJson, getConnectedBotConfigRes.bot_token);
                if (publishTelegramBotRes) {
                    publishTelegramBotRes.launch({
                        webhook: {
                            domain: "https://typedwebhook.tools/webhook/4fe64240-799d-4875-9b69-abd017120201",
                            // port: port,
                            // path: webhookPath,
                            // secretToken: randomAlphaNumericString,
                        },
                    });
                    return res.send({ status: true, code: 200, data: null, message: "Telegram bot has been successfully published.", refreshToken: refreshToken });
                } else {
                    return res.send({ status: false, code: 204, data: null, message: "Unable to publish the Telegram bot. Please try again.", refreshToken: refreshToken });
                }
            } else {
                return res.send({ status: false, code: 204, data: null, message: "Bot configuration is incomplete. Please ensure the bot is connected and a valid token is provided before publishing.", refreshToken: refreshToken });
            }
        } catch (err) {
            return res.send({ status: false, code: 500, message: "Server Internal Error" });
        }
    }
}

export { Telegram };