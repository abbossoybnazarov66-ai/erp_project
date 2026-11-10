import argon from "argon2"
import pool from "../config/db.js"
import { ErrorException } from "../utils/error.js"

class MentorService {

    async getMentors(req, res, next) {
        try {
            const mentors = await pool.query(
                `select id, fullname, phone, experience, job, description, portfolio,
                        github, telegram, linkedin, status, photo, created_at
                 from  mentors where status = 'active'`
            )

            return {
                status: 200,
                data: mentors.rows
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async createMentors(req, res, next) {
        try {
            const {
                fullname, phone, password, experience, job,
                description, portfolio, github, telegram, linkedin, status
            } = req.body

            
            const existMentor = await pool.query(
                "select id from mentors where phone = $1",
                [phone]
            )

            if (existMentor.rows.length) {
                return next(new ErrorException(409, "mentor already exists"))
            }

            const hashedPass = await argon.hash(password)

            
            await pool.query(
                `insert into mentors
                    (fullname, phone, password, experience, job, description,
                     portfolio, github, telegram, linkedin, status)
                 values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                [fullname, phone, hashedPass, experience, job, description,
                 portfolio, github, telegram, linkedin, status]
            )

            return {
                status: 201,
                message: "mentor successfully added"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async deleteMentor(req, res, next) {
        try {
            const { id } = req.params

            const existMentor = await pool.query(
                "select id from mentors where id = $1",
                [id]
            )

            if (!existMentor.rows.length) {
                return next(new ErrorException(404, "mentor is not found"))
            }

            await pool.query("update mentors set status = 'inactive' where id =$1", [id])

            return {
                status: 200,
                message: "mentor successfully deleted"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

        async updateMentors(req, res, next) {
        try {
            const { id } = req.params
            const { fullname, phone, password, experience, job, description,
                    portfolio, github, telegram, linkedin, status } = req.body

            const existMentor = await pool.query("select id from mentors where id = $1", [id])
            if (!existMentor.rows.length) {
                return next(new ErrorException(404, "mentor is not found"))
            }

            if (phone) {
                const phoneExist = await pool.query(
                    "select id from mentors where phone = $1 and id <> $2",
                    [phone, id]
                )
                if (phoneExist.rows.length) {
                    return next(new ErrorException(409, "phone already exists"))
                }
            }

            const hashedPass = password ? await argon.hash(password) : null

            await pool.query(
                `update mentors set
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
                    status      = coalesce($11, status)
                 where id = $12`,
                [
                    fullname || null, phone || null, hashedPass, experience || null,
                    job || null, description || null, portfolio || null, github || null,
                    telegram || null, linkedin || null, status || null, id
                ]
            )

            return {
                status: 200,
                message: "mentor successfully updated"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    
}


const mentorservice = new MentorService()

export default mentorservice