import teacherservice from "../service/teacher.service.js"
class teacherController {


    async getTeacher(req, res, next) {
        const resData = await teacherservice.getTeachers(req, res, next)
        if (!resData) return
        return res.status(resData.status).json(resData)
    }

    async createTeacher(req, res, next) {

        try {
            const resData = await teacherservice.createTeacher(req, res, next)
            if (!resData) return
            return res.status(resData.status).json(resData);

        } catch (error) {
            console.log(error)
            next(error);
        }
    }


    async deleteTeacher(req, res, next) {

        try {
            const resData = await teacherservice.deleteTeacher(req, res, next)
            if (!resData) return
            return res.status(resData.status).json(resData)
        } catch (error) {
            console.log(error)
            next(error);
        }
    }

    async updateTeacher(req, res, next) {

        const resData = await teacherservice.updateTeacher(req, res, next)
        if (!resData) return
        return res.status(resData.status).json(resData)
    }
}

let teachercontroller = new teacherController()
export default teachercontroller
