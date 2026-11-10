import pool from "../config/db.js";
import argon from "argon2"
import { ErrorException} from "../utils/error.js";

class StaffService {
    constructor() { }

    async getStaff(req, res, next) {
        try {
            const staffs = await pool.query(
                `select id, fullname, phone, photo, role, status, created_at from staff order by id`
            );



            return {
                status: 200,
                data: staffs.rows
            }
        } catch (error) {
            return new ErrorException(500, error)
        }
    }

    async createStaff(req, res, next) {
        try {
            const { fullname, phone, password, role } = req.body;
            let existStaff = await pool.query(`select * from staff where phone=$1`, [phone])

            if (existStaff.rows.length) {
                return next (new ErrorException(409, "user already exists"))

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
        } catch (error) {
            return next(new ErrorException(500, error))

        }
    }

    async deleteStaff(req, res, next) {
        try {
            
           
            const { id } = req.params
            console.log(id)

             if (String( id ) === String(req.user.id)) {
                return next(new ErrorException(400, "you cannot delete yourself"));
            }


            let existStaff = await pool.query(`select * from staff where id=$1`, [id])


            if (!existStaff.rows.length) {

                return next(new ErrorException(404, "user not found"))
            }
            await pool.query("update staff set status = 'incative'  WHERE id = $1", [id]);

            return {
                status: 200,
                message: "user is delated"
            }

        } catch (error) {
            return next(new ErrorException(500, error))

        }



    }

    async updateStaff(req, res, next) {
        try {
            const { id } = req.params;
            const { fullname, phone, password, role, status, photo } = req.body;

            const existStaff = await pool.query('select * from staff where id=$1', [id]);

            if (!existStaff.rows.length) {
                return next( new ErrorException(404, "user not found"))
            }

            if (phone) {
                const phoneExist = await pool.query(
                    'select id from staff where phone=$1 and id<>$2',
                    [phone, id]
                );
                if (phoneExist.rows.length) {
                    throw new ErrorException(409, "phone already exists");
                }
            }

            const hashedPass = password ? await argon.hash(password) : null;

            await pool.query(
                `update staff set 
                fullname = coalesce($1, fullname),
                phone    = coalesce($2, phone),
                password = coalesce($3, password),
                role     = coalesce($4, role),
                status   = coalesce($5, status),
                photo    = coalesce($6, photo)
            where id = $7`,
                [
                    fullname || null,
                    phone || null,
                    hashedPass || null,
                    role || null,
                    status || null,
                    photo || null,
                    id
                ]
            );

            return res.status(200).json({
                status: 200,
                message: "successfully updated"
            });
        } catch (error) {
            return next(ErrorException(409,error));
        }
    }
}





let staffService = new StaffService();
export default staffService;