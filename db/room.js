const mongoose = require("mongoose");
const User = require("../db/user");

// Создаём схемы.
const roomSchema = mongoose.Schema({
  roomName: {
    type: String,
  },
  link: {
    type: String,
  },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});



module.exports = mongoose.model("Room", roomSchema);
