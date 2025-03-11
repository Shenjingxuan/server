const express = require('express');
const http = require('http');
const WebSocketServer = require('./utils/websocket');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const userRoutes = require('./routes/user');
const mqttRoutes = require('./routes/mqtt');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer(server);

// Middleware configuration
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'"],
            connectSrc: ["'self'", "ws:", "wss:"]
        }
    }
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 添加静态文件服务
app.use(express.static('public'));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);

// Register routes
app.use('/api/users', userRoutes);
app.use('/api/mqtt', mqttRoutes);

// Home route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API' });
});

// 修改服务器启动代码
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = { app, server };