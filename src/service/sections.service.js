import argon from "argon2"
import pool from "../config/db.js"
import { ErrorException } from "../utils/error.js"


class sectionsService {

    async getSectionsByUserId(req, next) {
        try {
            const { section_id } = req.params
            const teacherId = req.user.id

            let existsection = await pool.query("select * from sections where id = $1 ",[section_id])


            if (!existsection) {
                return next(new ErrorException(404, "section not found"))
            }

            let course = await pool.query("select * from courses where id = $1", [existsection.rows[0].course_id])

            if (!course.rows.length) {
                return next(new ErrorException(404, "course not found"))
            }

            if ( req.user.role == "teacher" && course.rows[0].teacher_id !== teacherId) {
                return next(new ErrorException(403, "you can not add to this course"))
            }

            const lessons = await pool.query(`select id, name  from lessons where section_id = $1`, [section_id])

            return {
                status: 200,
                data: sections.rows
            }


        } catch (error) {
            return next(new ErrorException(500, error))

        }

    }

    async getSections(req, res, next) {

        try {

            return {

                status: 200,
                data: sections.rows
            }

        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async createSections(req, res, next) {
        try {
            const { name, course_id } = req.body

            let existName = await pool.query(`select * from sections where name =$1 and course_id = $2`, [name, course_id])

            if (existName.rows.length) {
                return next(new ErrorException(409, "sections already exists"))
            }

            const existCourse = await pool.query(` select * from courses where id  = $1`, [course_id])
            if (!existCourse.rows.length) {
                return next(new ErrorException(404, "course not found"))

            }

            if (existCourse.rows[0].teacher_id !== req.user.id) {
                return next(new ErrorException(403, "you cannot add  to this course "))
            }

            if (existCourse.rows[0].status !== "active") {
                return new ErrorException(400, "course is not active")
            }

            await pool.query(`insert into sections ( name,course_id ) 
                values ($1,$2)`,
                [name, course_id]
            )

            return {
                status: 200,
                message: "section succesefully  added"
            }

        } catch (error) {
            return next(new ErrorException(500, error))

        }

    }

    async deleteSections(req, res, next) {
        try {
            const { id } = req.params


            let existsection = await pool.query("select id from sections where id = $1 and status = 'active' ", [id])

            if (!existsection.rows.length) {

                return next(new ErrorException(403, "section is not found"))
            }

            await pool.query("update sections  set status = 'incative'  WHERE id = $1", [id]);

            return {
                status: 200,
                message: "category  is delated"
            }



        } catch (error) {

            return next(new ErrorException(500, error))
        }



    }

    async updatesections(req, res, next) {
        try {

            const { id } = req.params
            const {
                name
            } = req.body


            const existsection = await pool.query("select id from sections where id=$1 and status = 'active' ", [id]);
            if (!existsection.rows.length) {
                return next(new ErrorException(404, "section  not found"))
            }

            await pool.query(
                `update sections set 
                  name = coalesce($1, name) where id = $2`,

                [
                    name, id

                ]
            );

            return res.status(200).json({
                status: 200,
                message: "successfully updated"
            });
        } catch (error) {

            return next(new ErrorException(500, error));
        }
    }


}

let sectionsservice = new sectionsService()

export default sectionsservice