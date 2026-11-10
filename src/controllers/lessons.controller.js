import lessonsService from "../service/sections.service.js"
class lessonsController {


    async getLessons(req, res, next) {
        try {
            const resData = await lessonsService.getLessons(req, res, next)
            if (!resData) return
            return res.status(resData.status).json(resData)
        } catch (error) {

            return (error)
        }
    }
    async getSectionsByUserId(req, res, next) {
        try {
            const resData = await lessonsService.getMyLessons(req,next)
            if (!resData) return
            return res.status(resData.status).json(resData)
        } catch (error) {

            return next(error)
        }
    }


    async createLessons(req, res, next) {

        try {
            const resData = await lessonsService.createLessons(req, res, next)
            if (!resData) return
            return res.status(resData.status).json(resData);

        } catch (error) {
            console.log(error)
            next(error);
        }
    }


    async deleteLessons(req, res, next) {

        try {
            const resData = await lessonsService.deleteLessons(req, res, next)
            if (!resData) return
            return res.status(resData.status).json(resData)
        } catch (error) {
            console.log(error.message)
            next(error)

        }
    }
    async updateLessons(req, res, next) {

        const resData = await lessonsService.updateLessons(req, res, next)
        console.log(resData)
        if (!resData) return
        return res.status(resData.status).json(resData)
    }
}

let lessonscontroller = new lessonsController()
export default lessonscontroller