import "dotenv/config";
import argon from "argon2";
import pool from "./config/db.js";

const [, , fullname, phone, password] = process.argv;

if (!fullname || !phone || !password) {
    console.log('Ishlatish: node src/seed.js "Ism" "+998901234567" "parol"');
    process.exit(1);
}

const hashed = await argon.hash(password);
const exist = await pool.query("select id from staff where phone = $1", [phone]);

if (exist.rows.length) {
    await pool.query(
        "update staff set password = $1, role = 'admin', status = 'active' where phone = $2",
        [hashed, phone]
    );
    console.log("Mavjud foydalanuvchi admin qilindi va paroli yangilandi");
} else {
    await pool.query(
        "insert into staff (fullname, phone, password, role) values ($1, $2, $3, 'admin')",
        [fullname, phone, hashed]
    );
    console.log("Admin yaratildi");
}

await pool.end();