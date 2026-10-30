import pool from "../config/db.js";

class StaffService {
    constructor() {}

    async createStaff(req, res) {
        const { fullname, phone, password, role } = req.body;
        await pool.query(
            'INSERT INTO staff(fullname, phone, password, role) VALUES($1, $2, $3, $4)',
            [fullname, phone, password, role]
        );
        return {
            status: 201,
            message: "successfully created"
        };
    }
}

let staffService = new StaffService();
export default staffService;