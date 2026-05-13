'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("TicketActivities", {
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
          model: "Tickets",
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
  },


  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("TicketActivities");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_TicketActivities_type";'
    );
  }
};
