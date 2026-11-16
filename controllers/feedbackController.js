
const db = require("../config/db");

// SUBMIT FEEDBACK
exports.submitFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comments } = req.body;

        if (!rating || !Number.isInteger(Number(rating)) ||
            Number(rating) < 1 || Number(rating) > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5"
            });
        }

        // Check complaint ownership and status
        const [complaints] = await db.promise().query(
            `SELECT c.complaint_id
             FROM complaints c
             JOIN statuses s ON c.status_id = s.status_id
             WHERE c.complaint_id = ?
             AND c.user_id = ?
             AND s.status_name = 'Resolved'`,
            [id, req.user.user_id]
        );

        if (complaints.length === 0) {
            return res.status(400).json({
                message: "Feedback is allowed only for your resolved complaints"
            });
        }

        // Check existing feedback
        const [existing] = await db.promise().query(
            "SELECT feedback_id FROM feedback WHERE complaint_id = ?",
            [id]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                message: "Feedback already submitted for this complaint"
            });
        }

        await db.promise().query(
            `INSERT INTO feedback
             (complaint_id, user_id, rating, comments)
             VALUES (?, ?, ?, ?)`,
            [
                id,
                req.user.user_id,
                Number(rating),
                comments || null
            ]
        );

        res.status(201).json({
            message: "Feedback submitted successfully!",
            complaint_id: id,
            rating: Number(rating)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error submitting feedback"
        });
    }
};


// VIEW MY FEEDBACK
exports.getMyFeedback = async (req, res) => {
    try {
        const [feedback] = await db.promise().query(
            `SELECT
                f.feedback_id,
                f.complaint_id,
                c.title,
                f.rating,
                f.comments,
                f.created_at
             FROM feedback f
             JOIN complaints c ON f.complaint_id = c.complaint_id
             WHERE f.user_id = ?
             ORDER BY f.created_at DESC`,
            [req.user.user_id]
        );

        res.status(200).json({
            total: feedback.length,
            feedback
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error retrieving feedback"
        });
    }
};
