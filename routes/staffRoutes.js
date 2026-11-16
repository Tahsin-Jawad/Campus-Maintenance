
const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const verifyStaff = require("../middleware/staffMiddleware");

const {
    getAssignedComplaints,
    updateAssignedComplaintStatus
} = require("../controllers/staffController");

router.use(verifyToken, verifyStaff);

router.get("/complaints", getAssignedComplaints);
router.patch("/complaints/:id/status", updateAssignedComplaintStatus);

module.exports = router;
