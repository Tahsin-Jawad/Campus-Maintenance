
const db = require("../config/db");
const bcrypt = require("bcryptjs");

// USER REGISTRATION
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;

        // Check required fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: "Please fill in all required fields"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            });
        }

        // Only Student and Faculty can register publicly
        if (!["Student", "Faculty"].includes(role)) {
            return res.status(403).json({
                message: "This role cannot register publicly"
            });
        }

        // Check if email already exists
        const [existingUser] = await db.promise().query(
            "SELECT user_id FROM users WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        // Find role ID
        const [roles] = await db.promise().query(
            "SELECT role_id FROM roles WHERE role_name = ?",
            [role]
        );

        if (roles.length === 0) {
            return res.status(400).json({
                message: "Invalid role"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        await db.promise().query(
            `INSERT INTO users
            (name, email, password, phone, role_id)
            VALUES (?, ?, ?, ?, ?)`,
            [name, email, hashedPassword, phone || null, roles[0].role_id]
        );

        res.status(201).json({
            message: "Registration successful!"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error during registration"
        });
    }
};


const jwt = require("jsonwebtoken");

// USER LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user with role name
        const [users] = await db.promise().query(
            `SELECT users.*, roles.role_name
             FROM users
             JOIN roles ON users.role_id = roles.role_id
             WHERE users.email = ?`,
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = users[0];

        // Check password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                user_id: user.user_id,
                role: user.role_name
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Login successful!",
            token: token,
            user: {
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role_name
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error during login"
        });
    }
};
