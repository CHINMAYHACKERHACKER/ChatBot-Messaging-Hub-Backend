import { db } from "../config/DataBase.js";

class telegramModel {
    static async insertTelegramBotConfig(reqObj) {
        try {
            await db.from("telegram_bot_config").insert(reqObj);
        } catch (error) {
            console.error("Error In insertTelegramBotConfig", error);
            return null;
        }
    }

    static async getTelegramConnectionByClientId(clientId) {
        try {
            const getTelegramConnectionByClientIdRes = await db
                .from("telegram_bot_config")
                .select([
                    "client_id",
                    "bot_id",
                    "bot_username",
                    "bot_name",
                    "is_connected",
                    "created_at",
                    "updated_at",
                ])
                .where({
                    client_id: clientId,
                    is_connected: true,
                });
            return getTelegramConnectionByClientIdRes;
        } catch (error) {
            console.error("Error In getTelegramConnectionByClientId", error);
            return null;
        }
    }

    static async getConnectedBotConfig(createdBy, clientId) {
        try {
            const getConnectedBotConfigRes = await db
                .from("telegram_bot_config")
                .select([
                    "client_id",
                    "bot_id",
                    "bot_username",
                    "bot_name",
                    "bot_token",
                    "webhook_url",
                    "created_by",
                    "is_connected",
                ])
                .where({
                    client_id: clientId,
                    created_by: createdBy
                }).first();
            return getConnectedBotConfigRes;
        } catch (error) {
            console.error("Error In getConnectedBotConfig", error);
            return null;
        }
    }

    static async insertTelegramBot(reqObj) {
        try {
            await db.from("telegram_bot").insert(reqObj);
            return true;
        } catch (error) {
            console.error("Error In insertTelegramBotConfig", error);
            return null;
        }
    }
}

export { telegramModel };