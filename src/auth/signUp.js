import bcrypt from "bcryptjs";
import { authUser } from "../models/authModel.js";
import generator from "generate-password";
import { sendPasswordEmail } from "../helper/mailer.js";
import { v4 as uuidv4 } from "uuid";

class signUp {
    static async userSignUp(req, res) {
        try {
            let { body: { name, email, role, accessLevel, clientId } } = req;
            const saltRounds = 10;
            const hasUserRes = await authUser.hasUser(email);
            if (hasUserRes) {
                return res.send({ status: false, code: 409, message: "An account with this email address already exists. Please use a different email or log in." });
            } else {
                const password = generator.generate({
                    length: 16,
                    numbers: true,
                    symbols: true,
                    uppercase: true,
                    lowercase: true,
                    strict: true,
                    exclude: '"\\'
                });
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                let reqObj = {
                    user_name: name,
                    email: email,
                    password_hash: hashedPassword,
                    role: role,
                    access_level: accessLevel ? accessLevel : null,
                    client_id: role == "admin" ? uuidv4() : clientId
                }
                const insertDataRes = await authUser.insertData(reqObj);
                if (insertDataRes) {
                    let emailRes = await sendPasswordEmail(email, password, 'signup');
                    return res.send({ status: true, code: 200, message: "User Details Inserted SucessFully", Email: emailRes && emailRes.accepted && emailRes.accepted.length > 0 ? 200 : 500 });
                } else {
                    return res.send({ status: false, code: 400, message: "User Details Not Inserted" });
                }
            }
        } catch (error) {
            console.error("Error In userSignUp", error);
            return res.send({ status: false, code: 500, message: "Internal Server Error" });
        }
    }
}

export { signUp };