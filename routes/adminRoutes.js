
const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/adminMiddleware");

const {
    getAllComplaints,
    getMaintenanceStaff,
    updateComplaintStatus,
    assignComplaint
} = require("../controllers/adminController");

// All routes require Admin access
router.use(verifyToken, verifyAdmin);

router.get("/complaints", getAllComplaints);
router.get("/staff", getMaintenanceStaff);
router.patch("/complaints/:id/status", updateComplaintStatus);
router.post("/complaints/:id/assign", assignComplaint);

module.exports = router;
