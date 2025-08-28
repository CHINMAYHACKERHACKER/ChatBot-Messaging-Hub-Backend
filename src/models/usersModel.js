import { db } from "../config/DataBase.js";

class userModel {
    static async getUserByClientIdData(clientId) {
        let userList = await db
            .from("users")
            .select("id", "role", "user_name", "email", "access_level")
            .where({
                client_id: clientId,
                role: "user",
            });
        return userList;
    }

    static async incrementLoginAttment(id) {
        await db("users").where({ id: id }).increment("login_attempt", 1);
    }
}

export { userModel };