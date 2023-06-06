"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawIncentive = exports.updateIncentive = exports.getIncentive = void 0;
const incentive_1 = __importDefault(require("../models/incentive/incentive"));
// Get incentives from a user by user id
// GET users/:userId/incentive
const getIncentive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.params.userId;
        // Find the incentive by user id
        const incentive = yield incentive_1.default.findOne({
            where: { user_id },
        });
        if (!incentive) {
            const incentive = new incentive_1.default({ user_id: user_id });
            yield incentive.save();
            return res.status(404).json({ message: "Incentive not found" });
        }
        return res.status(200).json({ incentive });
    }
    catch (error) {
        // If there is any error, return a 500 response with the error message
        return res.status(500).json({ message: error.message });
    }
});
exports.getIncentive = getIncentive;
// Update an incentive by incentive id and user id
// PUT users/:userId/incentive/earn
const updateIncentive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the incentive id and user id from the request parameters
        const { userId } = req.params;
        // Get the money earned from the request body
        const { money_earned } = req.body;
        // Validate the money earned input
        if (!money_earned || typeof money_earned !== "number") {
            return res.status(400).json({ message: "Invalid money earned input" });
        }
        // Find the incentive by incentive id and user id
        const incentive = yield incentive_1.default.findOne({
            where: { user_id: userId },
        });
        if (!incentive) {
            return res.status(404).json({ message: "Incentive not found" });
        }
        // Update the current total and all time total by adding the money earned
        incentive.current_total += money_earned;
        incentive.all_time_total += money_earned;
        // Save the updated incentive
        yield incentive.save();
        return res.status(200).json({ incentive });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.updateIncentive = updateIncentive;
// Update an incentive by incentive id and user id
// PUT users/:userId/incentive/withdraw
const withdrawIncentive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the user id from the request parameters
        const user_id = req.params.userId;
        // Get the amount from the request body
        let { amount } = req.body;
        // Validate the amount input
        if (amount && (typeof amount !== "number" || amount <= 0)) {
            return res.status(400).json({ message: "Invalid amount input" });
        }
        const incentive = yield incentive_1.default.findOne({
            where: { user_id },
        });
        if (!incentive) {
            return res.status(404).json({ message: "Incentive not found" });
        }
        if (!amount) {
            amount = incentive.current_total;
        }
        // Check if the current total is enough to withdraw the amount
        if (incentive.current_total < amount) {
            return res.status(400).json({ message: "Insufficient funds" });
        }
        incentive.current_total -= amount;
        // Save the updated incentive
        yield incentive.save();
        // Return a 200 response with the updated incentive and the withdrawn amount
        return res.status(200).json({ incentive, amount });
    }
    catch (error) {
        // If there is any error, return a 500 response with the error message
        return res.status(500).json({ message: error.message });
    }
});
exports.withdrawIncentive = withdrawIncentive;
