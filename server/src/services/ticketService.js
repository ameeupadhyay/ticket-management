const Ticket = require("../models/Ticket");
const TicketActivity = require("../models/TicketActivity");

const generateTicketCode = require("../utils/generateTicketCode");
const { Op } = require("sequelize");

const {
    TICKET_STATUS,
    TICKET_PRIORITY,
} = require("../utils/constant");
const AppError = require("../utils/AppError");
const { get } = require("../routes");
const { sequelize } = require("../config/dbconfig");

const createTicket = async (payload) => {
    const {
        customerName,
        customerEmail,
        customerPhone,
        title,
        description,
        priority,
        status,
        assignedTo,
        dueDate,
    } = payload;

    /*
      REQUIRED FIELD VALIDATION
    */

    if (!customerName) {
        throw new AppError("Customer name is required", 400);
    }

    if (!customerEmail) {
        throw new AppError("Customer email is required", 400);
    }

    if (!title) {
        throw new AppError("Title is required", 400);
    }

    if (!description) {
        throw new AppError("Description is required", 400);
    }

    /*
      PRIORITY VALIDATION
    */

    if (
        priority &&
        !TICKET_PRIORITY.includes(priority)
    ) {
        throw new AppError("Invalid priority value", 400);
    }

    /*
      STATUS VALIDATION
    */

    if (
        status &&
        !TICKET_STATUS.includes(status)
    ) {
        throw new AppError("Invalid status value", 400);
    }

    /*
      GET LAST TICKET
    */

    const lastTicket = await Ticket.findOne({
        order: [["id", "DESC"]],
    });

    const lastTicketId = lastTicket
        ? lastTicket.id
        : 0;

    /*
      GENERATE TICKET CODE
    */

    const ticketCode =
        generateTicketCode(lastTicketId);

    /*
      CREATE TICKET
    */

    const ticket = await Ticket.create({
        ticketCode,
        customerName,
        customerEmail,
        customerPhone,
        title,
        description,
        priority: priority || "MEDIUM",
        status: status || "OPEN",
        assignedTo,
        dueDate,
    });

    return ticket;
};

const getTickets = async (query) => {
    const {
        search,
        status,
        priority,
        assignedTo,
        page = 1,
        limit = 10,
    } = query;

    /*
      PAGINATION
    */

    const offset =
        (page - 1) * limit;

    /*
      WHERE CONDITION
    */

    const whereCondition = {};

    /*
      SEARCH
    */

    if (search) {
        whereCondition[Op.or] = [
            {
                title: {
                    [Op.like]: `%${search}%`,
                },
            },

            {
                customerName: {
                    [Op.like]: `%${search}%`,
                },
            },

            {
                ticketCode: {
                    [Op.like]: `%${search}%`,
                },
            },
        ];
    }

    /*
      FILTERS
    */

    if (status) {
        whereCondition.status = status;
    }

    if (priority) {
        whereCondition.priority = priority;
    }

    if (assignedTo) {
        whereCondition.assignedTo =
            assignedTo;
    }

    /*
      FETCH TICKETS
    */

    const tickets =
        await Ticket.findAndCountAll({
            where: whereCondition,

            limit: Number(limit),

            offset: Number(offset),

            order: [["id", "DESC"]],
        });

    return {
        totalRecords: tickets.count,

        totalPages: Math.ceil(
            tickets.count / limit
        ),

        currentPage: Number(page),

        data: tickets.rows,
    };
};

const updateTicket = async (
    ticketId,
    payload
) => {

    const {
        status,
        priority,
        assignedTo,
        dueDate,
        createdBy,
    } = payload;

    const transaction =
        await sequelize.transaction();

    try {

        /*
          FIND TICKET
        */

        const ticket =
            await Ticket.findByPk(
                ticketId,
                { transaction }
            );

        if (!ticket) {

            await transaction.rollback();

            throw new AppError(
                "Ticket not found",
                404
            );
        }

        /*
          VALIDATE STATUS
        */

        if (
            status &&
            !TICKET_STATUS.includes(status)
        ) {

            await transaction.rollback();

            throw new AppError(
                "Invalid status value",
                400
            );
        }

        /*
          VALIDATE PRIORITY
        */

        if (
            priority &&
            !TICKET_PRIORITY.includes(priority)
        ) {

            await transaction.rollback();

            throw new AppError(
                "Invalid priority value",
                400
            );
        }

        /*
          STORE OLD STATUS
        */

        const oldStatus =
            ticket.status;

        /*
          UPDATE FIELDS
        */

        if (status) {
            ticket.status = status;
        }

        if (priority) {
            ticket.priority = priority;
        }

        if (assignedTo) {
            ticket.assignedTo =
                assignedTo;
        }

        if (dueDate) {
            ticket.dueDate =
                dueDate;
        }

        /*
          SAVE TICKET
        */

        await ticket.save({
            transaction,
        });

        /*
          CREATE ACTIVITY
          ONLY IF STATUS CHANGED
        */

        if (
            status &&
            oldStatus !== status
        ) {

            await TicketActivity.create(
                {
                    ticketId:
                        ticket.id,

                    type:
                        "STATUS_CHANGED",

                    message:
                        `Status changed from ${oldStatus} to ${status}`,

                    oldStatus,

                    newStatus:
                        status,

                    createdBy:
                        createdBy ||
                        "System",
                },
                { transaction }
            );
        }

        /*
          COMMIT
        */

        await transaction.commit();

        return ticket;

    } catch (error) {

        /*
          ROLLBACK
        */

        await transaction.rollback();

        throw error;
    }
};

const getTicketDetails = async (
    ticketId
) => {

    const ticket =
        await Ticket.findByPk(
            ticketId,
            {
                include: [
                    {
                        model:
                            TicketActivity,

                        as: "activities",

                        attributes: [
                            "id",
                            "type",
                            "message",
                            "oldStatus",
                            "newStatus",
                            "createdBy",
                            "created_at",
                        ],
                    },
                ],
            }
        );

    if (!ticket) {
        throw new AppError(
            "Ticket not found",
            404
        );
    }

    return ticket;
};

const addTicketActivity = async (
    ticketId,
    payload
) => {

    const {
        message,
        createdBy,
    } = payload;
    const transaction =
        await sequelize.transaction();

    /*
      VALIDATION
    */

    if (!message) {
        throw new AppError(
            "Message is required",
            400
        );
    }

    if (!createdBy) {
        throw new AppError(
            "CreatedBy is required",
            400
        );
    }

    /*
      CHECK TICKET EXISTS
    */

    const ticket =
        await Ticket.findByPk(ticketId);

    if (!ticket) {
        throw new AppError(
            "Ticket not found",
            404
        );
    }

    /*
      CREATE ACTIVITY
    */

    const activity =
        await TicketActivity.create({
            ticketId,

            type: "NOTE_ADDED",

            message,

            createdBy,
        }, { transaction });

    await transaction.commit();

    return activity;
};

module.exports = {
    createTicket,
    getTickets,
    updateTicket,
    getTicketDetails,
    addTicketActivity
};
