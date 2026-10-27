/*
    MIT License
    Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
    Mindoro State University - Philippines
*/

import express from "express";
const router = express.Router();

import { homePage } from "../controllers/homeController.js";
import { book } from "../controllers/book.js";
import { user } from "../controllers/user.js";
import {
  loginPage,
  registerPage,
  forgotPasswordPage,
  dashboardPage,
  loginUser,
  registerUser,
  logoutUser
} from "../controllers/authController.js";

import { requireAuth, requireRole } from "../middleware/auth.js";


router.get("/login", loginPage);
router.post("/login", loginUser);
router.get("/register", registerPage);
router.post("/register", registerUser);
router.get("/forgot-password", forgotPasswordPage);

router.get("/", homePage);


router.use(requireAuth);


router.get("/dashboard", dashboardPage);
router.get("/logout", logoutUser);


router.get("/admin", requireRole("admin"), dashboardPage);
router.get("/users", requireRole("admin"), user.index);
router.post("/users", requireRole("admin"), user.insert);
router.post("/users/:id", requireRole("admin"), user.update);
router.delete("/users/:id", requireRole("admin"), user.delete);


router.get("/add", requireRole("admin", "librarian"), book.add);
router.post("/insert", requireRole("admin", "librarian"), book.insert);
router.get("/edit/:id", requireRole("admin", "librarian"), book.edit);
router.post("/books/:id", requireRole("admin", "librarian"), book.update);
router.delete("/books/:id", requireRole("admin", "librarian"), book.delete);


export default router;
