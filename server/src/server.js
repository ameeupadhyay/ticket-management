require('dotenv').config();

const app = require('./app');
const { connectDB } = require('./config/dbconfig');

const PORT = process.env.PORT || 8000;

// Connect Database
connectDB();

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

