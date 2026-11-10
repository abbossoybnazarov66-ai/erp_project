import argon from "argon2";
import pool from "../config/db.js";
import { ErrorException } from "../utils/error.js";
import { genereteAccessToken, genereteRefreshToken } from "../utils/JWT.js";




class authService {
    constructor() {

    }

    async login(req, res, next) {
        try {
            const { phone, password } = req.body

            if (!phone || !password) {
                return next(new ErrorException(400, "phone and password are required"));
            }

            let user = null
            let role = null

            // 1) avval staff (admin va boshqalar)
            const staff = await pool.query("select * from staff where phone = $1", [phone])
            if (staff.rows.length) {
                user = staff.rows[0]
                role = user.role
            } else {
                // 2) topilmasa teachers
                const teacher = await pool.query("select * from teachers where phone = $1", [phone])
                console.log(teacher)
                if (teacher.rows.length) {
                    user = teacher.rows[0]
                    role = "teacher"
                }
                console.log(user.password)
            }

            if (!user || user.status === "inactive") {
                throw new ErrorException(404, "Bunday raqamli foydalanuvchi topilmadi!")
            }

            const isValid = await argon.verify(user.password, password);
            if (!isValid) {
                return next(new ErrorException(401, "Phone or password is incorrect"));
            }



            return {
                status: 200,
                message: "user succesefullyy passed from login",
                accessToken: genereteAccessToken({ id: user.id, role }),
                refreshToken: genereteRefreshToken({ id: user.id, phone: user.phone, role })
            }
        } catch (error) {
            return next(ErrorException(401, "Phone or password is incorrect"))
        }
    }
}
const authservice = new authService()

export default authservice
