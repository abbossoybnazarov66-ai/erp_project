import argon from "argon2"
import pool from "../config/db.js"
import { ErrorException } from "../utils/error.js"

import fs from "fs"

const IMAGE_TYPES = { "image/png": "png", "image/jpeg": "jpg" }
const PHOTO_DIR = process.cwd() + "/src/uploads/photo/"
fs.mkdirSync(PHOTO_DIR, { recursive: true })



class studentService {




    async getStudents(req, res, next) {
        try {
            const students = await pool.query(`select id,fullname, phone, status,created_at from students where status = 'active' order by id `)


            return {

                status: 200,
                data: students.rows
            }

        } catch (error) {
            return next( new ErrorException(500, error))
        }
    }

    async createStudents(req, res, next) {
        try {
            const { fullname, phone, password } = req.body
            let hashedPass = await argon.hash(password)

            let existStudent = await pool.query(`select * from students where phone=$1`, [phone])
            if (existStudent.rows.length) {
                return next(new ErrorException(409, "student already exists"))
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




            await pool.query(`insert into students (fullname, phone, password,photo ) 
                values ($1, $2, $3,$4)`,
                [fullname, phone, hashedPass,fileNamePhoto]
            )

            return {
                status: 201,
                message: "student succesefully  added"
            }

        } catch (error) {
            return next(ErrorException(500, error))

        }

    }

    async deleteStudents(req, res, next) {
        try {
            const { id } = req.params
            console.log(id)

            let existStudent = await pool.query("select id from students where id = $1", [id])

            if (!existStudent.rows.length) {
                console.log("jj")
                return new ErrorException(403, "student is not found")
            }

            await pool.query("update students set status = 'inactive'  WHERE id = $1", [id]);

            return {
                status: 200,
                message: "student is delated"
            }



        } catch (error) {

            return next(new ErrorException(500, error))
        }



    }

    async updateStudent(req, res, next) {
    try {
        const { id } = req.params
        const { fullname, phone, password, status } = req.body

        const existStudent = await pool.query("select id from students where id = $1", [id])
        if (!existStudent.rows.length) {
            return next(new ErrorException(404, "student not found"))
        }

        if (phone) {
            const phoneExist = await pool.query(
                "select id from students where phone = $1 and id <> $2",
                [phone, id]
            )
            if (phoneExist.rows.length) {
                return next(new ErrorException(409, "phone already exists"))
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

        const hashedPass = password ? await argon.hash(password) : null

        await pool.query(
            `update students set
                fullname = coalesce($1, fullname),
                phone    = coalesce($2, phone),
                password = coalesce($3, password),
                status   = coalesce($4, status),
                photo    = coalesce($5, photo)
             where id = $6`,
            [fullname || null, phone || null, hashedPass, status || null, fileNamePhoto, id]
        )

        return { status: 200, message: "successfully updated" }
    } catch (error) {
        return next(new ErrorException(500, error))
    }
}


}

let studentservice = new studentService()

export default studentservice