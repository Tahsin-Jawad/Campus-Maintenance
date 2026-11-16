
const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    submitFeedback,
    getMyFeedback
} = require("../controllers/feedbackController");

router.post("/:id", verifyToken, submitFeedback);
router.get("/my", verifyToken, getMyFeedback);

module.exports = router;
