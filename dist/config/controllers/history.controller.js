"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserHistory = void 0;
const history_model_1 = __importDefault(require("../models/history.model"));
const getUserHistory = async (req, res) => {
    try {
        const userId = req.user.userId;
        const history = await history_model_1.default.find({ user: userId })
            .populate('weather')
            .sort({ requestedAt: -1 });
        res.json(history);
    }
    catch (err) {
        res.status(500).json({
            error: 'Failed to fetch history',
            details: err.message,
        });
    }
};
exports.getUserHistory = getUserHistory;
