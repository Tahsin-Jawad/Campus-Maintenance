
const db = require("./config/db");
const bcrypt = require("bcryptjs");

async function resetAdminPassword() {
    try {
        const email = "admin@ewu.edu";
        const newPassword = "Admin@12345";

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const [result] = await db.promise().query(
            `UPDATE users
             SET password = ?
             WHERE email = ?`,
            [hashedPassword, email]
        );

        if (result.affectedRows === 0) {
            console.log("Admin account not found!");
        } else {
            console.log("Admin password reset successfully!");
            console.log("Email:", email);
            console.log("New Password:", newPassword);
        }

    } catch (error) {
        console.log("Error:", error);
    } finally {
        db.end();
    }
}

resetAdminPassword();
