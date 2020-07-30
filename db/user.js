const mongoose = require("mongoose");

// Создаём схемы.
const userSchema = mongoose.Schema({
  name: {
    type: String,
  },
  surname: {
    type: String,
  },
  childName: {
    type: String,
  },
  nativeLanguage: {
    type: String,
  },
  email: {
    type: String,
    unique: [true, "Такой email уже существует"],
    required: [true, "Введите email"],
  },
  password: {
    type: String,
    required: [true, "Введите пароль"],
  },
});

module.exports = mongoose.model("User", userSchema);
