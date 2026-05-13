const Sequelize = require("sequelize");
const { sequelize } = require("../config/dbconfig");
const TicketActivity = require("./TicketActivity");

const Ticket = sequelize.define("tickets", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },

    ticketCode: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },

    customerName: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    customerEmail: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    customerPhone: {
        type: Sequelize.STRING,
        allowNull: true,
    },

    title: {
        type: Sequelize.STRING,
        allowNull: true,
    },

    description: {
        type: Sequelize.TEXT,
        allowNull: true,
    },

    priority: {
        type: Sequelize.ENUM(
            "LOW",
            "MEDIUM",
            "HIGH",
            "URGENT"
        ),
        allowNull: false,
        defaultValue: "MEDIUM",
    },

    status: {
        type: Sequelize.ENUM(
            "OPEN",
            "IN_PROGRESS",
            "ON_HOLD",
            "RESOLVED",
            "CLOSED"
        ),
        allowNull: false,
        defaultValue: "OPEN",
    },

    assignedTo: {
        type: Sequelize.STRING,
        allowNull: true,
    },

    dueDate: {
        type: Sequelize.DATE,
        allowNull: true,
    },

    created_at: {
        type: "TIMESTAMP",
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },

    updated_at: {
        type: "TIMESTAMP",
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
}, {
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
}
);

Ticket.hasMany(TicketActivity, {
    foreignKey: "ticketId",
    as: "activities",
});

module.exports = Ticket;