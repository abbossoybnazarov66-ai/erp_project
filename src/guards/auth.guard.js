import jwt from "jsonwebtoken"
import { ErrorException } from "../utils/error.js"

export const authGuard = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]
        if (!token) return next(new ErrorException(401, "token required"))

        req.user = jwt.verify(token, process.env.SECRET_KEY)
        return next()
    } catch (error) {
       console.log(error)
    return next(new ErrorException(401, "invalid or expired token"))
    }
}