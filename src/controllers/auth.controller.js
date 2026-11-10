import authservice from "../service/auth.service.js"
class authController {


    async login(req, res, next) {

        try {
            const resData = await authservice.login(req, res, next);
            if (!resData) return;
            return res.status(resData.status).json(resData);
        } catch (error) {
            next(error);
        }
    }
}
let authcontroller = new authController()
export default authcontroller

