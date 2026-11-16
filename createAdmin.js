
const db = require("./config/db");
const bcrypt = require("bcryptjs");

async function createAdmin() {
    try {
        const name = "System Admin";
        const email = "admin@ewu.edu";
        const password = "Admin@12345";
        const phone = "01700000001";

        // Find Admin role
        const [roles] = await db.promise().query(
            "SELECT role_id FROM roles WHERE role_name = 'Admin'"
        );

        if (roles.length === 0) {
            console.log("Admin role not found!");
            return;
        }

        // Check existing account
        const [existing] = await db.promise().query(
            "SELECT user_id FROM users WHERE email = ?",
            [email]
        );

        if (existing.length > 0) {
            console.log("Admin account already exists!");
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create Admin account
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

        console.log("Admin account created successfully!");

        console.log("Email:", email);
        console.log("Password:", password);

    } catch (error) {
        console.log("Error:", error);
    } finally {
        db.end();
    }
}

createAdmin();
