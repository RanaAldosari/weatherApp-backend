"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const router = express_1.default.Router();
// authintication-path
router.post('/signup', auth_controller_1.signUp);
router.post('/signin', auth_controller_1.signIn);
router.post('/signout', auth_controller_1.signOut);
exports.default = router;
