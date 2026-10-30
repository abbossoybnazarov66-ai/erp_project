import staffService from "../service/staff.service.js";

class StaffController {
    constructor() {}

    async createStaff(req, res) {
        let resData = await staffService.createStaff(req, res);
        return res.status(resData.status).json(resData);
    }
}

const staffController = new StaffController();
export default staffController;