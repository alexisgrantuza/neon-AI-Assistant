const bcrypt = require("bcrypt");
const UserModel = require("../models/User");

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email });
      if (user) {
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
          req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
          };
          res.json("Success");
        } else {
          res.status(401).json("Password doesn't match");
        }
      } else {
        res.status(404).json("No Records found");
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  logout: (req, res) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          res.status(500).json({ error: "Failed to logout" });
        } else {
          res.status(200).json("Logout successful");
        }
      });
    } else {
      res.status(400).json({ error: "No session found" });
    }
  },

  getUser: (req, res) => {
    if (req.session.user) {
      res.json({ user: req.session.user });
    } else {
      res.status(401).json("Not authenticated");
    }
  },
};

module.exports = authController;
