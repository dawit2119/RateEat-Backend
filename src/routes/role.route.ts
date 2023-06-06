import express from "express";
import {
  createRole,
  getRoles,
  deleteRole,
} from "../controllers/role.controller";

const router = express.Router();

router.route("/").get(getRoles).post(createRole);
router.route("/:id").delete(deleteRole);

export default router;