import express from 'express';
import cors from 'cors';
import signUpRoute from './routes/authRoutes.js';
import userRoute from './routes/usersRoute.js';
import channelRoute from './routes/channelRoutes.js';

const app = express();

const corsOptions = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

app.use(express.json());
app.use(cors(corsOptions));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        pid: process.pid,
    });
});

// API routes
app.use('/user', signUpRoute);
app.use('/v1/user', userRoute);
app.use('/v1/channel', channelRoute);

app.post(`/bot`, (req, res) => {
    console.log(req.body);
    // bot.processUpdate(req.body);
    res.sendStatus(200);
})

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

export default app;
