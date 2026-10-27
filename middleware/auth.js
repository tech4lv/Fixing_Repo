import { User } from "../models/userModel.js";


export const requireAuth = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res.redirect("/login");
    }

    const user = await User.findByPk(req.session.userId);

    if (!user) {
      req.session.destroy(() => res.redirect("/login"));
      return;
    }

    req.user = user;
    res.locals.currentUser = user;
    next();
  } catch (err) {
    console.log("❌ requireAuth error:", err);
    return res.redirect("/login");
  }
};


export const requireRole = (...roles) => {
  return async (req, res, next) => {
    try {
      const user = req.user || (req.session.userId ? await User.findByPk(req.session.userId) : null);

      if (!user || !roles.includes(user.role)) {
        return res.status(403).send("You do not have permission to perform this action.");
      }

      req.user = user;
      res.locals.currentUser = user;
      next();
    } catch (err) {
      console.log("❌ requireRole error:", err);
      return res.status(403).send("You do not have permission to perform this action.");
    }
  };
};
