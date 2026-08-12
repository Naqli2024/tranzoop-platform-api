import express from "express";
import { createInitialAdmin } from "./setup.controller.js";

const router = express.Router();

router.post("/initial-admin", createInitialAdmin);

export default router;