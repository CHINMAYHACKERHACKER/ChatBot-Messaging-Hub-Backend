import { db } from "../config/DataBase.js";

class authUser {
    static async hasUser(email) {
        try {
            const user = await db.from("users").where({ email }).first();
            return !!user;
        } catch (error) {
            console.error("Error In hasUser", error);
            return null;
        }
    }

    static async insertData(userData) {
        try {
            await db.from("users").insert(userData);
            return true;
        } catch (error) {
            console.error("Error In insertData", error);
            return null;
        }
    }

    static async getUserPasswordByEmail(email) {
        try {
            let getUserPasswordByEmailRes = await db
                .from("users")
                .select(
                    "id",
                    "role",
                    "user_name",
                    "client_id",
                    "password_hash",
                    "access_level"
                )
                .where({ email })
                .first();
            return getUserPasswordByEmailRes ? getUserPasswordByEmailRes : null;
        } catch (error) {
            console.error("Error In insertData", error);
            return null;
        }
    }

    static async updatePassword(reqObj) {
        try {
            let { email, password_hash } = reqObj;
            await db("users")
                .where({ email })
                .update({
                    password_hash,
                    updated_at: new Date(),
                });
            return true;
        } catch (error) {
            console.error("Error In updatePassword", error);
            return null;
        }
    }
}

export { authUser };
