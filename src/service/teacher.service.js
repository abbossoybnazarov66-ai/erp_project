import argon from "argon2"
import pool from "../config/db.js"
import { ErrorException } from "../utils/error.js"
import fs from "fs"

const IMAGE_TYPES = { "image/png": "png", "image/jpeg": "jpg" }
const PHOTO_DIR = process.cwd() + "/src/uploads/photo/"
fs.mkdirSync(PHOTO_DIR, { recursive: true })

class teacherService {




    async getTeachers(req, res, next) {
        try {
            const teachers = await pool.query(`select id, fullname, phone, experience, job, description, portfolio, github, telegram, linkedin, status from teachers
                where status = 'active' order by id `)


            return {

                status: 200,
                data: teachers.rows
            }

        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async createTeacher(req, res, next) {
        try {
            const { fullname, phone, password, experience, job, description, portfolio, github, telegram, linkedin, status } = req.body

            let hashedPass = await argon.hash(password)

            let existeacher = await pool.query(`select * from teachers where phone=$1`, [phone])
            if (existeacher.rows.length) {
                return next(new ErrorException(409, "teacher already exists"))
            }

            const photo = req.files?.photo
            let fileNamePhoto = null
            if (photo) {
                if (!IMAGE_TYPES[photo.mimetype]) {
                    return next(new ErrorException(415, "Unsupported photo type. Allowed: png, jpg"))
                }
                fileNamePhoto = Date.now() + "." + IMAGE_TYPES[photo.mimetype]
                await photo.mv(PHOTO_DIR + fileNamePhoto)
            }


            await pool.query(`insert into teachers (fullname, phone, photo, password, experience, job, description, portfolio, github, telegram, linkedin, status) 
                values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'active')`,
                [fullname, phone, photo, hashedPass, experience, job, description, portfolio, github, telegram, linkedin]
            )

            return {
                status: 200,
                message: "teacher succesefully  added"
            }

        } catch (error) {
            return next(new ErrorException(500, error))

        }

    }

    async deleteTeacher(req, res, next) {

        try {
            const { id } = req.params
            console.log(id)



            let existeacher = await pool.query("select * from teachers where id = $1", [id])

            if (!existeacher.rows.length) {
                return next(new ErrorException(403, "teacher is not found"))
            }

            await pool.query("update teachers set status = 'incative'  WHERE id = $1", [id]);

            return {
                status: 200,
                message: "teacher is delated"
            }



        } catch (error) {
            return next(new ErrorException(500, error))

        }



    }

    async updateTeacher(req, res, next) {
        try {
            const { id } = req.params;
            const {
                fullname, phone, password, experience, job,
                description, portfolio, github, telegram, linkedin, status
            } = req.body;


           
            if (phone) {
                const teacherExist = await pool.query(
                    `select id from teachers where phone = $1 and id <> $2`,
                    [phone, id]
                )

                if (teacherExist.rows.length) {
                    return next(new ErrorException(409, "phone already exists"))
                }

                const staffExist = await pool.query(`select id from staff where phone = $1`, [phone])
                if (staffExist.rows.length) {
                    return next(new ErrorException(409, "phone already used by staff"))
                }
            }



            const photo = req.files?.photo
            let fileNamePhoto = null
            if (photo) {
                if (!IMAGE_TYPES[photo.mimetype]) {
                    return next(new ErrorException(415, "Unsupported photo type. Allowed: png, jpg"))
                }
                fileNamePhoto = Date.now() + "." + IMAGE_TYPES[photo.mimetype]
                await photo.mv(PHOTO_DIR + fileNamePhoto)
            }



            const hashedPass = password ? await argon.hash(password) : null;
            await pool.query(
                `update teachers set 
                fullname    = coalesce($1, fullname),
                phone       = coalesce($2, phone),
                password    = coalesce($3, password),
                experience  = coalesce($4, experience),
                job         = coalesce($5, job),
                description = coalesce($6, description),
                portfolio   = coalesce($7, portfolio),
                github      = coalesce($8, github),
                telegram    = coalesce($9, telegram),
                linkedin    = coalesce($10, linkedin),
                status      = coalesce($11, status),
                photo       = coalesce($12, photo)
            where id = $13`,
                [
                    fullname || null, phone || null, hashedPass,
                    experience || null, job || null, description || null,
                    portfolio || null, github || null, telegram || null,
                    linkedin || null, status || null, photo || null, id
                ]
            );

            return {
                status: 200,
                message: "successfully updated"
            }
        } catch (error) {
            return next(new ErrorException(500, error));
        }
    }


}

let teacherservice = new teacherService()

export default teacherservice