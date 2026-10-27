/*
    MIT License

    Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
    Mindoro State University - Philippines

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/

import bcrypt from "bcrypt";
import { User, sequelize } from "../models/userModel.js";
await sequelize.sync();

const user = {

  index: async (req, res) => {
    const users = await User.findAll({ order: [["id", "ASC"]] });
    res.render("admin/users", {
      title: "Users",
      userName: req.user.name || req.user.email,
      role: req.user.role,
      users: users
    });
  },

 
  insert: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({ name, email, password: hashedPassword, role });
      req.flash("success_msg", "User Added Succesfully");
    } catch (err) {
      console.error("Insert user error:", err);
      req.flash("error_msg", "Error: Failed to add user.");
    }
   
    res.redirect("/users");
  },

  
  update: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      const data = { name, email, role };
     
      if (password) {
        data.password = await bcrypt.hash(password, 10);
      }

      await User.update(data, { where: { id: req.params.id } });
      req.flash("success_msg", "User Updated Succesfully");
    } catch (err) {
      console.error("Update user error:", err);
      req.flash("error_msg", "Error: Failed to update user.");
    }
    res.redirect("/users");
  },

 
  delete: async (req, res) => {
    try {
      const data = await User.findByPk(req.params.id);
      if (!data) {
        return res.status(404).json({ message: "User not found" });
      }
      await data.destroy();
      req.flash("error_msg", " User Deleted Succesfully");
      return res.json({ message: "User Deleted Succesfully", redirect: "/users" });
    } catch (error) {
      console.error("Delete user error:", error);
      return res.status(500).json({ message: "Failed to delete user." });
    }
  }
};

export { user };
