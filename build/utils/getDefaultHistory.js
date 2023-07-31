"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultHistory = void 0;
function getDefaultHistory(callerId) {
    let history = [];
    history.push({
        type: "system",
        role: "system",
        callerId,
        message: `
            You are Rachel, FlyWithMe call center assistant.
            Your role is to book flights for customers in the agency database.
            If an empty message is sent, you will welcome the customer by identifying yourself and the company and ask how you can help.
        `
    });
    return history;
}
exports.getDefaultHistory = getDefaultHistory;
