
const db = require("../config/db");


// SUBMIT COMPLAINT
exports.createComplaint = async (req, res) => {
    const connection = db.promise();

    try {
        const {
            location_id,
            category_id,
            title,
            description
        } = req.body;

        if (!location_id || !category_id || !title || !description) {
            return res.status(400).json({
                message: "Please fill in all required fields"
            });
        }

        await connection.beginTransaction();

        const [result] = await connection.query(
            `INSERT INTO complaints
            (user_id, location_id, category_id, status_id, title, description)
            VALUES (?, ?, ?, 1, ?, ?)`,
            [
                req.user.user_id,
                location_id,
                category_id,
                title,
                description
            ]
        );

        await connection.query(
            `INSERT INTO complaint_history
            (complaint_id, status_id, updated_by, remarks)
            VALUES (?, 1, ?, ?)`,
            [
                result.insertId,
                req.user.user_id,
                "Complaint submitted"
            ]
        );

        await connection.commit();

        res.status(201).json({
            message: "Complaint submitted successfully!",
            complaint_id: result.insertId
        });

    } catch (error) {
        await connection.rollback();

        console.error("COMPLAINT ERROR:", error);

        res.status(500).json({
            message: "Server error while submitting complaint",
            error: error.message
        });
    }
};


// VIEW MY COMPLAINTS
exports.getMyComplaints = async (req, res) => {
    try {
        const [complaints] = await db.promise().query(
            `SELECT
                c.complaint_id,
                c.title,
                c.description,
                l.building_name,
                l.room_number,
                cat.category_name,
                s.status_name,
                c.created_at
            FROM complaints c
            JOIN locations l ON c.location_id = l.location_id
            JOIN categories cat ON c.category_id = cat.category_id
            JOIN statuses s ON c.status_id = s.status_id
            WHERE c.user_id = ?
            ORDER BY c.created_at DESC`,
            [req.user.user_id]
        );

        res.status(200).json({
            message: "Your complaints retrieved successfully!",
            total: complaints.length,
            complaints: complaints
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error while retrieving complaints"
        });
    }
};

// VIEW SINGLE COMPLAINT
exports.getComplaintById = async (req, res) => {
    try {
        const { id } = req.params;

        const [complaints] = await db.promise().query(
            `SELECT
                c.complaint_id,
                c.title,
                c.description,
                l.building_name,
                l.room_number,
                cat.category_name,
                s.status_name,
                c.created_at
            FROM complaints c
            JOIN locations l ON c.location_id = l.location_id
            JOIN categories cat ON c.category_id = cat.category_id
            JOIN statuses s ON c.status_id = s.status_id
            WHERE c.complaint_id = ? AND c.user_id = ?`,
            [id, req.user.user_id]
        );

        if (complaints.length === 0) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        res.status(200).json({
            message: "Complaint details retrieved successfully!",
            complaint: complaints[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error while retrieving complaint"
        });
    }
};

// VIEW COMPLAINT HISTORY
exports.getComplaintHistory = async (req, res) => {
    try {
        const { id } = req.params;

        const [complaints] = await db.promise().query(
            `SELECT complaint_id
             FROM complaints
             WHERE complaint_id = ? AND user_id = ?`,
            [id, req.user.user_id]
        );

        if (complaints.length === 0) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        const [history] = await db.promise().query(
            `SELECT
                ch.history_id,
                s.status_name,
                ch.remarks,
                u.name AS updated_by,
                ch.updated_at
             FROM complaint_history ch
             JOIN statuses s ON ch.status_id = s.status_id
             JOIN users u ON ch.updated_by = u.user_id
             WHERE ch.complaint_id = ?
             ORDER BY ch.updated_at ASC`,
            [id]
        );

        res.status(200).json({
            message: "Complaint history retrieved successfully!",
            complaint_id: id,
            history: history
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error while retrieving complaint history"
        });
    }
};
