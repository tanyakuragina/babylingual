const mongoose = require("mongoose");
const User = require("../db/user");

// Создаём схемы.
const profileSchema = mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "users" },

  interests: {
    type: String,
  },
  aboutUs: {
    type: String,
  },
});

module.exports = mongoose.model("Profile", profileSchema);
