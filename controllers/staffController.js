
const db = require("../config/db");

// VIEW ASSIGNED COMPLAINTS
exports.getAssignedComplaints = async (req, res) => {
    try {
        const [complaints] = await db.promise().query(
            `SELECT DISTINCT
                c.complaint_id,
                c.title,
                c.description,
                l.building_name,
                l.room_number,
                cat.category_name,
                s.status_name,
                c.created_at
             FROM staff_assignments sa
             JOIN complaints c ON sa.complaint_id = c.complaint_id
             JOIN locations l ON c.location_id = l.location_id
             JOIN categories cat ON c.category_id = cat.category_id
             JOIN statuses s ON c.status_id = s.status_id
             WHERE sa.staff_id = ?
             ORDER BY c.created_at DESC`,
            [req.user.user_id]
        );

        res.status(200).json({
            message: "Assigned complaints retrieved successfully!",
            total: complaints.length,
            complaints
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error retrieving assigned complaints"
        });
    }
};


// UPDATE ASSIGNED COMPLAINT STATUS
exports.updateAssignedComplaintStatus = async (req, res) => {
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

        const allowedStatuses = ["In Progress", "Resolved"];

        if (!allowedStatuses.includes(status_name)) {
            return res.status(400).json({
                message: "Staff can only set status to In Progress or Resolved"
            });
        }

        const [assignments] = await connection.query(
            `SELECT assignment_id
             FROM staff_assignments
             WHERE complaint_id = ? AND staff_id = ?`,
            [id, req.user.user_id]
        );

        if (assignments.length === 0) {
            return res.status(403).json({
                message: "This complaint is not assigned to you"
            });
        }

        const [statuses] = await connection.query(
            "SELECT status_id FROM statuses WHERE status_name = ?",
            [status_name]
        );

        if (statuses.length === 0) {
            return res.status(400).json({
                message: "Status not found"
            });
        }

        await connection.beginTransaction();
        transactionStarted = true;

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
            message: "Error updating assigned complaint status"
        });
    }
};
