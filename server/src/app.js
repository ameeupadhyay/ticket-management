const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/dbconfig');
require('dotenv').config();
const routes = require('./routes');
const errorMiddleware = require(
  "./middlewares/errorMiddleware"
);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Ticket Management System API');
});

app.use('/api', routes);
app.use(errorMiddleware);

module.exports = app;