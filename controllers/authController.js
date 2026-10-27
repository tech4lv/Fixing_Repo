/*
    MIT License
    Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
    Mindoro State University - Philippines
*/

import bcrypt from "bcrypt";
import { User, sequelize } from "../models/userModel.js";
import { Books } from "../models/Books.js";
await sequelize.sync();


export const loginPage = (req, res) => {
  res.render("login", { title: "Login" });
};

export const registerPage = (req, res) => {
  res.render("register", { title: "Register" });
};

export const forgotPasswordPage = (req, res) => {
  res.render("forgotpassword", { title: "Forgot Password" });
};

export const dashboardPage = async (req, res) => {
  const currentUser = req.user || (req.session.userId ? await User.findByPk(req.session.userId) : null);

  if (!currentUser) {
    req.session.destroy(() => res.redirect("/login"));
    return;
  }

  req.session.role = currentUser.role;
  req.session.userName = currentUser.name || currentUser.email;

  const view =
    currentUser.role === "admin" ? "admin/dashboard" :
    currentUser.role === "librarian" ? "librarian/dashboard" :
    "staff/dashboard";

  try {
    const books = await Books.findAll({ order: [["id", "DESC"]] });
    res.render(view, {
      title: `${currentUser.role} Dashboard`,
      userName: req.session.userName,
      role: currentUser.role,
      books: books
    });
  } catch (err) {
    console.log("❌ Dashboard Error:", err);
    res.render(view, {
      title: `${currentUser.role} Dashboard`,
      userName: req.session.userName,
      role: currentUser.role,
      books: []
    });
  }
};


export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.send("User not found");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.send("Incorrect password");
  }

  req.session.userId = user.id;
  req.session.role = user.role;
  req.session.userName = user.name || user.email;

  
  return res.redirect("/dashboard");
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.send("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "staff"
  });


  req.session.userId = user.id;
  req.session.role = user.role;
  req.session.userName = user.name || user.email;

  return res.redirect("/dashboard");
};

export const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
    }
    res.redirect("/login");
  });
};
