
import staffService from "../service/staff.service.js";



class StaffController {
    constructor() { }


    async getStaff(req, res, next) {
        try {
            const resData = await staffService.getStaff(req, res, next);
            if (!resData) return;
            return res.status(resData.status).json(resData);
        } catch (error) {
            console.log(error)
            next(error);
        }
    }

    async createStaff(req, res, next) {
        let resData = await staffService.createStaff(req, res, next);
        if (!resData) return;



        return res.status(resData.status).json(resData);
    }

    async deleteStaff(req, res, next) {
        let resData = await staffService.deleteStaff(req, res, next);
        if (!resData) return;
        return res.status(resData.status).json(resData)
    }

    async updateStaff(req, res, next) {
        let resData = await staffService.updateStaff(req, res, next);
        if (!resData) return;
        return res.status(resData.status).json(resData)
    }
}

const staffController = new StaffController();
export default staffController;