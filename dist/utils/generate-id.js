"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = void 0;
const ulid_1 = require("ulid");
const ulid = (0, ulid_1.monotonicFactory)();
const generateId = () => {
    return ulid();
};
exports.generateId = generateId;
