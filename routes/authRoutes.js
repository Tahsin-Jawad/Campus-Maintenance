const express = require("express");
const router = express.Router();

const {
    register,
    login
} = require("../controllers/authController");

const verifyToken = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);

// PROTECTED PROFILE API
router.get("/profile", verifyToken, (req, res) => {
    res.json({
        message: "Protected profile accessed successfully!",
        user: req.user
    });
});

module.exports = router;