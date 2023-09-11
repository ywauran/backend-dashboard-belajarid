// routes/smaRoutes.js

import express from "express";
import SMAController from "../controllers/SMAController.js";

const router = express.Router();

router.get("/", SMAController.fetchData);

export default router;
