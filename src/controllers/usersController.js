import { userModel } from "../models/usersModel.js";

class Users {
    static async getUserByClientId(req, res) {
        try {
            let { refreshToken, body: { clientId } } = req;
            let userDataRes = await userModel.getUserByClientIdData(clientId);

            if (userDataRes && userDataRes.length) {
                return res.send({
                    status: true,
                    code: 200,
                    message: "List Fetched Successfully",
                    data: userDataRes,
                    refreshToken: refreshToken
                });
            } else {
                return res.send({
                    status: false,
                    code: 204,
                    message: "No Data Found",
                    data: null,
                    refreshToken: refreshToken
                });
            }
        } catch (error) {
            return res.send({
                status: false,
                code: 500,
                message: "Internal Server Error"
            });
        }
    }
}

export { Users };