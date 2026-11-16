
const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    createComplaint,
    getMyComplaints,
    getComplaintById,
    getComplaintHistory
} = require("../controllers/complaintController");

// Submit Complaint
router.post("/", verifyToken, createComplaint);

// View All My Complaints
router.get("/my", verifyToken, getMyComplaints);

// View Complaint History
router.get("/:id/history", verifyToken, getComplaintHistory);

// View Single Complaint
router.get("/:id", verifyToken, getComplaintById);

module.exports = router;
