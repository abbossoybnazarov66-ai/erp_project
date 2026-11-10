import studentService from "../service/students.service.js"
class studentController {


    async getStudent(req, res, next) {
        const resData = await studentService.getStudents(req, res, next)
        if (!resData) return
        return res.status(resData.status).json(resData)
    }

    async createStudent(req, res, next) {

        try {
            const resData = await studentService.createStudents(req, res, next)
            if (!resData) return
            return res.status(resData.status).json(resData);

        } catch (error) {
            console.log(error)
            next(error);
        }
    }


    async deleteStudent(req, res, next) {

        try {
            console.log("k")
            const resData = await studentService.deleteStudents(req, res, next)
            if (!resData) return
            return res.status(resData.status).json(resData)
        } catch (error) {
            console.log(error.message)
            next(error)

        }
    }
    async updateStudent(req, res, next) {

        const resData = await studentService.updateStudent(req, res, next)
        console.log(resData)
        if (!resData) return
        return res.status(resData.status).json(resData)
    }
}

let studentcontroller = new studentController()
export default studentcontroller