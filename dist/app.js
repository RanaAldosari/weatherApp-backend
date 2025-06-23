"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const logger_1 = __importDefault(require("./utils/logger"));
const helpers_1 = require("./utils/helpers");
const http_status_1 = require("./utils/http-status");
const error_1 = require("./utils/error");
const database_1 = require("./config/database");
const auth_middleware_1 = require("./middleware/auth.middleware");
// Load env variables
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('tiny', {
    stream: {
        write: (msg) => logger_1.default.info(msg.trim()),
    },
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// basic routes
app.get('/', (req, res) => {
    res.status(http_status_1.OK).json({ message: 'Weather API - Welcome!' });
});
(async () => {
    try {
        await (0, database_1.connectDB)();
        // routers
        const usersRoutes = (await Promise.resolve().then(() => __importStar(require('./routes/users.routes')))).default;
        const weatherRoutes = (await Promise.resolve().then(() => __importStar(require('./routes/weather.routes')))).default;
        const historyRoutes = (await Promise.resolve().then(() => __importStar(require('./routes/history.routes')))).default;
        app.use('/auth', usersRoutes);
        app.use('/weather', auth_middleware_1.authorized, weatherRoutes);
        app.use('/history', auth_middleware_1.authorized, historyRoutes);
        const PORT = process.env.PORT || 3000;
        app.listen(helpers_1.port, () => logger_1.default.info(`Server is connected on port ${PORT}`));
    }
    catch (error) {
        logger_1.default.error('Failed to connect with MongoDB:', error);
        process.exit(1);
    }
})();
// Error handling middleware
app.use((err, req, res, next) => {
    logger_1.default.error('Error:', err.message);
    if (err instanceof error_1.AppError) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            ...(helpers_1.dev && { stack: err.stack }),
        });
        return;
    }
    res.status(http_status_1.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong!',
        ...(helpers_1.dev && { error: err.message, stack: err.stack }),
    });
});
