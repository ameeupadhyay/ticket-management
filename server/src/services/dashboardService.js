const { Op } = require("sequelize");
const Ticket = require("../models/Ticket");
const AppError = require("../utils/AppError");

const getDashboardData = async () => {
    const today = new Date();

    /*
      TOTAL TICKETS
    */
    const totalTickets = await Ticket.count();

    /*
      STATUS COUNTS
    */
    const openTickets = await Ticket.count({
        where: { status: "OPEN" },
    });

    const inProgressTickets = await Ticket.count({
        where: { status: "IN_PROGRESS" },
    });

    const resolvedTickets = await Ticket.count({
        where: { status: "RESOLVED" },
    });

    /*
      OVERDUE TICKETS
      dueDate < today AND not resolved/closed
    */
    const overdueTickets = await Ticket.count({
        where: {
            dueDate: {
                [Op.lt]: today,
            },
            status: {
                [Op.notIn]: ["RESOLVED", "CLOSED"],
            },
        },
    });

    /*
      HIGH PRIORITY TICKETS
    */
    const highPriorityTickets = await Ticket.count({
        where: {
            priority: "HIGH",
        },
    });

    /*
      LATEST 5 TICKETS
    */
    const latestTickets = await Ticket.findAll({
        limit: 5,
        order: [["created_at", "DESC"]],
    });

    return {
        totalTickets,
        openTickets,
        inProgressTickets,
        resolvedTickets,
        overdueTickets,
        highPriorityTickets,
        latestTickets,
    };
};

module.exports = {
    getDashboardData,
};