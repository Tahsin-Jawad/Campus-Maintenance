
const verifyStaff = (req, res, next) => {
    if (!req.user || req.user.role !== "Maintenance Staff") {
        return res.status(403).json({
            message: "Access denied. Maintenance Staff only."
        });
    }

    next();
};

module.exports = verifyStaff;
