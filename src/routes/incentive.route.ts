import express from "express";
import{
    getIncentive,
    updateIncentive,
    withdrawIncentive
} from "../controllers/incentive.controller";

const router = express.Router({mergeParams: true});
router.route("/incentive").get(getIncentive);
router.route("/incentive/earn").put(updateIncentive);
router.route("/incentive/withdraw").put(withdrawIncentive);

export default router;