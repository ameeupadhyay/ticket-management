const asyncHandler = require("../middlewares/asyncHandler");
const dashboardService = require("../services/dashboardService");

const getDashboard = asyncHandler(async (req, res) => {
    const data = await dashboardService.getDashboardData();

    res.status(200).json({
        success: true,
        message: "Dashboard data fetched successfully",
        data,
    });
});

module.exports = {
    getDashboard,
};