"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signOut = exports.signIn = exports.signUp = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("../models/user.model"));
const jwt_1 = require("../config/jwt");
// create token to user
const generateToken = (id, role) => {
    return jsonwebtoken_1.default.sign({ type: 'access', user: { id, role } }, jwt_1.jwtConfig.secret, { expiresIn: '1h' });
};
// sign-up
const signUp = async (req, res) => {
    try {
        const { email, password, role = 'user' } = req.body;
        if (!email || !password) {
            res.status(400).json({ status: 'fail', message: 'Email and password are required' });
            return;
        }
        const existingUser = await user_model_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ status: 'fail', message: 'Email already registered' });
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = await user_model_1.default.create({
            email,
            password: hashedPassword,
            role
        });
        const token = generateToken(newUser.id, newUser.role);
        res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            user: {
                id: newUser.id,
                email: newUser.email,
                role: newUser.role
            },
            token
        });
    }
    catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to sign up',
            details: err.message
        });
    }
};
exports.signUp = signUp;
// sign-in
const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                status: 'fail',
                message: 'Email and password are required'
            });
            return;
        }
        const user = await user_model_1.default.findOne({ email }).select('+password');
        if (!user) {
            res.status(401).json({
                status: 'fail',
                message: 'Email is Invalid'
            });
            return;
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({
                status: 'fail',
                message: 'Invalid credentials'
            });
            return;
        }
        const token = generateToken(user.id, user.role);
        res.status(200).json({
            status: 'success',
            message: 'Sign in successfully',
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            },
            token
        });
    }
    catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Signin failed',
            details: err.message
        });
    }
};
exports.signIn = signIn;
// sign-out
const signOut = async (_req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'sign out successfully'
    });
};
exports.signOut = signOut;
