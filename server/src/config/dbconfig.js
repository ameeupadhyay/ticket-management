const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    logging: false,

    pool: {
      max: 10,          // maximum connections
      min: 0,           // minimum connections
      acquire: 30000,   // max time (ms) pool tries before throwing error
      idle: 10000,      // max time (ms) connection can be idle
      evict: 1000,      // remove idle connections after this time
    },

    dialectOptions: {
      connectTimeout: 60000, // DB connection timeout
    },

    retry: {
      max: 3, // retry connection 3 times
    },
  }
);

// Test DB connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};

module.exports = {
  sequelize,
  connectDB,
};