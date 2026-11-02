import pool from "../config/db.js";
import staffService from "../service/staff.service.js";


class StaffController {
    constructor() {}


    async getStaff(req,res,){
         let resData = await staffService.getStaff(req);
       return res.status(resData.status).json(resData)
    }

    async createStaff(req, res,next) {
        let resData = await staffService.createStaff(req,res,next);
       
        return res.status(resData.status).json(resData);
    }

     async deleteStaff(req,res,next){
        let resData = await staffService.deleteStaff(req,res,next);
       return res.status(resData.status).json(resData)
    }
}

const staffController = new StaffController();
export default staffController;