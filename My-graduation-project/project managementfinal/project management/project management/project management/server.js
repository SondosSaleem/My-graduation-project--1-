const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const ApiError = require("./utils/apiError");
const globalErorr = require("./middlewares/erorrMiddleWare"); 
dotenv.config({ path: 'config.env' });
const dbConnection = require("./config/database");
const userRoute = require('./routes/userRoute');
const authRoute = require('./routes/authRoute');
const taskRoute = require('./routes/taskRoute');
const teamRoute = require('./routes/teamRoute');
const scheduleRoute = require('./routes/scheduleRoute');
const notificationRoutes = require('./routes/notificationRoute');

// Connect With DB
dbConnection();

// express app
const app = express();

// middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV == "development") {
    app.use(morgan('dev'));
    console.log(`Mode: ${process.env.NODE_ENV}`);
}

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// Mount Routes
app.use('/api/v1/users', userRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/tasks', taskRoute);
app.use('/api/v1/teams', teamRoute);
app.use('/api/v1/schedules', scheduleRoute);
app.use('/api/v1/notifications', notificationRoutes);

app.post('/predict', async (req, res) => {
    const { rdSpend, administration, marketingSpend, state } = req.body;
    try {
        const response = await axios.post('http://127.0.0.1:5000/predict', {
            "R&D Spend": rdSpend,
            "Administration": administration,
            "Marketing Spend": marketingSpend,
            "State": state
        });
        res.json({ predicted_profit: response.data.predicted_profit });
    } catch (error) {
        console.error('Error predicting profit:', error);
        res.status(500).json({ error: 'Error predicting profit', details: error.message });
    }
});

// Route Not Handling
app.all("*", (req, res, next) => {
    next(new ApiError(`Can't Find This Route ${req.originalUrl}`, 400));
});

// Global Error Handling Middleware
app.use(globalErorr);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
    console.log("App Run Successfully");
});

// Handle Rejection Outside Express
process.on("unhandledRejection", (err) => {
    console.error(`unhandledRejection: ${err.name} | ${err.message}`);
    server.close(() => {
        console.error(`Application Shut Down Now...`);
        process.exit(1);
    });
});
