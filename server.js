const express = require('express');
const dotenv = require('dotenv');
const logger = require('./middlewares/logger');
const connectDB = require('./config/db');
const fileupload = require('express-fileupload');
const errorHandler = require('./middlewares/errorHandler');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const path = require('path');

// Load env vars
dotenv.config({ path: './config/config.env' });

connectDB();

// Router
const bootcamp = require('./routes/bootcamp');
const course = require('./routes/courses');
const auth = require('./routes/auth');
const user = require('./routes/user');
const review = require('./routes/reviews');

const app = express();

app.use(express.json());

app.use(logger);

// File Upload
app.use(fileupload());

// Sanitize NoSQL injection
app.use(mongoSanitize());

// Set Security headers
app.use(helmet());

// XSS clean
app.use(xss());

// Rate Limiting 
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 1min
    max: 1000
});

app.use(rateLimit(limiter));

// Prevent http param pollution
app.use(hpp());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/bootcamps', bootcamp);
app.use('/api/v1/courses', course);
app.use('/api/v1/auth', auth);
app.use('/api/v1/user', user);
app.use('/api/v1/review', review);
app.use(errorHandler);

const PORT = process.env.PORT || 5555;

const server = app.listen(PORT, () => {
    console.log("Server running in " + process.env.NODE_ENV + " mode on Port " + PORT);
})

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
})