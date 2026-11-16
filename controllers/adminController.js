
const db = require("../config/db");

// VIEW ALL COMPLAINTS
exports.getAllComplaints = async (req, res) => {
    try {
        const [complaints] = await db.promise().query(
            `SELECT
                c.complaint_id,
                u.name AS submitted_by,
                u.email,
                l.building_name,
                l.room_number,
                cat.category_name,
                c.title,
                c.description,
                s.status_name,
                c.created_at
            FROM complaints c
            JOIN users u ON c.user_id = u.user_id
            JOIN locations l ON c.location_id = l.location_id
            JOIN categories cat ON c.category_id = cat.category_id
            JOIN statuses s ON c.status_id = s.status_id
            ORDER BY c.created_at DESC`
        );

        res.status(200).json({
            total: complaints.length,
            complaints
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error retrieving complaints"
        });
    }
};


// VIEW MAINTENANCE STAFF
exports.getMaintenanceStaff = async (req, res) => {
    try {
        const [staff] = await db.promise().query(
            `SELECT u.user_id, u.name, u.email
             FROM users u
             JOIN roles r ON u.role_id = r.role_id
             WHERE r.role_name = 'Maintenance Staff'`
        );

        res.status(200).json({
            total: staff.length,
            staff
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error retrieving maintenance staff"
        });
    }
};


// UPDATE COMPLAINT STATUS
exports.updateComplaintStatus = async (req, res) => {
    const connection = db.promise();
    let transactionStarted = false;

    try {
        const { id } = req.params;
        const { status_name, remarks } = req.body;

        if (!status_name) {
            return res.status(400).json({
                message: "Please provide a status name"
            });
        }

        const [statuses] = await connection.query(
            "SELECT status_id, status_name FROM statuses WHERE status_name = ?",
            [status_name]
        );

        if (statuses.length === 0) {
            return res.status(400).json({
                message: "Invalid status name"
            });
        }

        await connection.beginTransaction();
        transactionStarted = true;

        const [complaints] = await connection.query(
            "SELECT complaint_id FROM complaints WHERE complaint_id = ? FOR UPDATE",
            [id]
        );

        if (complaints.length === 0) {
            await connection.rollback();
            transactionStarted = false;

            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        await connection.query(
            "UPDATE complaints SET status_id = ? WHERE complaint_id = ?",
            [statuses[0].status_id, id]
        );

        await connection.query(
            `INSERT INTO complaint_history
             (complaint_id, status_id, updated_by, remarks)
             VALUES (?, ?, ?, ?)`,
            [
                id,
                statuses[0].status_id,
                req.user.user_id,
                remarks || `Status changed to ${status_name}`
            ]
        );

        await connection.commit();
        transactionStarted = false;

        res.status(200).json({
            message: "Complaint status updated successfully!",
            complaint_id: id,
            new_status: status_name
        });

    } catch (error) {
        if (transactionStarted) {
            await connection.rollback();
        }

        console.error(error);

        res.status(500).json({
            message: "Error updating complaint status"
        });
    }
};


// ASSIGN COMPLAINT TO MAINTENANCE STAFF
exports.assignComplaint = async (req, res) => {
    const connection = db.promise();
    let transactionStarted = false;

    try {
        const { id } = req.params;
        const { staff_id } = req.body;

        if (!staff_id) {
            return res.status(400).json({
                message: "Please provide staff_id"
            });
        }

        // Check maintenance staff
        const [staff] = await connection.query(
            `SELECT u.user_id
             FROM users u
             JOIN roles r ON u.role_id = r.role_id
             WHERE u.user_id = ?
             AND r.role_name = 'Maintenance Staff'`,
            [staff_id]
        );

        if (staff.length === 0) {
            return res.status(400).json({
                message: "Invalid maintenance staff ID"
            });
        }

        // Find Assigned status
        const [statuses] = await connection.query(
            "SELECT status_id FROM statuses WHERE status_name = 'Assigned'"
        );

        if (statuses.length === 0) {
            return res.status(500).json({
                message: "Assigned status is missing from database"
            });
        }

        await connection.beginTransaction();
        transactionStarted = true;

        // Lock complaint row
        const [complaints] = await connection.query(
            "SELECT complaint_id FROM complaints WHERE complaint_id = ? FOR UPDATE",
            [id]
        );

        if (complaints.length === 0) {
            await connection.rollback();
            transactionStarted = false;

            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        // Prevent duplicate assignment
        const [existing] = await connection.query(
            "SELECT assignment_id FROM staff_assignments WHERE complaint_id = ?",
            [id]
        );

        if (existing.length > 0) {
            await connection.rollback();
            transactionStarted = false;

            return res.status(409).json({
                message: "This complaint has already been assigned."
            });
        }

        // Insert assignment
        await connection.query(
            `INSERT INTO staff_assignments
             (complaint_id, staff_id)
             VALUES (?, ?)`,
            [id, staff_id]
        );

        // Update complaint status
        await connection.query(
            "UPDATE complaints SET status_id = ? WHERE complaint_id = ?",
            [statuses[0].status_id, id]
        );

        // Insert history
        await connection.query(
            `INSERT INTO complaint_history
             (complaint_id, status_id, updated_by, remarks)
             VALUES (?, ?, ?, ?)`,
            [
                id,
                statuses[0].status_id,
                req.user.user_id,
                `Complaint assigned to maintenance staff ID ${staff_id}`
            ]
        );

        await connection.commit();
        transactionStarted = false;

        res.status(200).json({
            message: "Complaint assigned successfully!",
            complaint_id: id,
            staff_id
        });

    } catch (error) {
        if (transactionStarted) {
            await connection.rollback();
        }

        console.error(error);

        res.status(500).json({
            message: "Error assigning complaint"
        });
    }
};
