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

import { Books, sequelize } from "../models/Books.js";
await sequelize.sync();


const backTo = (req) => (req.session.userId ? "/dashboard" : "/");

const book = {
  index: async (req, res) => {
    const books = await Books.findAll({ order: [["id", "DESC"]] });
    res.render("home", {
      books: books,
      success_msg: req.flash("success_msg")
    });
  },

  add: (req, res) => {
    res.render("add");
  },

  insert: async (req, res) => {
    try {
      const { Name, category, author, publisher, price, pub_year } = req.body;
      await Books.create({ Name, category, author, publisher, price, pub_year });
      req.flash("success_msg", "Book Added Succesfully");
    } catch (err) {
      console.error("Insert error:", err);
      req.flash("error_msg", "Error: Failed to add book.");
    }
   
    res.redirect(backTo(req));
  },

  edit: async (req, res) => {
    const { id } = req.params;
    const data = await Books.findByPk(id);
    res.render("edit", { data });
  },

  update: async (req, res) => {
    try {
      const { Name, category, author, publisher, price, pub_year } = req.body;
      await Books.update(
        { Name, category, author, publisher, price, pub_year },
        { where: { id: req.params.id } }
      );
      req.flash("success_msg", "Book Updated Succesfully");
    } catch (err) {
      console.error("Update error:", err);
      req.flash("error_msg", "Error: Failed to update book.");
    }

    res.redirect(backTo(req));
  },

  delete: async (req, res) => {
    try {
      const book = await Books.findByPk(req.params.id);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      await book.destroy();
      req.flash("error_msg", "Book Deleted Succesfully");
    
      return res.json({ message: " Book Deleted Succesfully", redirect: backTo(req) });
    } catch (error) {
      console.error("Delete error:", error);
      return res.status(500).json({ message: "Failed to delete book." });
    }
  }
};

export { book };
