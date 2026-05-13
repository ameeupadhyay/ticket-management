const Sequelize = require("sequelize");
const { sequelize } = require("../config/dbconfig");

const TicketActivity = sequelize.define("ticketactivities", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },

    ticketId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: "tickets",
            key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },

    type: {
        type: Sequelize.ENUM(
            "CREATED",
            "STATUS_CHANGED",
            "NOTE_ADDED",
            "UPDATED",
            "ASSIGNED"
        ),
        allowNull: false,
    },

    message: {
        type: Sequelize.TEXT,
        allowNull: true,
    },

    oldStatus: {
        type: Sequelize.STRING,
        allowNull: true,
    },

    newStatus: {
        type: Sequelize.STRING,
        allowNull: true,
    },

    createdBy: {
        type: Sequelize.STRING,
        allowNull: false,
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
});

module.exports = TicketActivity;