import { authUser } from "../models/authModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { userModel } from "../models/usersModel.js";

class login {
    static async userLogin(req, res) {
        try {
            let { body: { email, password } } = req;
            let hashedPassword = await authUser.getUserPasswordByEmail(email);
            if (hashedPassword) {
                let checkBcryptPasswordRes = await bcrypt.compare(password, hashedPassword.password_hash);
                if (checkBcryptPasswordRes) {
                    const accessToken = jwt.sign(
                        {
                            id: hashedPassword.id,
                            clientId: hashedPassword.client_id,
                            role: hashedPassword.role,
                            userName: hashedPassword.user_name,
                            AccessLevel: hashedPassword.access_level
                        },
                        "jwt-access-token-secret-key"
                    );
                    const refreshToken = jwt.sign(
                        {
                            id: hashedPassword.id,
                            clientId: hashedPassword.client_id,
                            role: hashedPassword.role,
                            userName: hashedPassword.user_name,
                            AccessLevel: hashedPassword.access_level
                        },
                        "jwt-refresh-token-secret-key",
                        { expiresIn: '1h' }
                    );
                    await userModel.incrementLoginAttment(hashedPassword.id);
                    return res.send({ status: true, code: 200, message: "LoggedIn Sucessfully", accessToken: accessToken, refreshToken: refreshToken });
                } else {
                    return res.send({ status: false, code: 401, message: "Invalid login details. Please try again" });
                }
            } else {
                return res.send({ status: false, code: 401, message: "Invalid login details. Please try again" });
            }
        } catch (error) {
            console.error("Error In userLogin", error);
            return res.send({ status: false, code: 500, message: "Internal Server Error" });
        }
    }
}

export { login };