
import mentorservice from "../service/mentor.service.js"
import { ErrorException } from "../utils/error.js"

class mentorControllers {

    async getMentors(req, res, next) {
        try {
            const resData = await mentorservice.getMentors(req, res, next)
            if (!resData) return
            return res.status(resData.status).json(resData)

        } catch (error) {
            next(new ErrorException(500, error))
            console.log(error)

        }


    }



    async createMentors(req, res, next) {
        try {
            const resData = await mentorservice.createMentors(req, res, next)
            if (!resData) return
            return res.status(resData.status).json(resData)
        } catch (error) {

            console.log(error)
             next( new ErrorException(500,error))
        }
    }


    async deleteMentors(req, res, next) {

        const resData = await mentorservice.deleteMentor(req, res, next)
        console.log(resData)
        if (!resData) return
        return res.status(resData.status).json(resData)
    }

     async updeteMentors(req, res, next) {

        const resData = await mentorservice.updateMentors(req, res, next)
        console.log(resData)
        if (!resData) return
        return res.status(resData.status).json(resData)
    }


}






const mentorcontrollers = new mentorControllers()

export default mentorcontrollers