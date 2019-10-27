const express = require('express');
const dotenv = require('dotenv');
const logger = require('./middlewares/logger');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

// Load env vars
dotenv.config({ path: './config/config.env' });

connectDB();

// Router
const bootcamp = require('./routes/bootcamp');

const app = express();

app.use(express.json());

app.use(logger);
app.use('/api/v1/bootcamps', bootcamp);
app.use(errorHandler);

const PORT = process.env.PORT || 5555;

const server = app.listen(PORT, () => {
    console.log("Server running in " + process.env.NODE_ENV + " mode on Port " + PORT);
})

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
})