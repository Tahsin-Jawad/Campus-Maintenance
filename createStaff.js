
const db = require("./config/db");
const bcrypt = require("bcryptjs");

async function createStaff() {
    try {
        const name = "Maintenance Staff";
        const email = "staff@ewu.edu";
        const password = "Staff@12345";
        const phone = "01700000002";

        const [roles] = await db.promise().query(
            "SELECT role_id FROM roles WHERE role_name = 'Maintenance Staff'"
        );

        if (roles.length === 0) {
            console.log("Maintenance Staff role not found!");
            return;
        }

        const [existing] = await db.promise().query(
            "SELECT user_id FROM users WHERE email = ?",
            [email]
        );

        if (existing.length > 0) {
            console.log("Staff account already exists!");
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.promise().query(
            `INSERT INTO users
            (role_id, name, email, password, phone)
            VALUES (?, ?, ?, ?, ?)`,
            [
                roles[0].role_id,
                name,
                email,
                hashedPassword,
                phone
            ]
        );

        console.log("Staff account created successfully!");
        console.log("Email:", email);
        console.log("Password:", password);

    } catch (error) {
        console.log("Error:", error);
    } finally {
        db.end();
    }
}

createStaff();
