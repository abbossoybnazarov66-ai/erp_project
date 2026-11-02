import pool from "../config/db.js";
import argon from "argon2"
import { ConflictError, NotFoundError } from "../utils/error.js";

class StaffService {
    constructor() { }

    async getStaff(req, res) {

        const staffs = await pool.query(` select id,fullname, phone, photo, role, status, created_at from staff`,)
       

        return {
            status: 200,
            data: staffs.rows
        }
    }

    async createStaff(req,res,next) {
        const { fullname, phone, password, role } = req.body;


        let existStaff = await pool.query(`select * from staff where phone=$1`, [phone])


        if (existStaff.rows.length) {
            return next(new ConflictError(409,"user already exists"))

        }
        const hashedPass = await argon.hash(password)

        await pool.query(
            'INSERT INTO staff(fullname, phone, password, role) VALUES($1, $2, $3, $4)',
            [fullname, phone, hashedPass, role]
        );
        return {
            status: 201,
            message: "successfully created"
        };
    }

    async deleteStaff(req,res,next) {
        const { id } = req.params


        let existStaff = await pool.query(`select * from staff where id=$1`, [id])


        if (!existStaff.rows.length) {

            return next(new NotFoundError(404,"user not found"))
        }
        await pool.query("update staff set status = 'incative'  WHERE id = $1", [id]);

        return {
            status : 200,
            message : "user is delated"
        }



    }
}



let staffService = new StaffService();
export default staffService;