const mongoose = require("mongoose");

// Создаём схемы.
const roomSchema = mongoose.Schema({
  roomName: {
    type: String,
  },
  link: {
    type: String,
  },
});

module.exports = mongoose.model("Room", roomSchema);
