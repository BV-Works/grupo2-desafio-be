import express from "express";
import { login, getMe, logout } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// POST http://localhost:3000/api/auth/login
router.post("/login", login);
// GET http://localhost:3000/api/auth/me
router.get("/me", authMiddleware, getMe);
// POST http://localhost:3000/api/auth/logout
router.post("/logout", logout);

export default router;